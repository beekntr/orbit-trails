import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  User,
  Tag,
  ExternalLink,
  BookOpen,
  List
} from "lucide-react";
import { getBlogBySlug, getRelatedBlogs } from "@/data/blogData";
import { useSEO } from "@/hooks/useSEO";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useState, useEffect } from 'react';
import '../styles/blog.css';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tableOfContents, setTableOfContents] = useState<Array<{id: string, title: string, level: number}>>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const blog = slug ? getBlogBySlug(slug) : null;
  const relatedBlogs = slug ? getRelatedBlogs(slug, 3) : [];

  // Generate table of contents from blog content
  useEffect(() => {
    if (blog?.content) {
      const headings = blog.content.match(/^#{1,6}\s.+$/gm) || [];
      const toc = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 1;
        const title = heading.replace(/^#+\s/, '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { id: `${id}-${index}`, title, level };
      });
      setTableOfContents(toc);
    }
  }, [blog]);

  // Reading progress tracker
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // SEO optimization for individual blog posts
  useSEO({
    title: blog?.metaTitle || 'Blog Post - Orbit Trails',
    description: blog?.metaDescription || 'Discover expert travel insights and guides for exploring India with Orbit Trails.',
    keywords: blog?.keywords?.join(', ') || 'India travel, travel blog, travel guides',
    canonicalUrl: `https://www.orbittrails.com/blog/${slug}`,
    ogImage: blog?.featuredImage || '/og-image.jpg',
    ogType: 'article',
    structuredData: blog ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.excerpt,
      "image": blog.featuredImage,
      "author": {
        "@type": "Person",
        "name": blog.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Orbit Trails",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.orbittrails.com/logo.ico"
        }
      },
      "datePublished": blog.publishDate,
      "dateModified": blog.publishDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.orbittrails.com/blog/${slug}`
      },
      "keywords": blog.keywords.join(", "),
      "articleSection": blog.category,
      "wordCount": blog.content.split(' ').length
    } : undefined
  });

  const handleShare = () => {
    if (!blog) return;
    
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 📋",
        description: "Blog link has been copied to your clipboard.",
        duration: 3000,
      });
    }
  };

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/blog')} className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div 
        className="reading-progress fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-accent z-50 transition-all duration-300"
        style={{ 
          width: `${readingProgress}%`,
          boxShadow: readingProgress > 0 ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none'
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/blog')}
            className="hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
              {blog.category}
            </Badge>
            {blog.featured && (
              <Badge variant="outline" className="border-accent text-accent bg-accent/5 shadow-sm">
                ⭐ Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            {blog.excerpt}
          </p>
          
          {/* Article Meta */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-accent/10 rounded-full">
                  <Calendar className="w-4 h-4 text-accent" />
                </div>
                <span>{new Date(blog.publishDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <span>{blog.readTime}</span>
              </div>
              <Button variant="outline" onClick={handleShare} size="sm" className="hover:shadow-md transition-shadow">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={blog.featuredImage}
              alt={blog.altText}
              className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sidebar */}
            {tableOfContents.length > 0 && (
              <aside className="lg:w-80 lg:flex-shrink-0">
                <div className="sticky top-8">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <List className="w-5 h-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg text-blue-900">Table of Contents</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <nav className="space-y-2">
                        {tableOfContents.map((item, index) => (
                          <a
                            key={index}
                            href={`#${item.id}`}
                            className={`block py-2 px-3 rounded-lg text-sm transition-all hover:bg-blue-100 hover:text-blue-700 ${
                              item.level === 1 ? 'font-semibold text-blue-800' : 
                              item.level === 2 ? 'font-medium text-blue-700 ml-3' : 
                              'text-blue-600 ml-6'
                            }`}
                          >
                            {item.title}
                          </a>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            )}

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="prose prose-lg prose-blue max-w-none blog-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({children, ...props}) => (
                        <h1 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} 
                            className="text-4xl font-bold text-gray-900 mb-6 pt-8 border-b-2 border-primary/20 pb-4">
                          {children}
                        </h1>
                      ),
                      h2: ({children, ...props}) => (
                        <h2 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} 
                            className="text-3xl font-bold text-gray-800 mb-5 pt-8 flex items-center">
                          <span className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full mr-4"></span>
                          {children}
                        </h2>
                      ),
                      h3: ({children, ...props}) => (
                        <h3 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} 
                            className="text-2xl font-semibold text-gray-800 mb-4 pt-6">
                          {children}
                        </h3>
                      ),
                      p: ({children, ...props}) => (
                        <p {...props} className="text-gray-700 leading-relaxed mb-6 text-lg">
                          {children}
                        </p>
                      ),
                      ul: ({children, ...props}) => (
                        <ul {...props} className="space-y-2 mb-6 ml-6">
                          {children}
                        </ul>
                      ),
                      li: ({children, ...props}) => (
                        <li {...props} className="text-gray-700 leading-relaxed flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>{children}</span>
                        </li>
                      ),
                      blockquote: ({children, ...props}) => (
                        <blockquote {...props} className="border-l-4 border-accent bg-accent/5 p-6 rounded-r-lg my-8 italic">
                          {children}
                        </blockquote>
                      ),
                      strong: ({children, ...props}) => (
                        <strong {...props} className="font-semibold text-primary">
                          {children}
                        </strong>
                      ),
                      a: ({children, href, ...props}) => (
                        <a {...props} href={href} className="text-primary hover:text-primary/80 underline font-medium transition-colors">
                          {children}
                        </a>
                      )
                    }}
                  >
                    {blog.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="max-w-4xl mx-auto mt-12 mb-8">
          <Card className="bg-gradient-to-r from-gray-50 to-white shadow-lg border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                <div className="p-2 bg-primary/10 rounded-full mr-3">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-3">
                {blog.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm border-primary/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Separator className="my-8" />

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-primary via-primary/90 to-accent rounded-2xl p-8 md:p-12 mb-12 text-center text-white shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience India? 🇮🇳
              </h3>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Let our expert team create a personalized tour package just for you. From the Golden Triangle to hidden gems across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/tours')} 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 shadow-lg font-semibold"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Tour Packages
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="border-white text-white hover:bg-white hover:text-primary shadow-lg font-semibold"
                >
                  Plan Custom Tour
                </Button>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <section className="mt-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Continue Reading</h2>
                <p className="text-gray-600 text-lg">Discover more insights about traveling in India</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Card 
                    key={relatedBlog.id} 
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-gray-200 bg-white"
                    onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.altText}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm shadow-lg">
                        {relatedBlog.category}
                      </Badge>
                    </div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                        {relatedBlog.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {relatedBlog.excerpt}
                      </p>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{relatedBlog.readTime}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
    </>
  );
}
