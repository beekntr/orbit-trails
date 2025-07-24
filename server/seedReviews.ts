import mongoose from 'mongoose';
import { Review } from './models/Review';
import { connectDB } from './utils/database';

const sampleReviews = [
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    rating: 5,
    description: "Absolutely magical experience! The Golden Triangle tour was perfectly organized. Our guide was incredibly knowledgeable about Indian history and culture. The Taj Mahal at sunrise was breathtaking!",
    status: 'approved',
    isApproved: true
  },
  {
    name: "James Wilson",
    email: "james@example.com", 
    rating: 5,
    description: "Orbit Trails exceeded all expectations! From the luxurious accommodations to the authentic cultural experiences, every detail was perfect. Highly recommend for anyone wanting to explore India.",
    status: 'approved',
    isApproved: true
  },
  {
    name: "Maria Rodriguez",
    email: "maria@example.com",
    rating: 4,
    description: "Wonderful Rajasthan tour! The palaces and forts were magnificent. Our driver was very professional and the hotels were comfortable. A few minor scheduling issues but overall excellent trip.",
    status: 'approved', 
    isApproved: true
  },
  {
    name: "David Thompson",
    email: "david@example.com",
    rating: 5,
    description: "Best travel agency we've worked with! The custom itinerary was exactly what we wanted. Excellent value for money and outstanding customer service throughout our journey.",
    status: 'approved',
    isApproved: true
  },
  {
    name: "Lisa Chen",
    email: "lisa@example.com",
    rating: 5,
    description: "Incredible India experience with Orbit Trails! The food tours, cultural shows, and historical sites were all amazing. Our guide made everything so interesting and enjoyable.",
    status: 'pending',
    isApproved: false
  },
  {
    name: "Robert Johnson",
    rating: 4,
    description: "Good overall experience. The tours were well-organized and the guides were friendly. Some of the hotels could have been better but the main attractions were fantastic!",
    status: 'approved',
    isApproved: true
  }
];

async function seedReviews() {
  try {
    await connectDB();
    
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');
    
    // Insert sample reviews
    const reviews = await Review.insertMany(sampleReviews);
    console.log(`Created ${reviews.length} sample reviews`);
    
    console.log('Sample reviews seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
