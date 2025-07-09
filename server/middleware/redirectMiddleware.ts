// Redirect middleware to handle old .html URLs to new clean URLs
import { Request, Response, NextFunction } from 'express';

// Mapping of old .html URLs to new clean URLs
const redirectMap: Record<string, string> = {
  // Main pages
  '/index.html': '/',
  '/home.html': '/',
  '/about.html': '/about',
  '/contact-us.html': '/contact',
  '/packages.html': '/tours',
  '/Blogs/blogs.html': '/blog',
  '/privacy-policy.html': '/privacy',
  '/terms-condition.html': '/terms',

  // Tour pages
  '/tour-details.html': '/tours',
  '/itinerary-golden-triangle-6day.html': 'tour-details/6-day-golden-triangle-tour-',
  '/itinerary-land-of-kings.html': 'tour-details/land-of-kings',
  
  // Blog posts - add your old blog post URLs here
};

export const redirectMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const fullPath = req.path;
  
  // Check if the requested path ends with .html
  if (fullPath.endsWith('.html')) {
    const newPath = redirectMap[fullPath];
    
    if (newPath) {
      // 301 permanent redirect to new clean URL
      return res.redirect(301, newPath);
    } else {
      // If no specific mapping found, try removing .html extension
      const cleanPath = fullPath.replace('.html', '');
      return res.redirect(301, cleanPath);
    }
  }
  
  // Handle old query parameter style URLs
  if (req.query.page) {
    const page = req.query.page as string;
    let redirectPath = '/';
    
    switch (page) {
      case 'about':
        redirectPath = '/about';
        break;
      case 'contact':
        redirectPath = '/contact';
        break;
      case 'tours':
        redirectPath = '/tours';
        break;
      case 'blog':
        redirectPath = '/blog';
        break;
      default:
        redirectPath = '/';
    }
    
    return res.redirect(301, redirectPath);
  }
  
  next();
};

// Specific redirects for common old URLs
export const specificRedirects = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path.toLowerCase();
  
  // Handle common variations
  if (path === '/home' || path === '/index') {
    return res.redirect(301, '/');
  }
  
  // Handle old tour detail patterns
  if (path.startsWith('/tour/') || path.startsWith('/tours/')) {
    const slug = path.split('/').pop();
    if (slug && slug !== 'tours') {
      return res.redirect(301, `/tour-details/${slug}`);
    }
  }
  
  // Handle old blog patterns
  if (path.startsWith('/blogs/') || path.startsWith('/articles/')) {
    const slug = path.split('/').pop();
    if (slug) {
      return res.redirect(301, `/blog/${slug}`);
    }
  }
  
  next();
};
