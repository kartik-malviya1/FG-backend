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
exports.updateBook = exports.deleteBook = exports.getBooks = exports.addBook = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const geminiService_1 = require("../services/geminiService");
// Add a new book
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const metadata = yield geminiService_1.geminiService.generateBookMetadata(title, author, description);
        const book = yield book_model_1.default.create({
            title, author, description, metadata,
            tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
            coverImageUrl
        });
        res.status(201).json({ message: 'Book added successfully', data: book });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error adding book',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.addBook = addBook;
// Get all books
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield book_model_1.default.find({}).sort({ createdAt: -1 });
        res.status(200).json({ data: books });
    }
    catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({
            message: 'Error fetching books',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getBooks = getBooks;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if ID exists
        if (!id) {
            res.status(400).json({ message: 'Book ID is required' });
            return;
        }
        // Check if book exists before deleting
        const book = yield book_model_1.default.findById(id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        yield book_model_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Book deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({
            message: 'Error deleting book',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deleteBook = deleteBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const book = yield book_model_1.default.findById(id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        const metadata = yield geminiService_1.geminiService.generateBookMetadata(title, author, description);
        const updatedBook = yield book_model_1.default.findByIdAndUpdate(id, {
            title,
            author,
            description,
            metadata,
            tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
            coverImageUrl
        }, { new: true });
        res.status(200).json({ message: 'Book updated successfully', data: updatedBook });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating book',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateBook = updateBook;
