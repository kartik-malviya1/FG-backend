"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    message: { type: String, required: true },
    sender: {
        type: String,
        enum: ['user', 'ai'],
        required: true
    },
    timestamp: { type: Date, default: Date.now }
});
const HighlightSchema = new mongoose_1.Schema({
    highlightId: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const ChatSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'New Chat'
    },
    messages: [MessageSchema],
    highlights: [HighlightSchema]
}, { timestamps: true });
// Generate title from first message
ChatSchema.pre('save', function (next) {
    if (this.isNew && this.messages.length > 0) {
        // Take first 50 characters of first message as title
        const firstMessage = this.messages[0].message;
        this.title = firstMessage.length > 50
            ? `${firstMessage.substring(0, 50)}...`
            : firstMessage;
    }
    next();
});
// Indexes
ChatSchema.index({ userId: 1 });
ChatSchema.index({ createdAt: -1 });
const Chat = (0, mongoose_1.model)('Chat', ChatSchema);
exports.default = Chat;
