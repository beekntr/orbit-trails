# 🚨 CRITICAL: PM2 Still Running Old Config

## ❗ Problem
The logs show PM2 is still running:
```
> NODE_ENV=production npx tsx server/node-build.ts
```

This means the new `simple.mjs` configuration hasn't been applied yet.

## ⚡ IMMEDIATE FIX (Run These Exact Commands)

```bash
cd /home/lester/orbit-trails

# 1. FORCE STOP ALL PM2 PROCESSES
pm2 kill

# 2. PULL LATEST CHANGES
git pull origin main

# 3. VERIFY THE SIMPLE SERVER EXISTS
ls -la server/simple.mjs

# 4. VERIFY THE NEW ECOSYSTEM CONFIG
cat ecosystem.config.cjs | grep simple.mjs

# 5. START WITH NEW CONFIG
pm2 start ecosystem.config.cjs --env production

# 6. CHECK STATUS
pm2 status

# 7. CHECK LOGS (should now show the simple server)
pm2 logs orbit-trails-api --lines 10
```

## 🔍 What You Should See

**After step 3:**
```
-rw-r--r-- 1 lester lester 3456 Jul  4 10:20 server/simple.mjs
```

**After step 4:**
```
script: './server/simple.mjs',
```

**After step 7 (SUCCESS):**
```
🚀 Orbit Trails API server running on port 3001
🔧 API Health: http://localhost:3001/health
📊 API Endpoints: http://localhost:3001/api
🌍 Environment: production
```

## 🚨 If Git Pull Fails

If `git pull` says "Already up to date", force refresh:
```bash
git fetch origin main
git reset --hard origin/main
```

## 🧪 Quick Test Once Working

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"...","uptime":123,"environment":"production"}
```

**The key is `pm2 kill` to completely stop the old processes!** 🔥
