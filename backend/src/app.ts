import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes/v1';
import { errorHandler } from './middleware/errorHandler';
import chatRouter from './routes/v1/chat';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());


// Use routes
app.use('/api/v1', router);
app.use('/api/v1/chat', chatRouter);


// Error handling
app.use(errorHandler);

export default app;
