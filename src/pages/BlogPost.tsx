
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ArrowLeft, Share2, Calendar, Clock } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  
  // This would typically come from a CMS or API
  const blogContent = getBlogContent(id || '');
  
  if (!blogContent) {
    return (
      <MainLayout>
        <div className="container-custom py-20">
          <h1>Blog post not found</h1>
          <Link to="/blog" className="text-gold hover:underline">Return to blog</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-blue-dark py-16 px-6">
        <div className="container-custom max-w-4xl">
          <ScrollReveal>
            <Link to="/blog" className="inline-flex items-center text-gold hover:underline mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{blogContent.title}</h1>
            <div className="flex flex-wrap items-center text-white/80 mb-8">
              <div className="flex items-center mr-6 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{blogContent.date}</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2" />
                <span>{blogContent.readTime}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Blog Content */}
      <div className="py-16 px-6">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blogContent.content }} />
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 mr-4">Share this article:</span>
              <button className="p-2 rounded-full bg-blue-dark text-white hover:bg-gold transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-blue-dark/5 rounded-lg border border-blue-dark/10">
            <h3 className="text-2xl font-bold text-blue-dark mb-4">Ready to improve your online presence?</h3>
            <p className="text-gray-600 mb-6">
              Let our team of experts help you implement these strategies and more. Schedule a free consultation today.
            </p>
            <Button 
              className="bg-gold hover:bg-gold-light text-white px-8 py-6 h-auto rounded-md shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Schedule a Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper function to get blog content
