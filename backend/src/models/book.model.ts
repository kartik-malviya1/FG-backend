import { Schema, model, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  metadata: string;
  tags: string[] | null;
  pdfUrl: string | null;
  coverImageUrl: string;
  ratings?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    author: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true 
    },
    metadata: {
      type: String,
      required: true
    },
    tags: [{ 
      type: String,
      trim: true,
      lowercase: true
    }],
    pdfUrl: { 
      type: String, 
      required: false 
    },
    coverImageUrl: { 
      type: String, 
      required: true 
    },
    ratings: { 
      type: Number,
      min: 0,
      max: 5,
      default: null
    }
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

// Separate indexes for text search and tags
BookSchema.index({ title: 'text', author: 'text' });
BookSchema.index({ tags: 1 });

const Book = model<IBook>('Book', BookSchema);

// Wrap the index dropping in an async function
const initIndexes = async () => {
  await Book.collection.dropIndexes();
};
initIndexes();

export default Book;
