import { Request, Response } from 'express';
import ChatHistory from '../models/chat.model';
import Book from '../models/book.model';
import { geminiService } from 'services/geminiService';

// Add a new chat message
export const addChat = async (req: Request, res: Response) => {
  try {
    const { userId, message, sessionId, bookId } = req.body;

    // First try to find an existing chat with this sessionId
    let chatHistory = await ChatHistory.findOne({ sessionId });
    const isNewChat = !chatHistory;

    if (isNewChat) {
      // Only create a new chat document if one doesn't exist for this sessionId
      const title = message.length > 50 
        ? message.substring(0, 50) + '...' 
        : message;
        
      chatHistory = new ChatHistory({
        userId,
        sessionId,
        title,
        messages: []
      });
    }

    // Get book context if bookId is provided
    let bookContext = '';
    if (bookId) {
      const book = await Book.findById(bookId);
      if (book) {
        bookContext = `Reference Book Context:
          Title: ${book.title}
          Author: ${book.author}
          Metadata: ${book.metadata}`;
      }
    }

    // Add user message to the existing or new chat document
    chatHistory.messages.push({
      sender: 'user',
      message,
      timestamp: new Date()
    });

    // Generate AI response with book context and chat history context
    const model = geminiService.getAI().getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Include previous messages for context
    const chatContext = chatHistory.messages
      .slice(-6) // Get last 6 messages for context
      .map(msg => `${msg.sender}: ${msg.message}`)
      .join('\n');

    const prompt = `${bookContext}\n\nChat History:\n${chatContext}\n\nUser: ${message}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const aiResponse = result.response.text();

    // Add AI response to the same chat document
    chatHistory.messages.push({
      sender: 'ai',
      message: aiResponse,
      timestamp: new Date()
    });

    // Save the updated chat document
    await chatHistory.save();

    // Return the entire updated chat history
    res.status(200).json({ 
      success: true, 
      data: chatHistory.toObject()
    });
  } catch (error) {
    console.error('Error in addChat:', error);
    res.status(500).json({ success: false, error: 'Error processing chat' });
  }
};

// Get user's chat history with titles
export const getUserChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const chats = await ChatHistory.find(
      { userId },
      'title createdAt updatedAt'
    ).sort('-createdAt');
    
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching chat history' });
  }
};

// Update chat title
export const updateChatTitle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    const chat = await ChatHistory.findByIdAndUpdate(
      chatId,
      { title },
      { new: true }
    );

    if (!chat) {
      res.status(404).json({ success: false, error: 'Chat not found' });
      return;
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error updating chat title' });
  }
};

// Add this new function to get a single chat
export const getChat = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const { chatId } = req.params;
    const chat = await ChatHistory.findById(chatId);
    
    
    if (!chat) {
      res.status(404).json({ success: false, error: 'Chat not found' });
      return;
    }
    
    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    console.error("Error in getChat:", error);
    res.status(500).json({ success: false, error: 'Error fetching chat' });
  }
};

// Add this new controller function
export const deleteAllChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await ChatHistory.deleteMany({ userId });
    
    res.status(200).json({ 
      success: true, 
      message: 'All chat history deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting chats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error deleting chat history' 
    });
  }
};

