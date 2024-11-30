"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clerk_1 = require("../../webhooks/clerk");
const webhookRouter = (0, express_1.Router)();
webhookRouter.post('/clerk', clerk_1.handleClerkWebhook);
exports.default = webhookRouter;
