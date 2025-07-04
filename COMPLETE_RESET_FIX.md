# 🚨 COMPLETE PM2 RESET - FINAL FIX

## ❗ Problem Detected
The logs show PM2 is running BOTH old and new configurations simultaneously:
- Output logs: Still showing `npx tsx server/node-build.ts` 
- Error logs: Showing `server/simple.mjs`

This means PM2 has conflicting processes running.

## ⚡ COMPLETE RESET (Run These Commands)

```bash
cd /home/lester/orbit-trails

# 1. NUCLEAR OPTION - Kill everything
pm2 kill
pkill -f "orbit-trails"
pkill -f "tsx"
pkill -f "node.*server"

# 2. Clean PM2 completely
rm -rf ~/.pm2/logs/*
rm -rf ~/.pm2/pids/*
pm2 resurrect

# 3. Verify Express exists (critical step)
ls -la node_modules/express/

# 4. If Express missing, reinstall
if [ ! -d "node_modules/express" ]; then
    echo "Express not found, reinstalling..."
    rm -rf node_modules package-lock.json
    npm install
fi

# 5. Test server directly FIRST
echo "Testing server directly..."
timeout 10s node server/simple.mjs &
sleep 5
curl http://localhost:3001/health
pkill -f "node.*simple.mjs"

# 6. If direct test worked, start PM2
pm2 start ecosystem.config.cjs --env production

# 7. Verify PM2 is using the right config
pm2 show orbit-trails-api
```

## 🔍 Critical Verification Steps

```bash
# Check what PM2 thinks it's running
pm2 show orbit-trails-api | grep script

# Should show: script: './server/simple.mjs'
# NOT: npm run start:dev
```

## 🆘 If Still Failing

Try this minimal approach:
```bash
# Kill everything
pm2 kill

# Install just the essential packages
npm install express cors dotenv

# Test directly
node server/simple.mjs

# Start PM2 with explicit command
pm2 start server/simple.mjs --name orbit-trails-api --env production
```

## 🎯 Success Indicators

1. **Direct test works**: `node server/simple.mjs` shows server startup messages
2. **PM2 shows correct script**: `pm2 show orbit-trails-api` shows `script: './server/simple.mjs'`
3. **Health check works**: `curl http://localhost:3001/health` returns JSON

**The key is ensuring ONLY the simple.mjs process is running!** 🔥
