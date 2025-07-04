# 🔧 PM2 Configuration Fix

## ❌ Problem
PM2 was throwing an error because `ecosystem.config.js` is treated as an ES module due to `"type": "module"` in `package.json`, but PM2 requires CommonJS format for its configuration files.

## ✅ Solution
Renamed `ecosystem.config.js` to `ecosystem.config.cjs` to force CommonJS format.

## 🚀 Updated Deployment Command

Use this command on your Ubuntu server:

```bash
pm2 start ecosystem.config.cjs --env production
```

## 📝 Complete Ubuntu Server Setup

```bash
# Navigate to your project
cd /home/lester/orbit-trails

# Pull latest changes (get the .cjs config file)
git pull origin main

# Install ALL dependencies (including dev tools needed for TypeScript)
npm ci

# Start with PM2 (now uses tsx to run TypeScript directly)
pm2 start ecosystem.config.cjs --env production

# Verify it's running
pm2 status
pm2 logs orbit-trails-api
```

## 🔍 Verification Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs orbit-trails-api

# Test health endpoint
curl http://localhost:3001/health
curl http://localhost:3001/api/health

# Test external access (if Nginx is configured)
curl https://auditorium.api.kshitijsinghbhati.in/health
```

## 📋 Files Updated
- ✅ `ecosystem.config.cjs` (new CommonJS version)
- ✅ All documentation files updated to use `.cjs` extension
- ✅ Old `ecosystem.config.js` removed

The PM2 configuration is now compatible with your ES module setup! 🎉
