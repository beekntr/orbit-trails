#!/bin/bash
# Quick fix deployment for double slash API issue

echo "🚀 Deploying Double Slash API Fix..."

# Upload the fixed server file
echo "📤 Uploading updated server file..."
scp server/simple.mjs root@api.orbittrails.com:/var/www/orbit-trails/server/

# Restart PM2 on the server
echo "🔄 Restarting PM2..."
ssh root@api.orbittrails.com "cd /var/www/orbit-trails && pm2 restart orbit-trails-api"

# Check status
echo "✅ Checking server status..."
ssh root@api.orbittrails.com "pm2 status"

echo "📊 Recent logs:"
ssh root@api.orbittrails.com "pm2 logs orbit-trails-api --lines 5"

echo "🧪 Testing API endpoints..."
echo "Health check:"
curl -s https://api.orbittrails.com/health | jq .

echo "Tours endpoint:"
curl -s https://api.orbittrails.com/api/tours | jq '.tours[0].name'

echo "Double slash tours (should work now):"
curl -s "https://api.orbittrails.com//api/tours" | jq '.tours[0].name'

echo "✅ Deployment complete!"
