import mongoose, { Document, Schema } from 'mongoose';

export interface ITour extends Document {
  name: string;
  slug: string;
  description: string;
  overview: string;
  category: 'Golden Triangle' | 'Rajasthan Tours' | 'Extended Tours';
  price?: number; // Made optional since we're hiding pricing initially
  originalPrice?: number;
  duration: string;
  maxGuests: number;
  minAge: number;
  rating: number;
  reviews: number;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    highlights: string[];
  }>;
  images: string[];
  destinations: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Golden Triangle', 'Rajasthan Tours', 'Extended Tours']
  },
  price: {
    type: Number,
    required: false // Made optional
  },
  originalPrice: {
    type: Number
  },
  duration: {
    type: String,
    required: true
  },
  maxGuests: {
    type: Number,
    required: true,
    default: 12
  },
  minAge: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  highlights: [{
    type: String
  }],
  included: [{
    type: String
  }],
  notIncluded: [{
    type: String
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    highlights: [{
      type: String
    }]
  }],
  images: [{
    type: String
  }],
  destinations: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create index for text search
TourSchema.index({ name: 'text', description: 'text', highlights: 'text' });

export const Tour = mongoose.model<ITour>('Tour', TourSchema);
