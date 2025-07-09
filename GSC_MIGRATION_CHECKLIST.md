# Google Search Console Migration Checklist
## From .html URLs to Clean URLs

### ✅ **COMPLETED SETUP**
- [x] **Redirect Middleware**: Added Express.js middleware to handle 301 redirects
- [x] **Netlify Redirects**: Updated `netlify.toml` with comprehensive redirect rules
- [x] **Apache .htaccess**: Created for Apache server deployments
- [x] **Enhanced Sitemap**: Generated new sitemap.xml with all clean URLs
- [x] **Enhanced Robots.txt**: Updated robots.txt with proper sitemap reference

### 📋 **ACTION ITEMS FOR YOU**

#### **1. Deploy the Changes** 
- [ ] Deploy the updated code to your production server
- [ ] Test redirects using the provided PowerShell script: `scripts/test-redirects.ps1`

#### **2. Google Search Console Actions**
- [ ] **Submit New Sitemap**
  - Go to Google Search Console → Sitemaps
  - Add: `https://www.orbittrails.com/sitemap.xml`
  - Remove old sitemaps (if any exist)

- [ ] **Request Re-indexing of Key Pages**
  - Use URL Inspection tool for these URLs:
    - `https://www.orbittrails.com/`
    - `https://www.orbittrails.com/tours`
    - `https://www.orbittrails.com/blog`
    - `https://www.orbittrails.com/about`
    - `https://www.orbittrails.com/contact`
    - `https://www.orbittrails.com/blog/complete-golden-triangle-travel-guide-2025`

- [ ] **Monitor Coverage Reports**
  - Check "Coverage" section weekly
  - Look for 404 errors from old .html URLs
  - Verify redirects show as "Redirect" status

#### **3. Update External References**
- [ ] **Social Media Profiles**
  - Update Facebook page URL
  - Update Instagram bio link
  - Update Twitter profile
  - Update LinkedIn company page

- [ ] **Google My Business**
  - Update website URL in Google My Business profile
  - Update any service-specific URLs

- [ ] **Business Directories**
  - Update URLs in travel directories
  - Update TripAdvisor profile links
  - Update tourism board listings

- [ ] **Email & Marketing**
  - Update email signature links
  - Update marketing materials
  - Update business cards (for future printing)

#### **4. Monitoring & Tracking**
- [ ] **Set Up Monitoring** (Week 1-2)
  - Monitor redirect responses with provided test script
  - Check Google Search Console daily for issues
  - Monitor website traffic for any drops

- [ ] **Track Progress** (Week 2-8)
  - Monitor search rankings for key terms
  - Check that old .html URLs show redirect status
  - Verify new URLs are being indexed

#### **5. Expected Timeline**
- **Immediate**: Redirects start working
- **1-2 weeks**: Google begins re-crawling
- **2-4 weeks**: Search results start updating
- **4-8 weeks**: Most old URLs updated in search results
- **8-12 weeks**: Full migration complete

### 🎯 **SUCCESS METRICS**
Track these in Google Search Console:
- [ ] **Coverage > Valid**: New clean URLs indexed
- [ ] **Coverage > Redirected**: Old .html URLs properly redirected
- [ ] **Coverage > Error**: Minimal 404 errors
- [ ] **Performance**: Maintained or improved CTR

### 🔍 **Key URLs to Monitor**
**High Priority:**
- `/ (homepage)`
- `/tours`
- `/blog`
- `/blog/complete-golden-triangle-travel-guide-2025`

**Medium Priority:**
- `/about`
- `/contact`
- `/tour-details/*`
- Other blog posts

### 🚨 **Common Issues to Watch For**
- [ ] **Redirect Loops**: Make sure clean URLs don't redirect to themselves
- [ ] **404 Errors**: Monitor for broken internal links
- [ ] **Indexing Delays**: Be patient - Google can take weeks to update
- [ ] **Ranking Drops**: Temporary drops are normal during migration

### 📞 **Support**
If you encounter issues:
1. Check redirect test results
2. Verify Google Search Console coverage reports
3. Use URL Inspection tool to debug specific pages
4. Monitor server logs for 404 errors

### 🎉 **Migration Benefits**
Once complete, you'll have:
- ✅ Cleaner, more professional URLs
- ✅ Better SEO structure
- ✅ Improved user experience
- ✅ Modern web standards compliance
- ✅ Better social media sharing

---

**NEXT STEP**: Deploy your changes and start working through this checklist! 🚀
