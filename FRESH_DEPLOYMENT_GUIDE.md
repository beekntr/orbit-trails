# 🚀 Fresh Ubuntu Server Deployment - api.orbittrails.com

## 📋 Complete Deployment Guide

### 🖥️ Step 1: Server Preparation

```bash
# SSH into your new Ubuntu server
ssh root@api.orbittrails.com
# or
ssh ubuntu@api.orbittrails.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Verify installations
node --version
npm --version
pm2 --version
nginx -v
```

### 📦 Step 2: Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/orbit-trails
sudo chown $USER:$USER /var/www/orbit-trails
cd /var/www/orbit-trails

# Clone your repository
git clone <your-github-repo-url> .
# or upload files if not using git

# Install dependencies
npm ci

# Copy environment file
cp .env.production.example .env

# Edit environment variables
nano .env
```

### 🔧 Step 3: Environment Configuration

Edit `/var/www/orbit-trails/.env`:

```bash
# Database Configuration (MongoDB Atlas Production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orbit-trails?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=aece24c23465f48a2e9be2c75330dba650cf01bf85e7ac58ef9bfdef6bf0c8fd
JWT_EXPIRE=7d

# Email Configuration (Production SMTP)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@orbittrails.com

# Admin Configuration
ADMIN_EMAIL=admin@orbittrails.com

# Server Configuration
NODE_ENV=production
PORT=3001

# CORS Configuration (Update with your actual frontend domain)
CORS_ORIGIN=https://your-frontend-domain.vercel.app
FRONTEND_PROD_URL=https://your-frontend-domain.vercel.app

# Backend API URL
BACKEND_API_URL=https://api.orbittrails.com

# Security Settings
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### 🚀 Step 4: Start Application

```bash
# Create logs directory
mkdir -p logs

# Test the server directly first
node server/simple.mjs

# If it works, start with PM2
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save
pm2 startup

# Check status
pm2 status
pm2 logs orbit-trails-api
```

### 🌐 Step 5: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/orbit-trails
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name api.orbittrails.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.orbittrails.com;

    # SSL Configuration (will be added by Certbot)
    
    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Proxy to Node.js app
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
```

Enable the site:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/orbit-trails /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 🔒 Step 6: SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d api.orbittrails.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### ✅ Step 7: Verification

```bash
# Test health endpoints
curl http://localhost:3001/health
curl https://api.orbittrails.com/health
curl https://api.orbittrails.com/api/health

# Test API endpoints
curl https://api.orbittrails.com/api/demo
curl https://api.orbittrails.com/api/tours
```

### 🔧 Step 8: Update Frontend Configuration

Update your frontend environment variables (Vercel):

```bash
VITE_API_URL=https://api.orbittrails.com
```

Update backend CORS configuration in `.env`:

```bash
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 📊 Step 9: Monitoring Setup

```bash
# View PM2 logs
pm2 logs orbit-trails-api

# Monitor PM2 processes
pm2 monit

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 🛡️ Step 10: Security Hardening

```bash
# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Disable root login (if using ubuntu user)
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh

# Set up automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

## 🎯 Expected Results

After completing all steps:

1. **Health Check**: `https://api.orbittrails.com/health` returns JSON
2. **API Endpoints**: `https://api.orbittrails.com/api/*` work
3. **SSL**: A+ rating on SSL Labs
4. **PM2**: Process running stable
5. **Logs**: Clean startup logs in PM2

## 🆘 Troubleshooting

### Common Issues:

1. **PM2 not starting**: Check `pm2 logs orbit-trails-api`
2. **Nginx 502**: Check if Node.js is running on port 3001
3. **SSL issues**: Run `sudo certbot renew`
4. **CORS errors**: Update CORS_ORIGIN in `.env`

### Debug Commands:

```bash
# Check if port 3001 is in use
sudo netstat -tlnp | grep 3001

# Check Nginx status
sudo systemctl status nginx

# Check PM2 status
pm2 status

# Test Node.js directly
node server/simple.mjs
```

This fresh deployment should work perfectly! 🚀
