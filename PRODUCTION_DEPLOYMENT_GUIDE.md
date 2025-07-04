# Production Deployment Guide

This guide covers deploying the Orbit Trails travel agency application to production with:
- **Frontend**: Vercel (React + Vite SPA)
- **Backend**: Ubuntu Server (Node.js + Express + MongoDB)

## 📋 Pre-Deployment Checklist

### Environment Variables Required

#### Frontend (Vercel)
```env
VITE_API_URL=https://your-api-domain.com
NODE_ENV=production
```

#### Backend (Ubuntu Server)
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orbit-trails
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=7d

# Email Configuration (SendGrid, Mailgun, etc.)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@your-domain.com

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## 🚀 Frontend Deployment (Vercel)

### Step 1: Prepare the Frontend

1. **Update API URL in your frontend environment**:
   ```bash
   # Create .env.production file
   echo "VITE_API_URL=https://your-api-domain.com" > .env.production
   ```

2. **Test the build locally**:
   ```bash
   npm run build:client
   npm run preview
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
vercel --prod

# Set environment variables
vercel env add VITE_API_URL production
# Enter: https://your-api-domain.com
```

#### Option B: GitHub Integration
1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `npm ci`
4. Add environment variables in Vercel dashboard

### Step 3: Configure Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Navigate to Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

## 🖥️ Backend Deployment (Ubuntu Server)

### Step 1: Server Preparation

1. **Update system packages**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js (LTS)**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2 for process management**:
   ```bash
   sudo npm install -g pm2
   ```

4. **Install Nginx for reverse proxy**:
   ```bash
   sudo apt install nginx -y
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

### Step 2: Deploy Application

1. **Clone and setup the application**:
   ```bash
   # Clone your repository
   git clone https://github.com/your-username/orbit-trails.git
   cd orbit-trails
   
   # Install dependencies
   npm ci --production
   
   # Build the backend
   npm run build:backend
   ```

2. **Create environment file**:
   ```bash
   # Copy and edit environment variables
   cp .env.example .env
   nano .env
   # Fill in all production values
   ```

3. **Seed the database (if needed)**:
   ```bash
   npm run seed:prod
   ```

### Step 3: Process Management with PM2

1. **Create PM2 ecosystem file**:
   ```bash
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'orbit-trails-api',
       script: './dist/server/index.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'development'
       },
       env_production: {
         NODE_ENV: 'production',
         PORT: 3001
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log',
       time: true,
       max_memory_restart: '1G'
     }]
   }
   EOF
   ```

2. **Create logs directory**:
   ```bash
   mkdir logs
   ```

3. **Start the application**:
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   # Follow the instructions to enable PM2 startup on boot
   ```

### Step 4: Nginx Configuration

1. **Create Nginx configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/orbit-trails-api
   ```

2. **Add the following configuration**:
   ```nginx
   server {
       listen 80;
       server_name your-api-domain.com;
       
       # Redirect HTTP to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name your-api-domain.com;
       
       # SSL Configuration (Let's Encrypt)
       ssl_certificate /etc/letsencrypt/live/your-api-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-api-domain.com/privkey.pem;
       
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
       
       # Rate limiting
       limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
       limit_req zone=api burst=20 nodelay;
       
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
           
           # Timeouts
           proxy_connect_timeout 60s;
           proxy_send_timeout 60s;
           proxy_read_timeout 60s;
       }
   }
   ```

3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/orbit-trails-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 5: SSL Certificate with Let's Encrypt

1. **Install Certbot**:
   ```bash
   sudo apt install snapd
   sudo snap install core; sudo snap refresh core
   sudo snap install --classic certbot
   sudo ln -s /snap/bin/certbot /usr/bin/certbot
   ```

2. **Obtain SSL certificate**:
   ```bash
   sudo certbot --nginx -d your-api-domain.com
   ```

3. **Set up auto-renewal**:
   ```bash
   sudo certbot renew --dry-run
   ```

## 🔍 Monitoring and Maintenance

### PM2 Monitoring

```bash
# View application status
pm2 status

# View logs
pm2 logs orbit-trails-api

# Restart application
pm2 restart orbit-trails-api

# Monitor resources
pm2 monit
```

### Health Check Endpoint

Add this to your Express server for monitoring:

```javascript
// In server/index.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### Database Monitoring

1. **MongoDB Atlas**: Use built-in monitoring dashboard
2. **Self-hosted MongoDB**: Set up monitoring with tools like MongoDB Compass

## 🔐 Security Recommendations

### Backend Security
- ✅ Environment variables properly configured
- ✅ CORS configured for production domain
- ✅ JWT secrets are secure (32+ characters)
- ✅ Rate limiting implemented in Nginx
- ✅ Security headers configured
- ✅ HTTPS enforced

### Additional Security Measures
1. **Firewall Configuration**:
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

2. **Regular Updates**:
   ```bash
   # Weekly security updates
   sudo apt update && sudo apt upgrade -y
   ```

3. **Backup Strategy**:
   - Database: Regular MongoDB Atlas backups or mongodump
   - Application: Git repository with tagged releases

## 🚨 Troubleshooting

### Common Issues

1. **Build fails on Vercel**:
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json
   - Check build logs for specific errors

2. **API not accessible**:
   - Verify PM2 process is running: `pm2 status`
   - Check Nginx configuration: `sudo nginx -t`
   - Verify firewall settings: `sudo ufw status`

3. **CORS errors**:
   - Ensure CORS_ORIGIN environment variable matches frontend domain
   - Check preflight OPTIONS requests

4. **Database connection issues**:
   - Verify MongoDB connection string
   - Check network access in MongoDB Atlas
   - Ensure IP whitelist includes server IP

### Emergency Procedures

1. **Rollback deployment**:
   ```bash
   # PM2 rollback
   pm2 restart orbit-trails-api --update-env
   
   # Vercel rollback
   vercel --prod --rollback
   ```

2. **Scale up/down**:
   ```bash
   # Increase PM2 instances
   pm2 scale orbit-trails-api +2
   
   # Decrease instances
   pm2 scale orbit-trails-api 2
   ```

## 📞 Post-Deployment Verification

### Frontend Checklist
- [ ] Website loads correctly on Vercel domain
- [ ] All pages navigate properly
- [ ] API calls work with production backend
- [ ] Images and assets load correctly
- [ ] No console errors

### Backend Checklist
- [ ] PM2 process running: `pm2 status`
- [ ] Health endpoint accessible: `curl https://your-api-domain.com/health`
- [ ] Database connection working
- [ ] SSL certificate valid
- [ ] Logs are being generated: `pm2 logs`

### Performance Testing
```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s "https://your-api-domain.com/api/tours"

# Create curl-format.txt
echo "time_namelookup: %{time_namelookup}\ntime_connect: %{time_connect}\ntime_starttransfer: %{time_starttransfer}\ntime_total: %{time_total}\n" > curl-format.txt
```

---

## 🎉 Deployment Complete!

Your Orbit Trails application is now production-ready and deployed. Remember to:

1. Monitor application performance regularly
2. Keep dependencies updated
3. Maintain regular backups
4. Monitor SSL certificate expiration
5. Review logs for any issues

For ongoing maintenance, refer to the monitoring and troubleshooting sections above.
