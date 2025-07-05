import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
}

export const useSEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData
}: SEOProps) => {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Orbit Trails');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'Orbit Trails', true);
    updateMetaTag('og:locale', 'en_US', true);
    
    if (canonicalUrl) {
      updateMetaTag('og:url', canonicalUrl, true);
    }
    
    if (ogImage) {
      updateMetaTag('og:image', `https://www.orbittrails.com${ogImage}`, true);
      updateMetaTag('og:image:width', '1200', true);
      updateMetaTag('og:image:height', '630', true);
      updateMetaTag('og:image:alt', title, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:site', '@OrbitTrails');
    updateMetaTag('twitter:creator', '@OrbitTrails');
    
    if (ogImage) {
      updateMetaTag('twitter:image', `https://www.orbittrails.com${ogImage}`);
      updateMetaTag('twitter:image:alt', title);
    }

    // Canonical URL
    if (canonicalUrl) {
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalUrl);
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Remove structured data when component unmounts
      if (structuredData) {
        const script = document.querySelector('script[type="application/ld+json"]');
        if (script) {
          script.remove();
        }
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, twitterCard, structuredData]);
};

// Predefined SEO configs for different pages
export const SEOConfigs = {
  home: {
    title: 'Orbit Trails - Premium India Tours | Golden Triangle & Rajasthan Travel Packages',
    description: 'Experience India\'s golden triangle and royal Rajasthan with Orbit Trails. Luxury guided tours, custom itineraries, and authentic cultural experiences. Book your dream India vacation today!',
    keywords: 'India tours, Golden Triangle tour, Rajasthan tours, Delhi Agra Jaipur package, India travel agency, luxury India travel, custom India tours, best India tour operator',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Orbit Trails",
      "description": "Premium India travel agency specializing in Golden Triangle and Rajasthan tours",
      "url": "https://www.orbittrails.com",
      "logo": "https://www.orbittrails.com/logo.ico",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-98292-71900",
        "contactType": "Customer Service",
        "email": "info@orbittrails.com",
        "availableLanguage": ["English", "Hindi"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Rajasthan",
        "addressLocality": "Jaipur"
      },
      "sameAs": [
        "https://www.instagram.com/orbittrails",
        "https://www.facebook.com/orbittrails",
        "https://www.twitter.com/orbittrails"
      ],
      "priceRange": "$$-$$$",
      "areaServed": {
        "@type": "Country",
        "name": "India"
      }
    }
  },
  
  tours: {
    title: 'India Tour Packages | Golden Triangle, Rajasthan & Custom Tours - Orbit Trails',
    description: 'Discover our handpicked India tour packages. From Golden Triangle classics to royal Rajasthan adventures and custom itineraries. Expert guides, luxury accommodations, unforgettable experiences.',
    keywords: 'India tour packages, Golden Triangle tours, Rajasthan tour packages, Delhi Agra Jaipur tour, India travel packages, luxury India tours, group tours India, solo travel India',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": "India Tour Packages by Orbit Trails",
      "description": "Comprehensive tour packages covering India's most iconic destinations",
      "provider": {
        "@type": "TravelAgency",
        "name": "Orbit Trails",
        "url": "https://www.orbittrails.com"
      },
      "touristType": ["Cultural Tourism", "Heritage Tourism", "Luxury Tourism"],
      "itinerary": [
        {
          "@type": "TouristDestination",
          "name": "Golden Triangle",
          "description": "Delhi, Agra, and Jaipur - India's most famous tourist circuit"
        },
        {
          "@type": "TouristDestination", 
          "name": "Rajasthan",
          "description": "Land of Kings - palaces, forts, and desert experiences"
        }
      ]
    }
  },

  about: {
    title: 'About Orbit Trails | Leading India Travel Agency Since 2020',
    description: 'Learn about Orbit Trails, your trusted India travel partner. We specialize in creating authentic, luxurious experiences across India\'s Golden Triangle and royal Rajasthan.',
    keywords: 'about Orbit Trails, India travel company, travel agency Jaipur, India tour operator, luxury travel India, authentic India experiences',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "TravelAgency",
        "name": "Orbit Trails",
        "foundingDate": "2020",
        "description": "Orbit Trails is a premium travel agency specializing in curated India experiences",
        "specialty": ["Golden Triangle Tours", "Rajasthan Heritage Tours", "Custom India Itineraries"],
        "awards": ["Excellence in Customer Service", "Best Cultural Tourism Provider"]
      }
    }
  },

  contact: {
    title: 'Contact Orbit Trails | Plan Your India Tour Today | +91-98292-71900',
    description: 'Ready to explore India? Contact Orbit Trails for personalized tour planning. Call +91-98292-71900 or email info@orbittrails.com. Free consultation and custom itinerary design.',
    keywords: 'contact Orbit Trails, India tour booking, travel consultation India, plan India trip, India travel agency contact, book India tour',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        "@type": "TravelAgency",
        "name": "Orbit Trails",
        "telephone": "+91-98292-71900",
        "email": "info@orbittrails.com",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Service",
          "telephone": "+91-98292-71900",
          "email": "info@orbittrails.com",
          "hoursAvailable": "Mo,Tu,We,Th,Fr,Sa,Su 09:00-18:00"
        }
      }
    }
  }
};
