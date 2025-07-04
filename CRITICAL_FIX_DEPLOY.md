# 🚨 CRITICAL FIX: Backend API Issues

## **Root Cause Analysis**
1. **Wrong Server Running**: PM2 is running `simple.mjs` (mock server) instead of proper TypeScript server
2. **Port Mismatch**: Frontend expects API on port 3000, but server runs on 3001
3. **Missing Environment Variables**: No `VITE_API_URL` configured properly
4. **CORS Origin Issues**: Frontend URL not in CORS allowed origins

## **🔧 IMMEDIATE FIXES APPLIED**

### 1. Fixed PM2 Configuration
**File**: `ecosystem.config.cjs`
```javascript
// CHANGED FROM:
script: './server/simple.mjs',

// CHANGED TO:
script: 'npx',
args: 'tsx server/server.ts',
```

### 2. Fixed API Base URL
**File**: `shared/api.ts`
```typescript
// CHANGED FROM:
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// CHANGED TO:
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

### 3. Updated Environment Variables
**File**: `.env`
```bash
# ADDED:
VITE_API_URL=http://localhost:3001
NODE_ENV=production
FRONTEND_URL=http://localhost:8080
```

## **🚀 DEPLOYMENT STEPS**

### Step 1: Stop Current Server
```bash
pm2 stop orbit-trails-api
pm2 delete orbit-trails-api
```

### Step 2: Install Missing Dependencies (if needed)
```bash
npm install tsx @types/cors @types/express
```

### Step 3: Start Fixed Server
```bash
pm2 start ecosystem.config.cjs --env production
```

### Step 4: Verify Server is Running
```bash
pm2 status
pm2 logs orbit-trails-api --lines 10
```

### Step 5: Test API Endpoints
```bash
# Health check
curl http://localhost:3001/api/health

# Tours endpoint
curl http://localhost:3001/api/tours

# Contact endpoint (POST test)
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test message"}'
```

## **🎯 EXPECTED RESULTS**

### After Fix, You Should See:
1. **PM2 Logs**: 
   ```
   🚀 Orbit Trails API Server running on port 3001
   📍 Health Check: http://localhost:3001/api/health
   🎯 API Base URL: http://localhost:3001/api
   ```

2. **API Health Check**:
   ```json
   {
     "status": "OK",
     "message": "Orbit Trails API is running",
     "timestamp": "2025-07-04T12:30:00.000Z"
   }
   ```

3. **Tours API Response**:
   ```json
   {
     "success": true,
     "data": {
       "tours": [...],
       "groupedTours": {...},
       "total": 5
     }
   }
   ```

## **🌐 FRONTEND DEPLOYMENT**

### For Production Frontend:
1. **Set Environment Variable**:
   ```bash
   # In your frontend deployment (Vercel/Netlify):
   VITE_API_URL=https://api.orbittrails.com
   ```

2. **Update CORS** (if using custom domain):
   ```typescript
   // server/index.ts - already configured with:
   process.env.FRONTEND_PROD_URL || "https://www.orbittrails.com"
   ```

## **🔍 TROUBLESHOOTING**

### If API Still Not Working:
```bash
# Check if server is actually running
netstat -tulpn | grep :3001

# Check PM2 logs for errors
pm2 logs orbit-trails-api --lines 50

# Restart with fresh logs
pm2 restart orbit-trails-api
pm2 flush  # Clear old logs
```

### If Database Connection Fails:
```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://info:icmBhaaVmSYJqRyy@productiondb.itgewbu.mongodb.net/?retryWrites=true&w=majority&appName=ProductionDB')
.then(() => console.log('✅ DB Connected'))
.catch(err => console.error('❌ DB Error:', err));
"
```

## **📋 VERIFICATION CHECKLIST**

- [ ] PM2 shows server running on port 3001
- [ ] `/api/health` returns 200 OK
- [ ] `/api/tours` returns tour data with database records
- [ ] Frontend loads tours without "failed to fetch" error
- [ ] Contact form submits successfully
- [ ] Admin login works (username: admin, password: admin123)
- [ ] Custom tour modal submits successfully

## **🎯 THIS WILL FIX:**
- ❌ "Failed to fetch tours" error on tours page
- ❌ Contact form 404 errors
- ❌ Admin login not working
- ❌ Custom tour requests failing
- ❌ All CORS policy errors

**Deploy this fix immediately and test!** 🚀
