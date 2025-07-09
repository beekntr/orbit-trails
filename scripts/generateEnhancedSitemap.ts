// Script to generate an enhanced sitemap with redirects information
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://www.orbittrails.com';
const currentDate = new Date().toISOString().split('T')[0];

// URL structure with priorities and change frequencies
const urls = [
  // Main pages
  { loc: '/', lastmod: currentDate, changefreq: 'weekly', priority: '1.0' },
  { loc: '/tours', lastmod: currentDate, changefreq: 'daily', priority: '0.9' },
  { loc: '/about', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/contact', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog', lastmod: currentDate, changefreq: 'weekly', priority: '0.7' },
  { loc: '/privacy', lastmod: currentDate, changefreq: 'yearly', priority: '0.3' },
  { loc: '/terms', lastmod: currentDate, changefreq: 'yearly', priority: '0.3' },
  
  // Tour detail pages
  { loc: '/tour-details/golden-triangle-classic', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/tour-details/rajasthan-royal-heritage', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/tour-details/incredible-india-journey', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/tour-details/kerala-backwaters-bliss', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/tour-details/himalayan-adventure', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/tour-details/goa-beach-retreat', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  
  // Blog posts
  { loc: '/blog/complete-golden-triangle-travel-guide-2025', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/best-time-visit-rajasthan-complete-guide', lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/hidden-gems-delhi-local-guide', lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/jaipur-food-guide-authentic-rajasthani-cuisine', lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/cultural-etiquette-guide-india-travelers', lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
  { loc: '/blog/photography-tips-india-travel-guide', lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
  { loc: '/blog/solo-female-travel-india-safety-guide', lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
  { loc: '/blog/sustainable-tourism-rajasthan-responsible-travel', lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
];

// Generate sitemap.xml
function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  urls.forEach(url => {
    sitemap += `
  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Generate robots.txt with sitemap reference
function generateRobotsTxt() {
  return `# Robots.txt for Orbit Trails
User-agent: *
Allow: /

# Important pages for crawling
Allow: /tours
Allow: /blog
Allow: /about
Allow: /contact

# Block admin and API endpoints
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /dist/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (optional - remove if not needed)
# Crawl-delay: 1`;
}

// Write files
const publicDir = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate and write sitemap
const sitemapContent = generateSitemap();
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);

// Generate and write robots.txt
const robotsContent = generateRobotsTxt();
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);

console.log('✅ Enhanced sitemap.xml generated');
console.log('✅ Enhanced robots.txt generated');
console.log(`📍 Total URLs in sitemap: ${urls.length}`);
console.log('🔄 Make sure to submit the new sitemap to Google Search Console');

export { urls, generateSitemap, generateRobotsTxt };
