# Post-Deployment Verification Script

Write-Host "🧪 Testing Orbit Trails Review System - Production" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$API_BASE = "https://api.orbittrails.com"

# Test 1: Health Check
Write-Host "`n💓 Test 1: API Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$API_BASE/health" -Method GET -ContentType "application/json"
    Write-Host "✅ API is healthy!" -ForegroundColor Green
    Write-Host "Status: $($health.status)" -ForegroundColor White
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Random Reviews Endpoint  
Write-Host "`n🎲 Test 2: Random Reviews Endpoint..." -ForegroundColor Yellow
try {
    $randomReviews = Invoke-RestMethod -Uri "$API_BASE/api/reviews/random?count=3" -Method GET -ContentType "application/json"
    if ($randomReviews.success) {
        Write-Host "✅ Random reviews endpoint working!" -ForegroundColor Green
        Write-Host "Returned $($randomReviews.data.Count) reviews" -ForegroundColor White
    } else {
        Write-Host "⚠️ Endpoint available but no reviews found" -ForegroundColor Yellow
        Write-Host "Message: $($randomReviews.message)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Random reviews failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Submit a Test Review
Write-Host "`n📝 Test 3: Submitting Test Review..." -ForegroundColor Yellow
$testReview = @{
    name = "Test Deployment User"
    email = "test@deployment.com"
    rating = 5
    description = "This is a test review to verify the deployment worked correctly!"
} | ConvertTo-Json

try {
    $submitResponse = Invoke-RestMethod -Uri "$API_BASE/api/reviews" -Method POST -Body $testReview -ContentType "application/json"
    if ($submitResponse.success) {
        Write-Host "✅ Review submission working!" -ForegroundColor Green
        Write-Host "Message: $($submitResponse.message)" -ForegroundColor White
    } else {
        Write-Host "❌ Review submission failed" -ForegroundColor Red
        Write-Host "Message: $($submitResponse.message)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Review submission failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Frontend URLs (just show them)
Write-Host "`n🌐 Test 4: Frontend URLs to Test Manually..." -ForegroundColor Yellow
Write-Host "✅ Review Form: https://www.orbittrails.com/review-us" -ForegroundColor Green
Write-Host "✅ Reviews Page: https://www.orbittrails.com/customer-reviews" -ForegroundColor Green  
Write-Host "✅ Admin Panel: https://www.orbittrails.com/adm" -ForegroundColor Green
Write-Host "✅ Homepage: https://www.orbittrails.com (check testimonials section)" -ForegroundColor Green

Write-Host "`n🎉 Production Testing Complete!" -ForegroundColor Green
Write-Host "If all tests pass, your review system is fully deployed and working!" -ForegroundColor Cyan
