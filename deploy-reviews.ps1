# 🚀 Deploy Review System to Production

Write-Host "🌟 Deploying Orbit Trails Review System" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Step 1: Build the server
Write-Host "`n📦 Step 1: Building server..." -ForegroundColor Yellow
npm run build:server

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Server built successfully!" -ForegroundColor Green

# Step 2: Copy the built files to your production server
Write-Host "`n🚛 Step 2: Files ready for deployment" -ForegroundColor Yellow
Write-Host "The following files need to be copied to your production server:" -ForegroundColor White

$deployFiles = @(
    "dist/server/index.mjs",
    "dist/server/index.mjs.map", 
    "server/production.mjs",
    "package.json",
    ".env"
)

foreach ($file in $deployFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (missing)" -ForegroundColor Red
    }
}

# Step 3: Show deployment commands
Write-Host "`n🖥️  Step 3: Production Server Commands" -ForegroundColor Yellow
Write-Host "Run these commands on your production server:" -ForegroundColor White
Write-Host ""
Write-Host "# Install dependencies" -ForegroundColor Gray
Write-Host "npm install --production" -ForegroundColor White
Write-Host ""
Write-Host "# Seed sample reviews (optional)" -ForegroundColor Gray  
Write-Host "npx tsx server/seedReviews.ts" -ForegroundColor White
Write-Host ""
Write-Host "# Start/restart the server" -ForegroundColor Gray
Write-Host "pm2 restart orbit-trails" -ForegroundColor White
Write-Host "# OR if not using PM2:" -ForegroundColor Gray
Write-Host "node server/production.mjs" -ForegroundColor White

# Step 4: Test endpoints
Write-Host "`n🧪 Step 4: Test endpoints after deployment" -ForegroundColor Yellow
Write-Host "Test these URLs to verify the review system works:" -ForegroundColor White
Write-Host ""
Write-Host "✅ Health Check: https://api.orbittrails.com/health" -ForegroundColor Green
Write-Host "✅ Submit Review: POST https://api.orbittrails.com/api/reviews" -ForegroundColor Green  
Write-Host "✅ Get Reviews: GET https://api.orbittrails.com/api/reviews" -ForegroundColor Green
Write-Host "✅ Random Reviews: GET https://api.orbittrails.com/api/reviews/random?count=3" -ForegroundColor Green

Write-Host "`n📋 Frontend Routes:" -ForegroundColor Yellow
Write-Host "✅ Review Form: https://www.orbittrails.com/review-us" -ForegroundColor Green
Write-Host "✅ Customer Reviews: https://www.orbittrails.com/customer-reviews" -ForegroundColor Green  
Write-Host "✅ Admin Panel: https://www.orbittrails.com/adm" -ForegroundColor Green

Write-Host "`n🎉 Deployment package ready!" -ForegroundColor Green
Write-Host "Copy the files listed above to your production server and run the commands shown." -ForegroundColor Cyan
