import { Router } from 'express';
import { addChat, getUserChats, updateChatTitle, getChat, deleteAllChats } from '../../controller/chatController';
import { requireAuth } from '../../middleware/auth';

const chatRouter = Router();

chatRouter.post('/', requireAuth, addChat);
chatRouter.get('/user/:userId', requireAuth, getUserChats);
chatRouter.patch('/:chatId/title', requireAuth, updateChatTitle);
chatRouter.get('/single/:chatId', requireAuth, getChat);
chatRouter.delete('/user/:userId/all', requireAuth, deleteAllChats);

export default chatRouter;
