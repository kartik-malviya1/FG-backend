"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const admin_1 = __importDefault(require("./admin"));
const book_1 = require("./book");
const chat_1 = __importDefault(require("./chat"));
exports.router = (0, express_1.Router)();
exports.router.use("/user", user_1.userRouter);
exports.router.use("/admin", admin_1.default);
exports.router.use("/books", book_1.bookRouter);
exports.router.use("/chat", chat_1.default);
