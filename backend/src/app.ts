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
const corsOptions = {
  origin: ['https://foundrguide.vercel.app'], // Replace with your Vercel frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies if needed
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());


// Use routes
app.use('/api/v1', router);
app.use('/api/v1/chat', chatRouter);


// Error handling
app.use(errorHandler);

export default app;
