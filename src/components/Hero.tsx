import { Button } from './ui/button';
import heroImage from '@/assets/hero-security-guard.jpg';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-background hero-pattern overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[700px] py-24">
          {/* Content */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight">
                <span className="text-foreground block">When </span>
                <span className="text-gradient block text-8xl md:text-9xl font-black">Security</span>
                <span className="text-foreground block"> Matters.</span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-shield-black font-bold mb-8">
                Professional Security Solutions You Can Trust
              </h2>
              
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
                Shield Security is committed to delivering high-level security solutions tailored to meet your needs. 
                Our team strives to build trust and solid relations with our valued customers. 
                Driven by results, we provide broad-based security services.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="btn-primary text-xl px-12 py-6 glow-effect"
                >
                  Get a Quote
                </Button>
                <Button 
                  onClick={() => scrollToSection('about')}
                  className="btn-dark text-xl px-12 py-6"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 animate-scale-in">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <img
                src={heroImage}
                alt="Professional security guard providing reliable security services"
                className="relative w-full h-auto rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-shield-navy/20 via-transparent to-transparent rounded-3xl"></div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full animate-glow opacity-80"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-accent rounded-full animate-glow opacity-60" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;