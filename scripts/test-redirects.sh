#!/bin/bash

# Script to test redirect functionality
# Run this after deploying to verify redirects are working

echo "🔄 Testing Orbit Trails Redirect Functionality"
echo "=============================================="

DOMAIN="https://www.orbittrails.com"

# Function to test redirect
test_redirect() {
    local old_url="$1"
    local expected_new_url="$2"
    
    echo "Testing: $old_url"
    
    # Get the redirect response
    response=$(curl -s -I -L "$DOMAIN$old_url" | head -n 1)
    location=$(curl -s -I "$DOMAIN$old_url" | grep -i "location:" | cut -d' ' -f2 | tr -d '\r')
    
    if [[ $response == *"301"* ]]; then
        echo "✅ 301 Redirect working"
        if [[ "$location" == *"$expected_new_url"* ]]; then
            echo "✅ Redirects to correct URL: $location"
        else
            echo "❌ Redirects to wrong URL: $location (expected: $expected_new_url)"
        fi
    else
        echo "❌ No redirect found. Response: $response"
    fi
    echo ""
}

echo "Testing main page redirects..."
test_redirect "/index.html" "/"
test_redirect "/home.html" "/"
test_redirect "/about.html" "/about"
test_redirect "/contact.html" "/contact"
test_redirect "/tours.html" "/tours"
test_redirect "/blog.html" "/blog"

echo "Testing blog post redirects..."
test_redirect "/blog/golden-triangle-guide.html" "/blog/complete-golden-triangle-travel-guide-2025"
test_redirect "/blog/rajasthan-travel.html" "/blog/best-time-visit-rajasthan-complete-guide"

echo "Testing tour page redirects..."
test_redirect "/golden-triangle.html" "/tour-details/golden-triangle-classic"
test_redirect "/rajasthan-tour.html" "/tour-details/rajasthan-royal-heritage"

echo "=============================================="
echo "✅ Redirect testing complete!"
echo ""
echo "📋 Next steps:"
echo "1. Submit new sitemap to Google Search Console"
echo "2. Use URL Inspection tool to request re-indexing"
echo "3. Monitor Coverage reports for 404 errors"
echo "4. Update external links and social media profiles"
