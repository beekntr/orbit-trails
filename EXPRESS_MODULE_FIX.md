# 🚨 EXPRESS MODULE NOT FOUND - QUICK FIX

## 🔧 Ubuntu Server Commands (Run These Now)

```bash
cd /home/lester/orbit-trails

# Stop PM2
pm2 stop all
pm2 delete all

# Install tsx globally (this often fixes module resolution)
npm install -g tsx

# Try running directly first to test
npx tsx server/node-build.ts

# If that works, then start PM2
pm2 start ecosystem.config.cjs --env production
```

## 🛠️ Alternative Fix: Install tsx locally

```bash
cd /home/lester/orbit-trails

# Install tsx as a dependency (not just dev)
npm install tsx

# Start PM2
pm2 start ecosystem.config.cjs --env production
```

## 🔍 Debug Steps

1. **Check if express is installed:**
   ```bash
   ls -la node_modules/express/
   ```

2. **Check if tsx can find express:**
   ```bash
   npx tsx -e "console.log(require.resolve('express'))"
   ```

3. **Try running the server directly:**
   ```bash
   npx tsx server/node-build.ts
   ```

## 📋 If Direct Run Works

If `npx tsx server/node-build.ts` works but PM2 fails, try:

```bash
# Update PM2 to latest
pm2 update

# Clear PM2 cache
pm2 flush

# Start again
pm2 start ecosystem.config.cjs --env production
```

## 🆘 Emergency Backup Plan

If all else fails, I can create a simple Node.js server without TypeScript:

```bash
cd /home/lester/orbit-trails
# Let me know if you need this fallback option
```

Try the tsx global install first - this usually resolves module resolution issues! 🔧
