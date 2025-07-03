# Orbit Trails Backend API

A complete backend API for the Orbit Trails travel agency website built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **Tour Package Management**: Complete CRUD operations for tour packages
- **Custom Tour Requests**: Handle customer custom tour inquiries
- **Contact Form**: Process contact form submissions
- **Admin Authentication**: JWT-based admin panel access
- **Email Notifications**: Automated email notifications for form submissions
- **Database Seeding**: Pre-populated tour packages and admin user
- **Type Safety**: Full TypeScript implementation
- **Validation**: Request validation using express-validator
- **CORS**: Configured for frontend integration

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
# Database - Use MongoDB Atlas for production
MONGODB_URI=mongodb://localhost:27017/orbit-trails

# JWT Secret - Generate a secure secret
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d

# Email Configuration (Optional - for notifications)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# Admin Email
ADMIN_EMAIL=admin@orbittrails.com
FROM_EMAIL=noreply@orbittrails.com

# Server Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD_URL=https://www.orbittrails.com
```

### 3. Database Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Database will be created automatically

**Option B: MongoDB Atlas (Recommended)**
- Create a free MongoDB Atlas account
- Create a new cluster
- Get your connection string
- Update `MONGODB_URI` in `.env`

### 4. Seed the Database

Populate the database with initial tour packages and admin user:

```bash
npm run seed
```

This creates:
- 6 sample tour packages across different categories
- Admin user (username: `admin`, password: `admin123`)

### 5. Start the Development Server

```bash
npm run dev:server
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Public Endpoints

#### Tours
- `GET /api/tours` - Get all tours (grouped by category)
- `GET /api/tours/:id` - Get single tour by ID or slug

#### Contact Form
- `POST /api/contact` - Submit contact message

#### Custom Tour Requests
- `POST /api/customize-tour` - Submit custom tour request

#### Health Check
- `GET /api/health` - API health status

### Protected Endpoints (Admin Only)

#### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get current admin profile
- `GET /api/admin/dashboard` - Get dashboard data

#### Tour Management
- `POST /api/tours` - Create new tour
- `PUT /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour

#### Contact Management
- `GET /api/contact` - Get all contact messages
- `GET /api/contact/:id` - Get single contact message
- `PATCH /api/contact/:id/status` - Update contact status

#### Custom Tour Management
- `GET /api/customize-tour` - Get all custom tour requests
- `GET /api/customize-tour/:id` - Get single custom tour request
- `PATCH /api/customize-tour/:id/status` - Update request status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Login via `POST /api/admin/login` with credentials
2. Receive JWT token in response
3. Include token in subsequent requests: `Authorization: Bearer <token>`

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## 📊 Database Schema

### Tours Collection
```typescript
{
  name: string;
  slug: string;
  description: string;
  category: 'Golden Triangle' | 'Rajasthan Tours' | 'Extended Tours';
  price: number;
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
}
```

### Contact Messages Collection
```typescript
{
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'resolved';
}
```

### Custom Tour Requests Collection
```typescript
{
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
}
```

## 📧 Email Configuration

The API can send email notifications for form submissions:

### Gmail Setup (Development)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
3. Add credentials to `.env`:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-16-character-app-password
   ```

### Production SMTP
For production, use a dedicated email service:
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

## 🚀 Deployment

### Option 1: Render.com
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on git push

### Option 2: Railway.app
1. Connect GitHub repository
2. Add environment variables
3. Deploy with one click

### Option 3: DigitalOcean App Platform
1. Create new app from GitHub
2. Configure environment variables
3. Deploy

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secure random string
- `NODE_ENV=production`
- `FRONTEND_PROD_URL` - Your frontend domain
- Email configuration variables

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/api/health

# Get all tours
curl http://localhost:3000/api/tours

# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"1234567890","message":"Test message"}'

# Admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Using Frontend
The React frontend automatically connects to the API when both are running:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## 📁 Project Structure

```
server/
├── controllers/          # Route handlers
│   ├── tourController.ts
│   ├── contactController.ts
│   ├── customizeController.ts
│   └── adminAuthController.ts
├── models/              # Database models
│   ├── Tour.ts
│   ├── Contact.ts
│   ├── CustomizeTour.ts
│   └── Admin.ts
├── routes/              # Route definitions
│   ├── tours.ts
│   ├── contact.ts
│   ├── customize.ts
│   └── admin.ts
├── middleware/          # Custom middleware
│   └── authMiddleware.ts
├── utils/               # Utility functions
│   ├── database.ts
│   └── emailService.ts
├── index.ts             # Express app setup
├── server.ts            # Development server
└── seedDatabase.ts      # Database seeding script
```

## 🔧 Available Scripts

```bash
# Development
npm run dev:server      # Start development server with hot reload
npm run typecheck       # Check TypeScript types

# Database
npm run seed           # Seed database with sample data

# Production
npm run build          # Build for production
npm run start          # Start production server
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running (local)
   - Verify connection string (Atlas)
   - Ensure IP whitelist includes your IP (Atlas)

2. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill process using the port: `npx kill-port 3000`

3. **Email Not Sending**
   - Verify Gmail App Password is correct
   - Check spam folder
   - Ensure 2FA is enabled on Gmail account

4. **CORS Errors**
   - Verify `FRONTEND_URL` in `.env`
   - Check if frontend is running on expected port

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
```

This will show:
- Detailed error messages
- API endpoint information
- Database connection status

## 📝 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**🌟 Your Orbit Trails backend is now ready! The API provides everything needed for a fully functional travel agency website.**
