// Database seeding script for production
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Schemas (simplified for seeding)
const AdminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const TourSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  overview: String,
  category: String,
  price: Number,
  originalPrice: Number,
  duration: String,
  maxGuests: { type: Number, default: 20 },
  minAge: { type: Number, default: 12 },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  highlights: [String],
  included: [String],
  notIncluded: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    highlights: [String]
  }],
  images: [String],
  destinations: [String],
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
const Tour = mongoose.model('Tour', TourSchema);

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await Tour.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = new Admin({
      username: 'admin',
      email: 'admin@orbittrails.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    await admin.save();
    console.log('👤 Admin user created (username: admin, password: admin123)');

    // Create sample tours
    const tours = [
      {
        name: 'Golden Triangle Tour',
        slug: 'golden-triangle-tour',
        description: 'Explore Delhi, Agra, and Jaipur - the iconic Golden Triangle of India',
        overview: 'Experience the magic of India\'s most famous tourist circuit. Visit historical monuments, vibrant markets, and immerse yourself in rich cultural heritage.',
        category: 'Golden Triangle',
        price: 999,
        originalPrice: 1299,
        duration: '7 days',
        maxGuests: 20,
        minAge: 12,
        rating: 4.8,
        reviews: 156,
        highlights: [
          'Visit the magnificent Taj Mahal in Agra',
          'Explore the Red Fort in Delhi',
          'Discover the Pink City of Jaipur',
          'Experience local markets and cuisine'
        ],
        included: [
          'Accommodation in heritage hotels',
          'All transfers in AC vehicle',
          'Professional guide',
          'Monument entrance fees',
          'Daily breakfast'
        ],
        notIncluded: [
          'International flights',
          'Lunch and dinner',
          'Personal expenses',
          'Tips and gratuities'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Delhi',
            description: 'Arrive in Delhi and check into hotel. Evening free for leisure.',
            highlights: ['Airport pickup', 'Hotel check-in', 'Welcome briefing']
          },
          {
            day: 2,
            title: 'Delhi Sightseeing',
            description: 'Full day tour of Old and New Delhi including Red Fort, Jama Masjid, and India Gate.',
            highlights: ['Red Fort', 'Jama Masjid', 'India Gate', 'Humayun\'s Tomb']
          },
          {
            day: 3,
            title: 'Delhi to Agra',
            description: 'Drive to Agra and visit the magnificent Taj Mahal at sunset.',
            highlights: ['Taj Mahal', 'Sunset view', 'Local market visit']
          }
        ],
        images: [
          '/placeholder.svg',
          '/placeholder.svg',
          '/placeholder.svg'
        ],
        destinations: ['Delhi', 'Agra', 'Jaipur'],
        status: 'active'
      },
      {
        name: 'Rajasthan Heritage Tour',
        slug: 'rajasthan-heritage-tour',
        description: 'Discover the royal heritage of Rajasthan with its magnificent palaces and forts',
        overview: 'Journey through the land of maharajas, exploring magnificent palaces, imposing forts, and experiencing the vibrant culture of Rajasthan.',
        category: 'Rajasthan Tours',
        price: 1299,
        originalPrice: 1599,
        duration: '10 days',
        maxGuests: 18,
        minAge: 12,
        rating: 4.7,
        reviews: 89,
        highlights: [
          'Stay in heritage palace hotels',
          'Explore Mehrangarh Fort in Jodhpur',
          'Boat ride on Lake Pichola in Udaipur',
          'Camel safari in Jaisalmer desert'
        ],
        included: [
          'Heritage hotel accommodation',
          'All transfers and sightseeing',
          'Professional guide',
          'Cultural performances',
          'Daily breakfast and dinner'
        ],
        notIncluded: [
          'Domestic flights',
          'Lunch',
          'Personal expenses',
          'Camera fees at monuments'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Jaipur',
            description: 'Arrive in the Pink City and check into heritage hotel.',
            highlights: ['Airport pickup', 'Heritage hotel', 'Welcome dinner']
          },
          {
            day: 2,
            title: 'Jaipur City Tour',
            description: 'Visit City Palace, Hawa Mahal, and Amber Fort.',
            highlights: ['City Palace', 'Hawa Mahal', 'Amber Fort', 'Local bazaars']
          }
        ],
        images: [
          '/placeholder.svg',
          '/placeholder.svg',
          '/placeholder.svg'
        ],
        destinations: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
        status: 'active'
      },
      {
        name: 'Kerala Backwaters Experience',
        slug: 'kerala-backwaters-experience',
        description: 'Experience the serene backwaters and lush landscapes of God\'s Own Country',
        overview: 'Cruise through peaceful backwaters, stay in traditional houseboats, and discover the natural beauty of Kerala.',
        category: 'Extended Tours',
        price: 899,
        originalPrice: 1199,
        duration: '6 days',
        maxGuests: 16,
        minAge: 10,
        rating: 4.9,
        reviews: 203,
        highlights: [
          'Houseboat stay in Alleppey',
          'Spice plantation tour in Thekkady',
          'Tea garden visit in Munnar',
          'Ayurvedic spa treatments'
        ],
        included: [
          'Houseboat accommodation',
          'Resort stays',
          'All meals on houseboat',
          'Guided tours',
          'Ayurvedic massage'
        ],
        notIncluded: [
          'Flights to Kerala',
          'Alcoholic beverages',
          'Shopping',
          'Additional spa treatments'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Cochin',
            description: 'Arrive and explore historic Fort Cochin area.',
            highlights: ['Fort Cochin', 'Chinese fishing nets', 'Spice markets']
          },
          {
            day: 2,
            title: 'Cochin to Munnar',
            description: 'Drive to hill station Munnar through scenic landscapes.',
            highlights: ['Tea plantations', 'Waterfalls', 'Mountain views']
          }
        ],
        images: [
          '/placeholder.svg',
          '/placeholder.svg',
          '/placeholder.svg'
        ],
        destinations: ['Cochin', 'Munnar', 'Thekkady', 'Alleppey'],
        status: 'active'
      }
    ];

    await Tour.insertMany(tours);
    console.log(`🎯 Created ${tours.length} sample tours`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   👤 Admin user: admin / admin123');
    console.log(`   🎯 Tours created: ${tours.length}`);
    console.log('   🔗 Database: Connected and seeded');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
connectDB().then(() => {
  seedData();
});
