# 🚨 URGENT: CONTACT FORM & API FIX

## What Was Fixed
Added missing `/api/contact` endpoint for both single and double slash URLs.

## Changes Made
1. **Added contact form handler** - Both `//api/contact` and `/api/contact`
2. **Enhanced logging** - All API requests are now logged with debugging info
3. **Fixed double slash handling** - All API routes work with both formats

## Quick Deployment Commands

```bash
# Copy updated server file to production
scp server/simple.mjs root@api.orbittrails.com:/var/www/orbit-trails/server/

# SSH to server and restart
ssh root@api.orbittrails.com

# Navigate to project and restart PM2
cd /var/www/orbit-trails
pm2 restart orbit-trails-api

# Check logs to verify
pm2 logs orbit-trails-api --lines 5

# Test the contact endpoint
curl -X POST https://api.orbittrails.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test message"}'
```

## Expected Results

### Tours API
- ✅ GET `https://api.orbittrails.com/api/tours` - Returns tour data
- ✅ GET `https://api.orbittrails.com//api/tours` - Also works (double slash)

### Contact API  
- ✅ POST `https://api.orbittrails.com/api/contact` - Accepts form submissions
- ✅ POST `https://api.orbittrails.com//api/contact` - Also works (double slash)

### Custom Tour API
- ✅ POST `https://api.orbittrails.com/api/customize-tour` - Accepts custom tour requests
- ✅ POST `https://api.orbittrails.com//api/customize-tour` - Also works (double slash)

## Test From Frontend
After restarting the server, your frontend should:
1. Successfully load tours on the tours page
2. Successfully submit contact forms
3. Successfully submit custom tour requests

## Logs to Check
```bash
pm2 logs orbit-trails-api
```

Should show:
- `GET //api/tours - Origin: https://www.orbittrails.com`
- `POST //api/contact - Origin: https://www.orbittrails.com`
- `POST //api/customize-tour - Origin: https://www.orbittrails.com`

## 🎯 This Should Fix:
- ❌ Tours page showing "Orbit Trails API Server" message
- ❌ Contact form returning 404 errors
- ❌ CORS policy errors

Deploy this fix and test immediately! 🚀
