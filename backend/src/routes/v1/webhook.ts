import { Router } from 'express';
import { handleClerkWebhook } from '../../webhooks/clerk';

const webhookRouter = Router();

webhookRouter.post('/clerk', handleClerkWebhook);

export default webhookRouter; 