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
exports.handleClerkWebhook = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const handleClerkWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, data } = req.body;
    try {
        switch (type) {
            case 'user.created':
            case 'user.updated':
                yield user_model_1.default.findOneAndUpdate({ clerkId: data.id }, {
                    clerkId: data.id,
                    name: `${data.first_name} ${data.last_name}`,
                    email: data.email_addresses[0].email_address
                }, { upsert: true, new: true });
                break;
            case 'user.deleted':
                yield user_model_1.default.findOneAndDelete({ clerkId: data.id });
                break;
            default:
                console.log(`Unhandled webhook type: ${type}`);
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Clerk webhook error:', error);
        res.status(500).json({
            success: false,
            error: 'Error processing webhook'
        });
    }
});
exports.handleClerkWebhook = handleClerkWebhook;
