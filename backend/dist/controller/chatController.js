"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllChats = exports.getChat = exports.updateChatTitle = exports.getUserChats = exports.addChat = void 0;
const chat_model_1 = __importDefault(require("../models/chat.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const geminiService_1 = require("../services/geminiService");
// Add a new chat message
const addChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, message, sessionId, bookId } = req.body;
        // First try to find an existing chat with this sessionId
        let chatHistory = yield chat_model_1.default.findOne({ sessionId });
        const isNewChat = !chatHistory;
        if (isNewChat) {
            // Only create a new chat document if one doesn't exist for this sessionId
            const title = message.length > 50
                ? message.substring(0, 50) + '...'
                : message;
            chatHistory = new chat_model_1.default({
                userId,
                sessionId,
                title,
                messages: []
            });
        }
        // Get book context if bookId is provided
        let bookContext = '';
        if (bookId) {
            const book = yield book_model_1.default.findById(bookId);
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
        const model = geminiService_1.geminiService.getAI().getGenerativeModel({ model: 'gemini-1.5-flash' });
        // Include previous messages for context
        const chatContext = chatHistory.messages
            .slice(-6) // Get last 6 messages for context
            .map(msg => `${msg.sender}: ${msg.message}`)
            .join('\n');
        const prompt = `${bookContext}\n\nChat History:\n${chatContext}\n\nUser: ${message}`;
        const result = yield model.generateContent({
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
        yield chatHistory.save();
        // Return the entire updated chat history
        res.status(200).json({
            success: true,
            data: chatHistory.toObject()
        });
    }
    catch (error) {
        console.error('Error in addChat:', error);
        res.status(500).json({ success: false, error: 'Error processing chat' });
    }
});
exports.addChat = addChat;
// Get user's chat history with titles
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const chats = yield chat_model_1.default.find({ userId }, 'title createdAt updatedAt').sort('-createdAt');
        res.status(200).json({ success: true, data: chats });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching chat history' });
    }
});
exports.getUserChats = getUserChats;
// Update chat title
const updateChatTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { title } = req.body;
        const chat = yield chat_model_1.default.findByIdAndUpdate(chatId, { title }, { new: true });
        if (!chat) {
            res.status(404).json({ success: false, error: 'Chat not found' });
            return;
        }
        res.status(200).json({ success: true, data: chat });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Error updating chat title' });
    }
});
exports.updateChatTitle = updateChatTitle;
// Add this new function to get a single chat
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const chat = yield chat_model_1.default.findById(chatId);
        if (!chat) {
            res.status(404).json({ success: false, error: 'Chat not found' });
            return;
        }
        res.status(200).json({ success: true, data: chat });
    }
    catch (error) {
        console.error("Error in getChat:", error);
        res.status(500).json({ success: false, error: 'Error fetching chat' });
    }
});
exports.getChat = getChat;
// Add this new controller function
const deleteAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield chat_model_1.default.deleteMany({ userId });
        res.status(200).json({
            success: true,
            message: 'All chat history deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting chats:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting chat history'
        });
    }
});
exports.deleteAllChats = deleteAllChats;
