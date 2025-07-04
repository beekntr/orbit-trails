# 🚀 Quick Deployment Guide - Orbit Trails

## Overview
Your Orbit Trails travel agency application is now **production-ready** with optimized configurations for:
- **Frontend**: Vercel (Static React SPA)
- **Backend**: Ubuntu Server (Node.js API with PM2)

## 📋 Pre-Deployment Requirements

### 1. MongoDB Atlas Setup
- Create a production MongoDB Atlas cluster
- Whitelist your server IP address
- Create a database user with read/write permissions

### 2. Domain Setup
- Frontend domain (e.g., `orbittrails.com`)
- API domain (e.g., `api.orbittrails.com`)

### 3. Email Service
- Set up SendGrid, Mailgun, or similar SMTP service
- Get API credentials

## ⚡ Quick Deploy - Frontend (Vercel)

### Option 1: Vercel CLI (Fastest)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://api.your-domain.com
```

### Option 2: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build:client`
4. Set output directory: `dist/spa`
5. Add environment variables in dashboard

## 🖥️ Quick Deploy - Backend (Ubuntu Server)

### 1. Server Setup (One-time)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install nginx -y

# Enable services
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2. Deploy Application
```bash
# Clone repository
git clone https://github.com/your-username/orbit-trails.git
cd orbit-trails

# Install dependencies
npm ci

# Create production environment file
cp .env.production.example .env
nano .env  # Fill in your production values

# Build backend
npm run build:backend

# Create logs directory
mkdir logs

# Seed database (if needed)
npm run seed:prod

# Start with PM2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

### 3. Nginx Configuration
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/orbit-trails-api
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/orbit-trails-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
sudo certbot --nginx -d api.your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

## 🔧 Environment Variables

### Frontend (Vercel Dashboard)
```
VITE_API_URL=https://api.your-domain.com
NODE_ENV=production
```

### Backend (.env file on server)
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orbit-trails
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@your-domain.com
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## ✅ Post-Deployment Verification

### 1. Frontend Checks
```bash
# Visit your frontend domain
curl -I https://your-domain.com

# Check if SPA routing works
curl -I https://your-domain.com/tours
curl -I https://your-domain.com/about
```

### 2. Backend Checks
```bash
# Health check
curl https://api.your-domain.com/health

# API endpoints
curl https://api.your-domain.com/api/health
curl https://api.your-domain.com/api/tours
```

### 3. Application Tests
- [ ] Homepage loads correctly
- [ ] Tours page displays data
- [ ] Contact form works
- [ ] Admin login functions
- [ ] Email notifications sent
- [ ] Mobile responsiveness

## 🔍 Monitoring Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs orbit-trails-api

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart orbit-trails-api
```

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails on Vercel**: Check Node.js version in build logs
2. **API not accessible**: Verify PM2 process running and Nginx config
3. **CORS errors**: Ensure CORS_ORIGIN matches frontend domain exactly
4. **Database connection**: Check MongoDB Atlas IP whitelist and credentials

### Quick Fixes:
```bash
# Restart backend
pm2 restart orbit-trails-api

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# View backend logs
pm2 logs orbit-trails-api --lines 50
```

## 🎉 You're Live!

Your Orbit Trails travel agency application is now production-ready and deployed with:

✅ **Secure HTTPS** with auto-renewing SSL certificates  
✅ **Scalable backend** with PM2 cluster mode  
✅ **Fast frontend** on Vercel's global CDN  
✅ **Production database** on MongoDB Atlas  
✅ **Email notifications** via SMTP service  
✅ **Security headers** and rate limiting  
✅ **Health monitoring** and logging  

### Next Steps:
1. Set up monitoring alerts
2. Configure backup schedules
3. Add custom domain
4. Implement analytics
5. Set up staging environment

---

**Need help?** Check the full `PRODUCTION_DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
