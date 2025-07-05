# Content Update Guide 📝

This guide shows you exactly how to update your website with real content while maintaining all the SEO optimizations.

## 🔄 Updating Blog Card Titles

### Current Blog Cards (ready to customize):
Edit `client/pages/Blog.tsx` and update these card titles:

**Card 1 (Line ~105):** 
```tsx
<CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
  Coming Soon: Expert Travel Article  ← Change this title
</CardTitle>
```

**Card 2 (Line ~135):** 
```tsx
<CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
  Coming Soon: Heritage & Culture Guide  ← Change this title
</CardTitle>
```

**Card 3 (Line ~165):** 
```tsx
<CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
  Coming Soon: Travel Planning Tips  ← Change this title
</CardTitle>
```

**Card 4 (Line ~195):** 
```tsx
<CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
  Coming Soon: Festivals & Experiences  ← Change this title
</CardTitle>
```

**Card 5 (Line ~225):** 
```tsx
<CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
  Coming Soon: Culinary Journey Guide  ← Change this title
</CardTitle>
```

**Card 6 (Line ~255):** 
```tsx
<CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
  Coming Soon: Travel Safety Guide  ← Change this title
</CardTitle>
```

### Example Updates:
Change from:
```tsx
Coming Soon: Expert Travel Article
```
To:
```tsx
10 Must-Visit Hidden Gems in Rajasthan
```

Or:
```tsx
Complete Guide to Golden Triangle First-Timer Tips
```

You can also update the descriptions below each title for better preview text.

## 🏛️ Adding Real Tour Data

### Database Method (Recommended):
1. Use your admin panel to add tours to MongoDB
2. Tours will automatically appear on the website
3. SEO will automatically generate for each tour

### Tour Data Structure:
Your tours should include:
```typescript
{
  name: "Golden Triangle Classic Tour",
  slug: "golden-triangle-classic",
  description: "Experience Delhi, Agra, and Jaipur in 6 magical days",
  category: "Golden Triangle",
  duration: "6 Days / 5 Nights",
  highlights: ["Taj Mahal at Sunrise", "Red Fort Delhi", "Amber Palace"],
  destinations: ["Delhi", "Agra", "Jaipur"],
  // ... other fields
}
```

## 🎯 SEO Benefits of Real Content

When you add real content, the SEO system will automatically:

### For Blog Articles:
- Generate proper meta titles and descriptions
- Create structured data for each article
- Optimize for your target keywords
- Generate social media preview cards

### For Tours:
- Create SEO-optimized tour detail pages
- Generate structured data for Google Travel
- Optimize for local SEO keywords
- Create proper canonical URLs

## 📊 Next Steps After Adding Content

1. **Test SEO**: Run the SEO audit script after adding content:
   ```bash
   node scripts/seoAudit.js
   ```

2. **Submit Sitemap**: Your sitemap will auto-update with new content
   - Submit to Google Search Console
   - Submit to Bing Webmaster Tools

3. **Monitor Performance**: 
   - Set up Google Analytics 4
   - Monitor Core Web Vitals
   - Track keyword rankings

## 🚀 Priority Content to Add

### High-Impact Blog Topics:
1. "Complete Golden Triangle Travel Guide 2024"
2. "Best Time to Visit Rajasthan - Season Guide"
3. "10 Must-Try Dishes in Delhi, Agra & Jaipur"
4. "Cultural Etiquette Tips for India Travel"
5. "Photography Guide: Capturing India's Beauty"

### High-Impact Tours:
1. Classic Golden Triangle (3-7 days)
2. Rajasthan Royal Experience
3. Delhi City Tour
4. Agra Day Trip
5. Jaipur Heritage Tour

## 💡 Pro Tips

- **Blog SEO**: Use your target keywords naturally in titles and content
- **Tour SEO**: Include location keywords in tour names and descriptions
- **Image Optimization**: Use descriptive alt text for all images
- **Internal Linking**: Link between related blog posts and tours

## 🆘 Need Help?

The SEO system is fully automated, but if you need to customize:
- Check `client/hooks/useSEO.ts` for SEO configuration
- Refer to `SEO_QUICK_REFERENCE.md` for optimization tips
- Run the audit script to verify everything is working

---

**Remember**: The website is already SEO-optimized! Adding real content will only make it stronger. 🎯
