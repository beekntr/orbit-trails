# 🚨 UBUNTU SERVER DEPLOYMENT FIX

## ❌ Current Issues
1. `tsc: not found` - TypeScript not installed (it's in devDependencies)
2. `vite: not found` - Vite not installed (it's in devDependencies)
3. `npm ci --only=production` doesn't install build tools

## ✅ Solution Options

### Option A: Install All Dependencies (Recommended)
```bash
cd /home/lester/orbit-trails

# Install ALL dependencies (including dev) for building
npm ci

# Now build the server
npm run build:backend

# Verify the build
ls -la dist/server/production.mjs

# Start with PM2
pm2 start ecosystem.config.cjs --env production
```

### Option B: Use tsx to Run TypeScript Directly
```bash
cd /home/lester/orbit-trails

# Install all dependencies
npm ci

# Start directly with tsx (no build needed)
pm2 start ecosystem.config.cjs --env production
```

## 🔧 Updated PM2 Config
The ecosystem.config.cjs has been updated to use tsx directly:
```javascript
script: 'npx',
args: 'tsx server/node-build.ts',
```

## 📋 Complete Deployment Steps

```bash
# 1. Navigate to project
cd /home/lester/orbit-trails

# 2. Pull latest changes
git pull origin main

# 3. Install ALL dependencies (including dev for build tools)
npm ci

# 4. Start with PM2 (tsx will handle TypeScript)
pm2 start ecosystem.config.cjs --env production

# 5. Verify
pm2 status
pm2 logs orbit-trails-api
```

## 🔍 What the Build Does

The `npm run build:backend` command:
- Compiles `server/node-build.ts` → `dist/server/production.mjs`
- Bundles all dependencies
- Creates the executable file PM2 needs

## ⚡ Expected Output

After `npm run build:backend`, you should see:
```bash
$ ls -la dist/server/
total 1234
-rw-r--r-- 1 lester lester 567890 Jul  4 12:34 production.mjs
-rw-r--r-- 1 lester lester  12345 Jul  4 12:34 production.mjs.map
```

## 🎯 Verification

After PM2 starts successfully:
```bash
# Check PM2 status
pm2 status

# Test the server
curl http://localhost:3001/health
curl http://localhost:3001/api/health
```

## 📋 Complete Deployment Checklist

- [ ] `git pull origin main`
- [ ] `npm ci --only=production` 
- [ ] `npm run build:backend` ⚠️ **CRITICAL STEP**
- [ ] `ls -la dist/server/production.mjs` (verify file exists)
- [ ] `pm2 start ecosystem.config.cjs --env production`
- [ ] `pm2 status` (verify running)
- [ ] Test health endpoints

**The build step is required every time you deploy!** 🔥
