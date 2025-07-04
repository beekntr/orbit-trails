# 🔧 Environment Configuration for Orbit Trails

## 📍 Your Specific Setup

- **Backend Server**: `auditorium.api.kshitijsinghbhati.in`
- **Frontend**: Vercel deployment (to be configured)
- **Database**: MongoDB Atlas (configured)

## 🌐 Frontend Environment Variables (Vercel)

Add these environment variables in your Vercel dashboard:

```bash
NODE_ENV=production
VITE_API_URL=https://auditorium.api.kshitijsinghbhati.in
```

### Setting Environment Variables in Vercel:
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://auditorium.api.kshitijsinghbhati.in`
   - **Environment**: Production

## 🖥️ Backend Environment Variables (Ubuntu Server)

Create `/path/to/orbit-trails/.env` on your Ubuntu server:

```bash
# Database Configuration (MongoDB Atlas Production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orbit-trails?retryWrites=true&w=majority

# JWT Configuration (Generate secure secrets)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long-for-production
JWT_EXPIRE=7d

# Email Configuration (Production SMTP - Use SendGrid, Mailgun, etc.)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@your-domain.com

# Admin Configuration
ADMIN_EMAIL=admin@your-domain.com

# Server Configuration
NODE_ENV=production
PORT=3001

# CORS Configuration (Update with your actual frontend domain)
CORS_ORIGIN=https://your-frontend-domain.vercel.app
FRONTEND_PROD_URL=https://your-frontend-domain.vercel.app

# Backend API URL (Your Ubuntu server)
BACKEND_API_URL=https://auditorium.api.kshitijsinghbhati.in

# Security Settings
BCRYPT_SALT_ROUNDS=12
```

## 🔗 API Integration

The frontend is configured to automatically connect to your backend:

- **Development**: `http://localhost:3000/api`
- **Production**: `https://auditorium.api.kshitijsinghbhati.in/api`

This is handled by the `VITE_API_URL` environment variable in `shared/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

## 🚀 Deployment Order

1. **Deploy Backend First**:
   ```bash
   # On your Ubuntu server (auditorium.api.kshitijsinghbhati.in)
   git clone <your-repo>
   cd orbit-trails
   npm ci --only=production
   cp .env.production.example .env
   # Edit .env with actual values
   npm run build:backend
   pm2 start ecosystem.config.cjs --env production
   ```

2. **Configure Nginx** (on Ubuntu server):
   ```nginx
   server {
       listen 80;
       server_name auditorium.api.kshitijsinghbhati.in;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name auditorium.api.kshitijsinghbhati.in;

       ssl_certificate /etc/letsencrypt/live/auditorium.api.kshitijsinghbhati.in/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/auditorium.api.kshitijsinghbhati.in/privkey.pem;

       location / {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Deploy Frontend** (Vercel):
   - Connect GitHub repo to Vercel
   - Set environment variable: `VITE_API_URL=https://auditorium.api.kshitijsinghbhati.in`
   - Deploy

## 🧪 Testing API Connection

### Health Check Endpoints:
- **Main Health**: `https://auditorium.api.kshitijsinghbhati.in/health`
- **API Health**: `https://auditorium.api.kshitijsinghbhati.in/api/health`

### Test Commands:
```bash
# Test backend health
curl https://auditorium.api.kshitijsinghbhati.in/health

# Test API health
curl https://auditorium.api.kshitijsinghbhati.in/api/health

# Test CORS (replace with your Vercel URL)
curl -H "Origin: https://your-frontend.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://auditorium.api.kshitijsinghbhati.in/api/health
```

## 🔐 SSL Certificate Setup

For your Ubuntu server:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d auditorium.api.kshitijsinghbhati.in

# Auto-renewal (already set up by certbot)
sudo crontab -l | grep certbot
```

## 📱 Frontend-Backend Communication

The application will automatically handle:
- ✅ Development: Frontend calls `localhost:3000`
- ✅ Production: Frontend calls `auditorium.api.kshitijsinghbhati.in`
- ✅ CORS configuration for your domains
- ✅ HTTPS enforcement in production
- ✅ Error handling and retries

## 🎯 Next Steps

1. **Set up SSL** on `auditorium.api.kshitijsinghbhati.in`
2. **Deploy backend** to your Ubuntu server
3. **Test health endpoints**
4. **Deploy frontend** to Vercel with the `VITE_API_URL` environment variable
5. **Update CORS_ORIGIN** in backend .env with your actual Vercel URL

Your backend URL is now properly configured throughout the application! 🚀
