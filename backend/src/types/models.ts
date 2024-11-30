import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface IHighlight {
  highlightId: string;
  title: string;
  text: string;
  createdAt: Date;
}

export interface IBook extends Document {
  title: string;
  author: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
} 