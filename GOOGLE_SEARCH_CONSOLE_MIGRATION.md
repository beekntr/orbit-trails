# Google Search Console - URL Migration Instructions

## Steps to Handle .html to Clean URL Migration

### 1. Submit Change of Address (if changing domains)
If you're migrating from a different domain, use Google Search Console's "Change of Address" tool.

### 2. Submit New Sitemap
- Go to Google Search Console
- Navigate to Sitemaps section
- Submit: https://www.orbittrails.com/sitemap.xml
- Remove old sitemaps if they exist

### 3. Request Re-indexing of Key Pages
Use the URL Inspection tool to request re-indexing of:
- https://www.orbittrails.com/
- https://www.orbittrails.com/tours
- https://www.orbittrails.com/blog
- https://www.orbittrails.com/about
- https://www.orbittrails.com/contact
- https://www.orbittrails.com/blog/complete-golden-triangle-travel-guide-2025

### 4. Monitor Coverage Reports
- Check "Coverage" section in Google Search Console
- Look for 404 errors from old .html URLs
- Verify that redirects are working (should show as "Redirect" status)

### 5. Update Internal Links
Make sure all internal links point to new clean URLs:
- Update navigation menus
- Update footer links
- Update blog post internal links
- Update social media profiles

### 6. Expected Timeline
- Redirects: Immediate
- Google re-crawling: 1-4 weeks
- Search results update: 2-8 weeks
- Full migration: 1-3 months

### 7. Monitoring Commands
Check redirects are working:
```bash
curl -I https://www.orbittrails.com/index.html
curl -I https://www.orbittrails.com/about.html
curl -I https://www.orbittrails.com/blog.html
```

Should return 301 status codes.

### 8. Common Old URLs to New URLs Mapping
```
OLD URL → NEW URL
/index.html → /
/about.html → /about
/contact.html → /contact
/tours.html → /tours
/blog.html → /blog
/blog/golden-triangle-guide.html → /blog/complete-golden-triangle-travel-guide-2025
```

### 9. Additional SEO Actions
- Update Google My Business profile URLs
- Update social media profile links
- Update email signature links
- Update any external backlinks (if possible)
- Update business directory listings

### 10. Tracking Progress
Use these Google Search Console filters:
- Coverage > Valid: Shows successfully indexed pages
- Coverage > Error: Shows 404s and other issues
- Performance: Monitor click-through rates and impressions
