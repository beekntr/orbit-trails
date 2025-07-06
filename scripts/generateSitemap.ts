import fs from 'fs';
import path from 'path';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const generateSitemap = () => {
  const baseUrl = 'https://www.orbittrails.com';
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/tours`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];

  // Dynamic tour pages (these would typically come from your database)
  const tourPages: SitemapUrl[] = [
    {
      loc: `${baseUrl}/tour-details/golden-triangle-classic`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/tour-details/rajasthan-royal-heritage`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/tour-details/incredible-india-journey`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/tour-details/kerala-backwaters-cultural`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/tour-details/himalayan-spiritual-journey`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/tour-details/south-india-temple-trail`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    }
  ];

  // Blog posts (updated with real blog slugs and dates)
  const blogPages: SitemapUrl[] = [
    {
      loc: `${baseUrl}/blog/complete-golden-triangle-travel-guide-2025`,
      lastmod: '2025-01-15',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog/best-time-visit-rajasthan-season-weather-guide`,
      lastmod: '2025-01-10',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog/rajasthan-royal-cuisine-food-guide-must-try-dishes`,
      lastmod: '2025-01-05',
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/blog/india-travel-safety-tips-first-time-visitors-guide`,
      lastmod: '2025-01-01',
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/blog/india-festivals-cultural-experiences-celebration-guide`,
      lastmod: '2024-12-28',
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/blog/taj-mahal-photography-guide-best-shots-tips`,
      lastmod: '2024-12-25',
      changefreq: 'monthly',
      priority: 0.7
    }
  ];

  const allPages = [...staticPages, ...tourPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  
  console.log('✅ Sitemap generated successfully at /public/sitemap.xml');
  console.log(`📊 Total URLs: ${allPages.length}`);
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export default generateSitemap;
