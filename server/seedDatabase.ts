import mongoose from 'mongoose';
import { Tour } from './models/Tour';
import { Admin } from './models/Admin';
import { connectDB } from './utils/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const seedData = {
  tours: [
    {
      name: "Golden Triangle Classic",
      slug: "golden-triangle-classic",
      description: "Experience the magical Golden Triangle circuit covering Delhi, Agra, and Jaipur. This carefully crafted journey takes you through India's most iconic destinations, including the magnificent Taj Mahal, the bustling streets of Old Delhi, and the royal palaces of Jaipur.",
      overview: "Discover India's most famous destinations in this classic 7-day tour covering Delhi, Agra, and Jaipur. Perfect for first-time visitors to India.",
      category: "Golden Triangle",
      price: 599,
      originalPrice: 699,
      duration: "7 Days / 6 Nights",
      maxGuests: 12,
      minAge: 0,
      rating: 4.8,
      reviews: 124,
      highlights: [
        "Visit the iconic Taj Mahal at sunrise and sunset",
        "Explore the majestic Red Fort and Jama Masjid in Delhi",
        "Discover the Pink City of Jaipur and Amber Fort",
        "Experience local culture and traditional cuisine",
        "Stay in heritage hotels with modern amenities",
        "Professional English-speaking guide throughout"
      ],
      included: [
        "6 nights accommodation in 4-star hotels",
        "Daily breakfast and 3 dinners",
        "Private air-conditioned vehicle",
        "Professional English-speaking guide",
        "All monument entrance fees",
        "Airport transfers"
      ],
      notIncluded: [
        "International flights",
        "Visa fees",
        "Personal expenses",
        "Tips and gratuities",
        "Travel insurance"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Delhi",
          description: "Arrive at Delhi airport and transfer to your hotel. Evening at leisure to explore Connaught Place.",
          highlights: ["Airport pickup", "Hotel check-in", "Welcome briefing"]
        },
        {
          day: 2,
          title: "Delhi Sightseeing",
          description: "Full day exploring Old and New Delhi including Red Fort, Jama Masjid, India Gate, and President's House.",
          highlights: ["Red Fort", "Jama Masjid", "India Gate", "Raj Ghat"]
        },
        {
          day: 3,
          title: "Delhi to Agra",
          description: "Drive to Agra (3-4 hours). Visit Agra Fort and enjoy sunset views of Taj Mahal from Mehtab Bagh.",
          highlights: ["Agra Fort", "Mehtab Bagh", "Taj Mahal sunset view"]
        },
        {
          day: 4,
          title: "Taj Mahal & Agra to Jaipur",
          description: "Early morning visit to Taj Mahal at sunrise. Drive to Jaipur via Fatehpur Sikri.",
          highlights: ["Taj Mahal sunrise", "Fatehpur Sikri", "Drive to Jaipur"]
        },
        {
          day: 5,
          title: "Jaipur Sightseeing",
          description: "Explore the Pink City including Amber Fort, City Palace, Hawa Mahal, and local markets.",
          highlights: ["Amber Fort", "City Palace", "Hawa Mahal", "Local markets"]
        },
        {
          day: 6,
          title: "Jaipur to Delhi",
          description: "Morning at leisure for shopping. Drive back to Delhi and check into hotel near airport.",
          highlights: ["Shopping time", "Return to Delhi", "Airport hotel"]
        },
        {
          day: 7,
          title: "Departure",
          description: "Transfer to airport for onward journey.",
          highlights: ["Airport transfer", "Tour ends"]
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539650116574-75c0c6d5d6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      destinations: ["Delhi", "Agra", "Jaipur"],
      status: "active"
    },
    {
      name: "Royal Rajasthan Heritage",
      slug: "royal-rajasthan-heritage",
      description: "Immerse yourself in the royal heritage of Rajasthan. Visit magnificent palaces, desert landscapes, and colorful cities that showcase the grandeur of India's royal past.",
      overview: "Experience the royal grandeur of Rajasthan with palace stays, desert safaris, and cultural immersion in this comprehensive 12-day journey.",
      category: "Rajasthan Tours",
      price: 899,
      originalPrice: 999,
      duration: "12 Days / 11 Nights",
      maxGuests: 10,
      minAge: 0,
      rating: 4.9,
      reviews: 89,
      highlights: [
        "Stay in heritage palace hotels",
        "Camel safari in Thar Desert",
        "Explore magnificent forts and palaces",
        "Traditional Rajasthani cultural shows",
        "Visit colorful markets and bazaars",
        "Experience desert camping under stars"
      ],
      included: [
        "11 nights accommodation (heritage hotels)",
        "All meals included",
        "Private air-conditioned vehicle",
        "Professional guide",
        "All entrance fees",
        "Camel safari",
        "Cultural performances"
      ],
      notIncluded: [
        "International flights",
        "Visa fees",
        "Personal expenses",
        "Tips and gratuities",
        "Travel insurance"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Delhi",
          description: "Arrive and transfer to hotel. Welcome dinner.",
          highlights: ["Airport pickup", "Hotel check-in", "Welcome dinner"]
        },
        {
          day: 2,
          title: "Delhi to Mandawa",
          description: "Drive to Mandawa, known for its painted havelis and frescoes.",
          highlights: ["Shekhawati region", "Painted havelis", "Fresco art"]
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513415277888-999ac1ba8c4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      destinations: ["Delhi", "Mandawa", "Bikaner", "Jaisalmer", "Jodhpur", "Udaipur", "Jaipur"],
      status: "active"
    },
    {
      name: "Incredible India Extended",
      slug: "incredible-india-extended",
      description: "The ultimate India experience covering North to South. From the Himalayas to the beaches of Kerala, experience the diversity of India in this comprehensive tour.",
      overview: "The ultimate India adventure covering diverse landscapes from the Himalayas to Kerala's backwaters in an epic 21-day journey.",
      category: "Extended Tours",
      price: 1299,
      originalPrice: 1499,
      duration: "21 Days / 20 Nights",
      maxGuests: 8,
      minAge: 12,
      rating: 4.7,
      reviews: 56,
      highlights: [
        "Complete India experience",
        "Himalayan hill stations",
        "Kerala backwaters cruise",
        "South Indian temples",
        "Mumbai and Bollywood",
        "Beach resorts in Goa"
      ],
      included: [
        "20 nights accommodation",
        "All meals included",
        "Domestic flights",
        "Private transportation",
        "Professional guides",
        "All entrance fees",
        "Houseboat stay",
        "Beach resort"
      ],
      notIncluded: [
        "International flights",
        "Visa fees",
        "Personal expenses",
        "Tips and gratuities",
        "Travel insurance"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Delhi",
          description: "Welcome to India! Airport transfer and hotel check-in.",
          highlights: ["Airport pickup", "Hotel check-in", "Orientation"]
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520967824495-7acc5b021924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      destinations: ["Delhi", "Shimla", "Amritsar", "Mumbai", "Aurangabad", "Hyderabad", "Chennai", "Kochi", "Munnar", "Goa"],
      status: "active"
    },
    {
      name: "Kerala Backwaters & Hills",
      slug: "kerala-backwaters-hills",
      description: "Discover God's Own Country with this Kerala special featuring serene backwaters, spice plantations, and hill stations.",
      overview: "Explore Kerala's natural beauty with houseboat cruises, spice plantations, and scenic hill stations in this 9-day tropical getaway.",
      category: "Extended Tours",
      price: 749,
      originalPrice: 849,
      duration: "9 Days / 8 Nights",
      maxGuests: 12,
      minAge: 0,
      rating: 4.6,
      reviews: 78,
      highlights: [
        "Houseboat cruise in backwaters",
        "Spice plantation visit",
        "Tea estate tours in Munnar",
        "Ayurvedic treatments",
        "Traditional Kerala cuisine",
        "Beach relaxation in Kovalam"
      ],
      included: [
        "8 nights accommodation",
        "Daily breakfast",
        "Houseboat with all meals",
        "Private transportation",
        "English-speaking guide",
        "All entrance fees",
        "Ayurvedic massage"
      ],
      notIncluded: [
        "International flights",
        "Lunch & dinner (except houseboat)",
        "Personal expenses",
        "Tips and gratuities",
        "Travel insurance"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Kochi",
          description: "Arrive at Kochi airport, transfer to hotel. Evening sightseeing.",
          highlights: ["Chinese fishing nets", "St. Francis Church", "Dutch Palace"]
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      destinations: ["Kochi", "Munnar", "Thekkady", "Alleppey", "Kovalam"],
      status: "active"
    },
    {
      name: "Spiritual India Journey",
      slug: "spiritual-india-journey",
      description: "Embark on a spiritual journey through India's most sacred destinations. Visit ancient temples, witness evening prayers, and experience the spiritual essence of India.",
      overview: "Discover India's spiritual heritage with visits to sacred cities, ancient temples, and holy rituals in this transformative 10-day journey.",
      category: "Extended Tours",
      price: 849,
      originalPrice: 949,
      duration: "10 Days / 9 Nights",
      maxGuests: 15,
      minAge: 0,
      rating: 4.8,
      reviews: 92,
      highlights: [
        "Witness Ganga Aarti in Varanasi",
        "Visit Golden Temple in Amritsar",
        "Explore ancient temples",
        "Meditation sessions",
        "Yoga classes",
        "Spiritual discourses"
      ],
      included: [
        "9 nights accommodation",
        "All meals included",
        "Private transportation",
        "Spiritual guide",
        "All entrance fees",
        "Yoga sessions",
        "Meditation workshops"
      ],
      notIncluded: [
        "International flights",
        "Visa fees",
        "Personal expenses",
        "Tips and gratuities",
        "Travel insurance"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Delhi",
          description: "Arrive in Delhi, transfer to hotel. Evening visit to Akshardham Temple.",
          highlights: ["Akshardham Temple", "Light & sound show"]
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      destinations: ["Delhi", "Haridwar", "Rishikesh", "Varanasi", "Bodhgaya", "Amritsar"],
      status: "active"
    },
    {
      name: "Himachal Adventure",
      slug: "himachal-adventure",
      description: "Adventure in the Himalayas with trekking, river rafting, and mountain experiences in beautiful Himachal Pradesh.",
      overview: "Experience thrilling Himalayan adventures with trekking, rafting, and mountain sports in scenic Himachal Pradesh over 8 exciting days.",
      category: "Extended Tours",
      price: 699,
      originalPrice: 799,
      duration: "8 Days / 7 Nights",
      maxGuests: 10,
      minAge: 16,
      rating: 4.5,
      reviews: 67,
      highlights: [
        "White water rafting",
        "Himalayan trekking",
        "Paragliding in Bir-Billing",
        "Mountain biking",
        "Camping under stars",
        "Local Himachali culture"
      ],
      included: [
        "7 nights accommodation",
        "All meals included",
        "Adventure activities",
        "Professional guides",
        "Safety equipment",
        "Transportation",
        "Camping gear"
      ],
      notIncluded: [
        "International flights",
        "Personal gear",
        "Travel insurance",
        "Personal expenses",
        "Tips and gratuities"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Chandigarh",
          description: "Arrive and drive to Shimla. Evening at leisure.",
          highlights: ["Drive to Shimla", "Hotel check-in"]
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      destinations: ["Shimla", "Manali", "Solang Valley", "Bir-Billing", "Dharamshala"],
      status: "active"
    }
  ],
  admin: {
    username: "lester",
    email: "lester@orbittrails.com",
    password: "Ajmer2002#",
    role: "super-admin"
  }
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Tour.deleteMany({});
    await Admin.deleteMany({});
    
    // Seed tours
    console.log('🎯 Seeding tour packages...');
    const tours = await Tour.insertMany(seedData.tours);
    console.log(`✅ Created ${tours.length} tour packages`);
    
    // Seed admin user
    console.log('👤 Creating admin user...');
    const admin = new Admin(seedData.admin);
    await admin.save();
    console.log('✅ Created admin user:', admin.username);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Seeded Data Summary:');
    console.log(`   Tours: ${tours.length}`);
    console.log(`   Admin Users: 1`);
    console.log('\n🔐 Admin Login Credentials:');
    console.log(`   Username: ${seedData.admin.username}`);
    console.log(`   Password: ${seedData.admin.password}`);
    console.log('\n🌐 You can now start the server and access the admin panel at /adm');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
