# 🚨 CORS FIX - URGENT DEPLOYMENT

## 🔍 Issues Fixed

1. **CORS Policy**: Added `https://www.orbittrails.com` to allowed origins
2. **Enhanced CORS**: Added proper methods and headers
3. **Multiple domains**: Added common domain variations

## ⚡ DEPLOY FIX IMMEDIATELY

```bash
# On your Ubuntu server
cd /home/lester/orbit-trails

# Pull the CORS fix
git pull origin main

# Restart PM2 with updated CORS settings
pm2 restart orbit-trails-api

# Check logs
pm2 logs orbit-trails-api --lines 5
```

## 🧪 Test CORS Fix

```bash
# Test CORS from command line
curl -H "Origin: https://www.orbittrails.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://api.orbittrails.com/api/tours

# Should return CORS headers, not an error
```

## 🌐 Frontend API URL Fix

The error also shows `//tours` (double slash). Your frontend might have a configuration issue.

**Check your frontend environment:**
- Should be: `VITE_API_URL=https://api.orbittrails.com`
- NOT: `VITE_API_URL=https://api.orbittrails.com/`

**In your API calls, ensure:**
- URL: `${VITE_API_URL}/api/tours`
- NOT: `${VITE_API_URL}//tours`

## 🎯 Updated CORS Origins

The server now allows requests from:
- ✅ `https://www.orbittrails.com`
- ✅ `https://orbittrails.com`
- ✅ `https://orbittrails.vercel.app`
- ✅ `https://www.orbittrails.vercel.app`
- ✅ `http://localhost:5173`
- ✅ `http://localhost:3000`

## 🔧 Verification Steps

1. **Deploy the CORS fix** (commands above)
2. **Check your frontend** environment variables
3. **Test the API** in browser dev tools
4. **Verify**: Network tab should show successful API calls

## 📋 Expected Success

After deploying this fix:
- ✅ CORS errors disappear
- ✅ Tours load successfully
- ✅ API calls work from `www.orbittrails.com`

Run the deployment commands and test immediately! 🚀
