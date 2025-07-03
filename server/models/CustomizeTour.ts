import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomizeTour extends Document {
  startDate: Date;
  duration: number;
  numberOfTravelers: number;
  accommodationType: 'Luxury' | 'Comfort';
  destinations: string[];
  budgetRange: string;
  comments: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  status: 'new' | 'in-progress' | 'quoted' | 'booked' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const CustomizeTourSchema: Schema = new Schema({
  startDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  numberOfTravelers: {
    type: Number,
    required: true,
    min: 1
  },
  accommodationType: {
    type: String,
    required: true,
    enum: ['Luxury', 'Comfort']
  },
  destinations: [{
    type: String,
    required: true
  }],
  budgetRange: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    maxlength: 1000
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  countryCode: {
    type: String,
    required: true,
    default: '+1'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'quoted', 'booked', 'completed', 'cancelled'],
    default: 'new'
  }
}, {
  timestamps: true
});

export const CustomizeTour = mongoose.model<ICustomizeTour>('CustomizeTour', CustomizeTourSchema);
