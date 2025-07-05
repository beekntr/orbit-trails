/**
 * Migration script to add order field to existing tours
 * Run this once to update existing tours with order values
 */

import mongoose from 'mongoose';
import { Tour } from '../models/Tour';
import { connectDB } from '../utils/database';

async function migrateTourOrders() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database for migration...');

    // Get all tours without order field or with order = 0
    const tours = await Tour.find({ 
      $or: [
        { order: { $exists: false } },
        { order: 0 }
      ]
    }).sort({ createdAt: 1 }); // Sort by creation date

    console.log(`Found ${tours.length} tours to update...`);

    // Update each tour with an order value
    for (let i = 0; i < tours.length; i++) {
      const tour = tours[i];
      tour.order = i;
      await tour.save();
      console.log(`Updated ${tour.name} with order ${i}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateTourOrders();
}

export { migrateTourOrders };
