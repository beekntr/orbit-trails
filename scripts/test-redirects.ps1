# PowerShell script to test redirect functionality
# Run this after deploying to verify redirects are working

Write-Host "🔄 Testing Orbit Trails Redirect Functionality" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

$domain = "https://www.orbittrails.com"

# Function to test redirect
function Test-Redirect {
    param(
        [string]$oldUrl,
        [string]$expectedNewUrl
    )
    
    Write-Host "Testing: $oldUrl" -ForegroundColor Yellow
    
    try {
        # Test the redirect
        $response = Invoke-WebRequest -Uri "$domain$oldUrl" -Method Head -MaximumRedirection 0 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 301) {
            Write-Host "✅ 301 Redirect working" -ForegroundColor Green
            $location = $response.Headers.Location
            
            if ($location -like "*$expectedNewUrl*") {
                Write-Host "✅ Redirects to correct URL: $location" -ForegroundColor Green
            } else {
                Write-Host "❌ Redirects to wrong URL: $location (expected: $expectedNewUrl)" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ No redirect found. Status: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error testing redirect: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Testing main page redirects..." -ForegroundColor Blue
Test-Redirect "/index.html" "/"
Test-Redirect "/home.html" "/"
Test-Redirect "/about.html" "/about"
Test-Redirect "/contact.html" "/contact"
Test-Redirect "/tours.html" "/tours"
Test-Redirect "/blog.html" "/blog"

Write-Host "Testing blog post redirects..." -ForegroundColor Blue
Test-Redirect "/blog/golden-triangle-guide.html" "/blog/complete-golden-triangle-travel-guide-2025"
Test-Redirect "/blog/rajasthan-travel.html" "/blog/best-time-visit-rajasthan-complete-guide"

Write-Host "Testing tour page redirects..." -ForegroundColor Blue
Test-Redirect "/golden-triangle.html" "/tour-details/golden-triangle-classic"
Test-Redirect "/rajasthan-tour.html" "/tour-details/rajasthan-royal-heritage"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Redirect testing complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Submit new sitemap to Google Search Console"
Write-Host "2. Use URL Inspection tool to request re-indexing"
Write-Host "3. Monitor Coverage reports for 404 errors"
Write-Host "4. Update external links and social media profiles"
