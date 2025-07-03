# Orbit Trails - Complete Travel Agency Website

## 🌟 Project Overview

Orbit Trails is a modern, full-stack travel agency website built with React, TypeScript, Node.js, and MongoDB. It features a beautiful frontend with tour packages, custom tour requests, contact forms, and a comprehensive admin panel for managing all aspects of the business.

## 🚀 Live URLs

- **Frontend (User Site)**: http://localhost:8080
- **Backend API**: http://localhost:3000/api  
- **Admin Panel**: http://localhost:8080/adm
- **API Health Check**: http://localhost:3000/api/health

## 🔑 Demo Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

## 🏗️ Architecture

### Frontend (React + Vite + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **API Client**: Custom API wrapper with JWT support

### Backend (Node.js + Express + TypeScript)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT with bcrypt password hashing
- **Email**: Nodemailer (Gmail for dev, SMTP for prod)
- **Validation**: Express Validator
- **Environment**: dotenv for configuration

## 📁 Project Structure

```
orbit-trails/
├── client/                 # React Frontend
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AnimatedNavbar.tsx
│   │   ├── CustomizeTourModal.tsx
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Home page
│   │   ├── Tours.tsx      # Tour listings
│   │   ├── Contact.tsx    # Contact form
│   │   ├── Admin.tsx      # Admin dashboard
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities
├── server/                # Node.js Backend
│   ├── controllers/       # Request handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & validation
│   ├── utils/            # Email & database utilities
│   ├── server.ts         # Development server
│   ├── index.ts          # Production server
│   └── seedDatabase.ts   # Database seeding
├── shared/               # Shared types & API client
├── public/              # Static assets
└── netlify/            # Netlify functions (production)
```

## 🎯 Key Features

### User Features
1. **Homepage**: Modern landing page with hero section and featured tours
2. **Tour Packages**: Browse categorized tour packages with detailed information
3. **Custom Tour Requests**: Request personalized tours with preferences
4. **Contact Form**: Get in touch with the travel agency
5. **Responsive Design**: Mobile-first, works on all devices
6. **Smooth Animations**: Framer Motion for engaging UX

### Admin Features
1. **Secure Login**: JWT-based authentication
2. **Dashboard Stats**: Overview of tours, contacts, and custom requests
3. **Tour Management**: Create, view, edit, and delete tour packages
4. **Contact Management**: View and manage customer inquiries
5. **Custom Tour Requests**: Review and manage tour customization requests
6. **Real-time Data**: Live data from MongoDB

### Technical Features
1. **Full TypeScript**: End-to-end type safety
2. **RESTful API**: Well-structured API endpoints
3. **JWT Authentication**: Secure admin access
4. **Email Notifications**: Automatic email alerts for submissions
5. **MongoDB Integration**: Robust data persistence
6. **Environment Configuration**: Flexible config for dev/prod
7. **Error Handling**: Comprehensive error management
8. **Input Validation**: Both client and server-side validation

## 📊 Database Schema

### Collections

1. **Tours**: Tour package information
   - Basic info (name, description, price, duration)
   - Details (highlights, itinerary, included/excluded)
   - Metadata (category, status, dates)

2. **Contacts**: Customer inquiries
   - Contact details (name, email, phone)
   - Message content and status
   - Timestamps

3. **CustomizeTours**: Custom tour requests
   - Traveler preferences
   - Destination and budget requirements
   - Request status and details

4. **Admins**: Admin user accounts
   - Credentials with hashed passwords
   - Role and permissions

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/health` - API health check
- `GET /api/tours` - Fetch all tour packages
- `POST /api/contact` - Submit contact form
- `POST /api/customize-tour` - Submit custom tour request

### Protected Endpoints (Admin)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard data
- `POST /api/tours` - Create new tour
- `PUT /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account (for email service)

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd orbit-trails
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Edit .env with your values:
   # - MongoDB connection string
   # - JWT secret key
   # - Email credentials
   ```

3. **Database Setup**
   ```bash
   # Seed the database with sample data
   npm run seed
   ```

4. **Development**
   ```bash
   # Start frontend (terminal 1)
   npm run dev
   
   # Start backend (terminal 2)  
   npm run dev:server
   ```

5. **Access the Application**
   - Frontend: http://localhost:8080
   - Admin Panel: http://localhost:8080/adm
   - API: http://localhost:3000/api

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Configure environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy `dist/` folder to your hosting provider
3. Configure serverless functions or API hosting
4. Set up MongoDB Atlas production database

## 📧 Email Configuration

### Development (Gmail)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Production (SMTP)
```env
EMAIL_SERVICE=smtp
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt for secure password storage
2. **JWT Tokens**: Stateless authentication
3. **Input Validation**: Server-side validation for all endpoints
4. **Environment Variables**: Sensitive data in env files
5. **CORS Configuration**: Proper cross-origin resource sharing
6. **Error Handling**: No sensitive data in error responses

## 🎨 UI/UX Features

1. **Modern Design**: Clean, professional travel agency aesthetic
2. **Responsive Layout**: Mobile-first design approach
3. **Loading States**: Smooth loading indicators
4. **Form Validation**: Real-time validation feedback
5. **Toast Notifications**: User-friendly success/error messages
6. **Accessibility**: ARIA labels and keyboard navigation

## 🧪 Testing

### API Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/tours
```

### Admin Panel Testing
1. Navigate to http://localhost:8080/adm
2. Login with admin/admin123
3. Test dashboard functionality
4. Create a new tour package
5. View contact submissions

## 📈 Performance Optimizations

1. **Code Splitting**: Automatic route-based code splitting
2. **Image Optimization**: Responsive images with proper sizing
3. **Lazy Loading**: Components loaded on demand
4. **API Caching**: Efficient data fetching strategies
5. **Bundle Analysis**: Optimized bundle sizes

## 🛠️ Development Tools

1. **TypeScript**: Full type safety
2. **ESLint**: Code quality and consistency
3. **Prettier**: Automatic code formatting
4. **Hot Reload**: Fast development iteration
5. **Source Maps**: Easy debugging

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Support

For support or questions:
1. Check the documentation
2. Review the code comments
3. Test with the provided demo data
4. Use the admin panel to manage content

---

**Built with ❤️ for modern travel agencies**
