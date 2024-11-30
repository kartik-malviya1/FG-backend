"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const v1_1 = require("./routes/v1");
const errorHandler_1 = require("./middleware/errorHandler");
const chat_1 = __importDefault(require("./routes/v1/chat"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Use routes
app.use('/api/v1', v1_1.router);
app.use('/api/v1/chat', chat_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
exports.default = app;
