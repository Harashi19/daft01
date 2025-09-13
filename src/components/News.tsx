import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const News = () => {
  const newsItems = [
    {
      date: '2024-03-15',
      title: 'New Advanced CCTV Systems Deployed',
      excerpt: 'We have upgraded our surveillance capabilities with state-of-the-art HD camera systems and AI-powered monitoring technology.',
      category: 'Technology',
      readTime: '3 min read'
    },
    {
      date: '2024-03-10',
      title: 'Expanded Coverage to Glendale Area',
      excerpt: 'Shield Security Services now provides comprehensive security solutions in the Glendale area with our new branch office.',
      category: 'Expansion',
      readTime: '2 min read'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="news" className="section-padding bg-shield-grey">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest News & Updates
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay informed about our latest developments and security industry insights.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((item, index) => (
            <article key={index} className="card-security group">
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <Calendar className="h-4 w-4 mr-2" />
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <span className="mx-2">•</span>
                <span>{item.readTime}</span>
              </div>
              
              <div className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-4">
                {item.category}
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {item.excerpt}
              </p>
              
              <Button 
                variant="ghost" 
                className="p-0 h-auto font-medium text-primary hover:text-primary-hover group"
              >
                Read More 
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-background rounded-lg p-8 mt-12 text-center border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Stay Updated
          </h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for security tips and company updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="btn-primary">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;