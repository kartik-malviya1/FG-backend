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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    metadata: {
        type: String,
        required: true
    },
    tags: [{
            type: String,
            trim: true,
            lowercase: true
        }],
    pdfUrl: {
        type: String,
        required: false
    },
    coverImageUrl: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_, ret) => {
            delete ret.__v;
            return ret;
        }
    }
});
// Separate indexes for text search and tags
BookSchema.index({ title: 'text', author: 'text' });
BookSchema.index({ tags: 1 });
const Book = (0, mongoose_1.model)('Book', BookSchema);
// Wrap the index dropping in an async function
const initIndexes = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Book.collection.dropIndexes();
});
initIndexes();
exports.default = Book;
