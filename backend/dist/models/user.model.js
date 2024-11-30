"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HighlightSchema = new mongoose_1.Schema({
    highlightId: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const UserSchema = new mongoose_1.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    highlights: [HighlightSchema]
}, {
    timestamps: true,
    toJSON: {
        transform: (_, ret) => {
            delete ret.__v;
            return ret;
        }
    }
});
// Indexes
UserSchema.index({ clerkId: 1 });
UserSchema.index({ email: 1 });
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
