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
exports.default = dbConnect;
const mongoose_1 = __importDefault(require("mongoose"));
const connection = {};
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (connection.isConnected) {
            console.log("Already connected to the database");
            return;
        }
        try {
            const db = yield mongoose_1.default.connect((_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : "");
            connection.isConnected = db.connections[0].readyState;
            console.log("DB Connected Successfully");
        }
        catch (error) {
            console.log("Database connection fail", error);
            process.exit(1);
        }
    });
}