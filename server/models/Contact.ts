import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema({
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
    required: false,
    trim: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved'],
    default: 'new'
  }
}, {
  timestamps: true
});

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
