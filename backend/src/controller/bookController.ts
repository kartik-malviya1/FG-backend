import { Request, Response } from 'express';
import Book from '../models/book.model';
import { geminiService } from '../services/geminiService';

// Add a new book
export const addBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, description, tags, coverImageUrl } = req.body;

    console.log("here", title);

    if (!title || !author || !description || !coverImageUrl) {
      res.status(400).json({ 
        message: 'Missing required fields', 
        error: 'All fields are required' 
      });
      return;
    }

    const metadata = await geminiService.generateBookMetadata(title, author, description);
    const book = await Book.create({
      title, author, description, metadata,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      coverImageUrl
    });

    res.status(201).json({ message: 'Book added successfully', data: book });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding book', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Get all books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.status(200).json({ data: books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      message: 'Error fetching books', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if ID exists
    if (!id) {
      res.status(400).json({ message: 'Book ID is required' });
      return;
    }

    // Check if book exists before deleting
    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ 
      message: 'Error deleting book', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};


export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, author, description, tags, coverImageUrl } = req.body;

    if (!id) {
      res.status(400).json({ message: 'Book ID is required' });
      return;
    }

    if (!title || !author || !description || !coverImageUrl) {
      res.status(400).json({ 
        message: 'Missing required fields', 
        error: 'All fields are required' 
      });
      return;
    }

    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    const metadata = await geminiService.generateBookMetadata(title, author, description);
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        description,
        metadata,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        coverImageUrl
      },
      { new: true }
    );

    res.status(200).json({ message: 'Book updated successfully', data: updatedBook });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating book', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