function getBlogContent(id: string) {
  const blogs = {
    'website-must-haves': {
      title: '7 Website Must-Haves for Remodeling Companies',
      date: 'April 5, 2025',
      readTime: '8 min read',
      content: `
        <h2>💡 Why Your Website Matters More Than Ever</h2>
        <p>Your remodeling company's website isn't just a digital business card—it's the foundation of your online marketing. Whether you specialize in kitchen remodels, bathroom renovations, or full home makeovers, your website should:</p>
        <ul>
          <li>Attract local traffic</li>
          <li>Showcase your work</li>
          <li>Build trust with homeowners</li>
          <li>Convert visitors into qualified leads</li>
        </ul>
        <p>Below are 7 must-have features that every remodeling website needs to help you stand out and grow your business.</p>
        
        <h2>1. Professional, Mobile-Responsive Design</h2>
        <p>First impressions count. A modern, user-friendly design shows potential clients that you care about quality—from your craftsmanship to your communication.</p>
        <ul>
          <li>✔ Mobile-friendly design</li>
          <li>✔ Clean navigation menus</li>
          <li>✔ High-quality visuals of completed projects</li>
          <li>✔ Fast loading times</li>
        </ul>
        <blockquote>
          <p><strong>Pro Tip:</strong> Your website should reflect the same care and detail you bring to every remodeling job.</p>
        </blockquote>
        
        <h2>2. Local SEO Optimization</h2>
        <p>Ranking high in local search results means more eyes on your business. If someone Googles "bathroom remodeler near me", your site should be front and center.</p>
        <p><strong>Here's how to boost your local SEO:</strong></p>
        <ul>
          <li>Use keywords like "kitchen remodeling in Fort Lauderdale" or "home renovations Miami"</li>
          <li>Add your business name, address, and phone number (NAP) across every page</li>
          <li>Create city-specific service pages</li>
          <li>Embed your Google Business Profile</li>
          <li>Use local schema markup</li>
        </ul>
        <blockquote>
          <p>🔍 Want to dominate search rankings? Start with smart, localized SEO.</p>
        </blockquote>
        
        <h2>3. Clear Calls-to-Action (CTAs)</h2>
        <p>If visitors don't know what to do next, they'll leave. That's why strong CTAs are a must on every page.</p>
        <p><strong>Effective CTAs include:</strong></p>
        <ul>
          <li>"Request a Free Quote"</li>
          <li>"Book a Design Consultation"</li>
          <li>"Call Now to Get Started"</li>
          <li>"View Our Work"</li>
        </ul>
        <p>Make sure CTAs are <strong>visible, clickable, and persuasive</strong>—especially on mobile devices.</p>
        
        <h2>4. Photo & Video Portfolio</h2>
        <p>Homeowners want proof of quality before they hire you. A well-organized portfolio turns browsers into believers.</p>
        <p><strong>Your remodeling portfolio should include:</strong></p>
        <ul>
          <li>Before-and-after photos</li>
          <li>Project types (kitchens, baths, basements)</li>
          <li>Descriptions of scope and materials</li>
          <li>Client reviews or testimonials</li>
          <li>Optional walkthrough videos or time-lapse clips</li>
        </ul>
        <blockquote>
          <p>🎥 Bonus: Optimize image titles and alt text with keywords for better SEO!</p>
        </blockquote>
        
        <h2>5. Lead Capture Forms & Chat Automation</h2>
        <p>Don't let potential leads slip through the cracks. Make it super easy for visitors to get in touch—without needing to call.</p>
        <p><strong>Key lead capture tools:</strong></p>
        <ul>
          <li>Short contact forms (3–5 fields max)</li>
          <li>Click-to-call buttons</li>
          <li>Hosted calendar for online booking</li>
          <li>AI chatbot to qualify leads (budget, timeline, project type)</li>
          <li>Missed call text-back system</li>
        </ul>
        <blockquote>
          <p>🤖 A smart website works even when you're not picking up the phone.</p>
        </blockquote>
        
        <h2>6. Trust-Building Elements</h2>
        <p>Your site should instill confidence. Make visitors feel safe and secure hiring you.</p>
        <p><strong>Build trust by showcasing:</strong></p>
        <ul>
          <li>Verified client testimonials</li>
          <li>Certifications, licenses, and awards</li>
          <li>Local press features or Houzz/Yelp badges</li>
          <li>"Meet the Team" section with bios</li>
          <li>Secure SSL (https://) and privacy notices</li>
        </ul>
        <blockquote>
          <p>🌟 Trust = higher conversion rates. Don't skip this step.</p>
        </blockquote>
        
        <h2>7. Conversion-Focused Content & SEO-Driven Pages</h2>
        <p>Content that speaks directly to your audience's needs helps boost both traffic and conversions.</p>
        <p><strong>Content ideas for remodeling websites:</strong></p>
        <ul>
          <li>Dedicated service pages (e.g., <em>Kitchen Remodeling</em>, <em>Bathroom Renovations</em>)</li>
          <li>Location-based pages (e.g., <em>Remodeling in Boca Raton</em>)</li>
          <li>Project timelines and budgeting guides</li>
          <li>Blog posts answering FAQs like "How much does a kitchen remodel cost?"</li>
          <li>Lead magnets (e.g., downloadable <em>Home Remodeling Budget Checklist</em>)</li>
          <li>Automated email follow-ups</li>
        </ul>
        <blockquote>
          <p>✍️ The more helpful your content, the more leads you'll attract.</p>
        </blockquote>
        
        <h2>💼 Bonus Must-Have: Marketing Automation Built-In</h2>
        <p>The best remodeling websites <strong>don't just sit there - they convert</strong>.</p>
        <p>Make sure your site supports:</p>
        <ul>
          <li>Funnels and landing pages for offers</li>
          <li>Call tracking & analytics</li>
          <li>AI chat + voice integration</li>
          <li>Review generation tools</li>
          <li>Appointment reminders via SMS/email</li>
          <li>Reactivation campaigns for old leads</li>
          <li>Payment and invoicing tools</li>
        </ul>
        <blockquote>
          <p>🔧 Think of your website as your hardest-working team member.</p>
        </blockquote>
        
        <h2>🚀 Ready to Build a Remodeling Website That Works?</h2>
        <p>If your current site is missing any of these features—or you're ready to upgrade - we can help. We specialize in building <strong>conversion-optimized websites for remodeling companies</strong> with everything you need:</p>
        <ul>
          <li>✅ Beautiful, mobile-friendly design</li>
          <li>✅ SEO + Local Optimization</li>
          <li>✅ AI Chat & Lead Nurturing</li>
          <li>✅ Hosting, Funnels, Call Tracking, and More</li>
        </ul>
        
        <h3>📞 Let's Turn Your Website Into a Lead-Generating Machine</h3>
        <p>
          👉 <strong>Schedule your free consultation</strong><br>
          👉 <strong>Request a demo of our remodeling website system</strong><br>
          👉 <strong>Start generating more qualified leads - automatically</strong>
        </p>
      `
    },
    'seo-strategies': {
      title: 'SEO Strategies for Home Service Businesses',
      date: 'March 28, 2025',
      readTime: '6 min read',
      content: `
        <h2>The Importance of SEO for Home Service Businesses</h2>
        <p>For home service businesses, local visibility is everything. When homeowners need a service, they typically turn to Google first. This article explores proven SEO strategies specifically for remodelers, contractors, and other home service professionals.</p>
        
        <h2>Local SEO: Your Most Powerful Tool</h2>
        <p>Local search optimization ensures your business appears when people in your service area are looking for the services you provide.</p>
        <p>Key local SEO tactics include:</p>
        <ul>
          <li>Optimizing your Google Business Profile</li>
          <li>Building local citations</li>
          <li>Creating location-specific landing pages</li>
          <li>Getting local backlinks</li>
        </ul>
        
        <h2>Content Marketing for Home Service Businesses</h2>
        <p>Creating helpful, relevant content establishes your expertise and helps you rank for valuable search terms.</p>
        
        <h2>Technical SEO Factors</h2>
        <p>The technical foundation of your website impacts both user experience and search rankings.</p>
        
        <h2>Ready to Improve Your SEO?</h2>
        <p>Implementing these strategies can significantly improve your online visibility and drive more qualified leads to your business.</p>
      `
    },
    'ai-revolution': {
      title: 'How AI is Revolutionizing Customer Service',
      date: 'March 15, 2025',
      readTime: '7 min read',
      content: `
        <h2>The AI Customer Service Revolution</h2>
        <p>Artificial intelligence is transforming how businesses interact with customers, creating more efficient and personalized experiences.</p>
        
        <h2>Chatbots and Virtual Assistants</h2>
        <p>Modern AI chatbots can handle complex customer inquiries, qualify leads, and schedule appointments - all without human intervention.</p>
        
        <h2>Personalization at Scale</h2>
        <p>AI enables businesses to deliver personalized experiences to every customer without increasing staffing costs.</p>
        
        <h2>The Future of AI in Customer Service</h2>
        <p>As AI technology continues to evolve, we can expect even more sophisticated customer service applications.</p>
        
        <h2>How to Implement AI in Your Business</h2>
        <p>Starting with AI doesn't have to be complicated. Here's how you can begin implementing AI solutions in your customer service strategy.</p>
      `
    }
  };
  
  return blogs[id as keyof typeof blogs];
}

export default BlogPost;
