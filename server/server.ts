import { createServer } from './index';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 Orbit Trails API Server running on port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n📋 Available Endpoints:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/tours - Get all tours`);
    console.log(`   POST /api/contact - Submit contact form`);
    console.log(`   POST /api/customize-tour - Submit custom tour request`);
    console.log(`   POST /api/reviews - Submit review`);
    console.log(`   GET  /api/reviews - Get approved reviews`);
    console.log(`   GET  /api/reviews/random - Get random approved reviews`);
    console.log(`   POST /api/admin/login - Admin login`);
    console.log(`\n🔐 Admin Panel: http://localhost:5173/adm`);
    console.log(`   Username: admin`);
    console.log(`   Password: admin123`);
  }
});
