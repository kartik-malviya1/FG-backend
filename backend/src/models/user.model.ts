import { Schema, model, Document } from 'mongoose';
import { IHighlight } from '../types/models';

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  highlights: IHighlight[];
  createdAt: Date;
  updatedAt: Date;
}

const HighlightSchema = new Schema<IHighlight>({
  highlightId: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema<IUser>(
  {
    clerkId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    highlights: [HighlightSchema]
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes
UserSchema.index({ clerkId: 1 });
UserSchema.index({ email: 1 });

const User = model<IUser>('User', UserSchema);
export default User;
