# Test Review API Endpoints - PowerShell Version
Write-Host "🧪 Testing Orbit Trails Review API Endpoints" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$API_BASE = "http://localhost:3000/api"

# Test 1: Submit a new review
Write-Host "`n📝 Test 1: Submitting a new review..." -ForegroundColor Yellow
$reviewData = @{
    name = "Test User PowerShell"
    email = "testps@example.com"
    rating = 4
    description = "This is a test review from PowerShell testing script. Excellent experience!"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$API_BASE/reviews" -Method POST -Body $reviewData -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response1 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get all approved reviews
Write-Host "`n📋 Test 2: Getting all approved reviews..." -ForegroundColor Yellow
try {
    $response2 = Invoke-RestMethod -Uri "$API_BASE/reviews" -Method GET -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response2 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get random approved reviews
Write-Host "`n🎲 Test 3: Getting random approved reviews (limit 3)..." -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "$API_BASE/reviews/random?limit=3" -Method GET -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response3 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Health check
Write-Host "`n💓 Test 4: API Health check..." -ForegroundColor Yellow
try {
    $response4 = Invoke-RestMethod -Uri "$API_BASE/health" -Method GET -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response4 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ API testing complete!" -ForegroundColor Green
Write-Host "Note: Admin endpoints require authentication and are not included in this basic test." -ForegroundColor Cyan
