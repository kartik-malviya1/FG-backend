"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get('/', (req, res) => {
    res.json({
        message: "This is user router"
    });
});
