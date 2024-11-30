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
exports.geminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
class GeminiService {
    constructor() {
        const apiKey = (0, env_1.getEnvVar)('GEMINI_API_KEY');
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    getAI() {
        return this.genAI;
    }
    generateBookMetadata(title, author, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Generate a concise metadata summary for the following book:
    Title: ${title}
    Author: ${author}
    Description: ${description}

    Focus on key themes, main ideas, and potential business applications.
    Keep it under 250 words.`;
            try {
                const result = yield model.generateContent(prompt);
                const response = yield result.response.text();
                return response;
            }
            catch (error) {
                console.error('Error generating book metadata:', error);
                throw new Error('Failed to generate metadata. Please try again.');
            }
        });
    }
}
exports.geminiService = new GeminiService();
