# 🚨 URGENT: Double Slash URL Fix

## Problem Identified:
Your frontend is making requests to `https://api.orbittrails.com//api/contact` (double slash) instead of `https://api.orbittrails.com/api/contact` (single slash).

## Root Cause:
The `VITE_API_URL` environment variable likely has a trailing slash, causing `${baseUrl}${endpoint}` to create double slashes.

## ✅ FIXES APPLIED:

### 1. Frontend Fix (shared/api.ts):
- ✅ Automatic removal of trailing slashes from API URL
- ✅ Better error handling for non-JSON responses  
- ✅ Debug logging to track API requests
- ✅ Proper content-type validation

### 2. Backend Fix (api-server.mjs):
- ✅ Added middleware to handle double slash URLs
- ✅ Automatic URL correction for //api/* patterns
- ✅ Better request logging

## 🚀 DEPLOYMENT STEPS:

### Step 1: Deploy Updated Files
```bash
cd ~/orbit-trails

# Copy the updated files to server
# Make sure to copy:
# - server/api-server.mjs (updated with double slash fix)
# - shared/api.ts (updated with trailing slash removal)
```

### Step 2: Restart Server
```bash
pm2 restart orbit-trails-api
pm2 logs orbit-trails-api --lines 20
```

### Step 3: Check Frontend Environment
```bash
# For Vercel/Netlify deployment, check environment variables:
# VITE_API_URL should be: https://api.orbittrails.com (NO trailing slash)
```

### Step 4: Test API
```bash
# Test from server:
curl http://localhost:3001/api/tours
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# Test double slash handling:
curl http://localhost:3001//api/tours
```

## 🌐 Frontend Environment Fix:

### If using Vercel:
```env
VITE_API_URL=https://api.orbittrails.com
```

### If using Netlify:
```env
VITE_API_URL=https://api.orbittrails.com
```

### If testing locally:
```env
VITE_API_URL=http://localhost:3001
```

**CRITICAL**: Ensure NO trailing slash in `VITE_API_URL`!

## 📊 Expected Results:

After fixes, you should see in browser console:
```
API Request: POST https://api.orbittrails.com/api/contact
API Response from https://api.orbittrails.com/api/contact: {success: true, message: "Thank you..."}
```

And in server logs:
```
GET /api/tours - Origin: https://your-frontend.com
POST /api/contact - Origin: https://your-frontend.com
```

## 🔍 Debug Commands:

### Check Current API URL in Browser Console:
```javascript
// Run this in browser console to check current API URL:
console.log('API Base URL:', window.location.origin.includes('localhost') ? 'http://localhost:3001' : 'https://api.orbittrails.com');
```

### Check Server Logs:
```bash
pm2 logs orbit-trails-api --lines 50 | grep -E "(POST|GET|//api)"
```

Deploy these fixes and test again! 🎯
