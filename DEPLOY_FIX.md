# 🚀 Quick Deploy Guide - Review System Fix

## Problem
Your production API at `api.orbittrails.com` is returning 404 errors for review endpoints because the review routes aren't deployed yet.

## Solution
The review system has been built and is ready for deployment. Here's what you need to do:

### Files to Upload to Production Server:
1. `dist/server/index.mjs` - Main server file with review routes
2. `dist/server/index.mjs.map` - Source map for debugging  
3. `server/production.mjs` - Production startup script
4. `package.json` - Dependencies list
5. `.env` - Environment variables (already on server)

### Production Server Commands:
```bash
# 1. Install any new dependencies
npm install --production

# 2. Optional: Add sample review data
npx tsx server/seedReviews.ts

# 3. Restart your server (use your preferred method)
pm2 restart orbit-trails
# OR
node server/production.mjs
```

### Test After Deployment:
- ✅ https://api.orbittrails.com/health
- ✅ https://api.orbittrails.com/api/reviews/random?count=3
- ✅ POST https://api.orbittrails.com/api/reviews (submit a review)

### Frontend Will Work After API Deployment:
- ✅ https://www.orbittrails.com/review-us
- ✅ https://www.orbittrails.com/customer-reviews  
- ✅ https://www.orbittrails.com/adm (admin panel)
- ✅ Homepage testimonials will show dynamic reviews

## What's New:
✅ Review submission API  
✅ Review approval system  
✅ Admin dashboard integration  
✅ Homepage testimonials integration  
✅ Customer reviews page  

The 404 errors will disappear once you upload the new `dist/server/index.mjs` file and restart your production server!
