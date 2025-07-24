import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  email?: string;
  rating: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for approved reviews
ReviewSchema.index({ isApproved: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
