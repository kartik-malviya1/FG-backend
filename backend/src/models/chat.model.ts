import { Schema, model, Document } from 'mongoose';
import { IMessage, IHighlight } from '../types/models';

export interface IChat extends Document {
  userId: string;
  sessionId: string;
  title: string;
  messages: IMessage[];
  highlights: IHighlight[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  message: { type: String, required: true },
  sender: { 
    type: String, 
    enum: ['user', 'ai'], 
    required: true 
  },
  timestamp: { type: Date, default: Date.now }
});

const HighlightSchema = new Schema<IHighlight>({
  highlightId: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ChatSchema = new Schema<IChat>(
  {
    userId: { 
      type: String,
      required: true 
    },
    sessionId: { 
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      default: 'New Chat'
    },
    messages: [MessageSchema],
    highlights: [HighlightSchema]
  },
  { timestamps: true }
);

// Generate title from first message
ChatSchema.pre('save', function(next) {
  if (this.isNew && this.messages.length > 0) {
    // Take first 50 characters of first message as title
    const firstMessage = this.messages[0].message;
    this.title = firstMessage.length > 50 
      ? `${firstMessage.substring(0, 50)}...`
      : firstMessage;
  }
  next();
});

// Indexes
ChatSchema.index({ userId: 1 });
ChatSchema.index({ createdAt: -1 });

const Chat = model<IChat>('Chat', ChatSchema);
export default Chat;
