import { Shield, Users, Clock } from 'lucide-react';
import securityTeam from '@/assets/security-team.jpg';

const About = () => {
  const stats = [
    {
      icon: Shield,
      number: '15+',
      label: 'Years in Service',
      description: 'Protecting businesses and communities'
    },
    {
      icon: Users,
      number: '500+',
      label: 'Clients Served',
      description: 'Across residential and commercial sectors'
    },
    {
      icon: Clock,
      number: '<5min',
      label: 'Response Time',
      description: 'Average emergency response'
    }
  ];

  return (
    <section id="about" className="section-padding gradient-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 animate-slide-up">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-accent rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
              <img
                src={securityTeam}
                alt="Professional security team providing comprehensive security solutions"
                className="relative w-full h-[450px] object-cover rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-shield-navy/30 via-transparent to-transparent rounded-3xl"></div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-2xl rotate-12 shadow-xl opacity-90 animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-accent rounded-2xl -rotate-12 shadow-xl opacity-80 animate-float" style={{animationDelay: '1s'}}></div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 text-white animate-fade-in">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                About <span className="text-gradient">Shield Security</span> Services
              </h2>
              
              <div className="space-y-6">
                <p className="text-xl text-white/90 leading-relaxed">
                  Shield Security is a security service company committed to delivering high-level security solutions 
                  tailored to meet your needs. Our team strives to build trust and solid relations with our valued customers.
                </p>
                
                <p className="text-xl text-white/90 leading-relaxed">
                  Driven by results, we provide broad-based security services. Whether you need residential or commercial 
                  security, we provide the best cover at affordable costs. We offer a free security assessment before 
                  signing of contract, evaluating your premises, lighting, dispatch systems, and access control procedures.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group animate-scale-in" style={{animationDelay: `${index * 0.2}s`}}>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-8 w-8 text-shield-navy" />
                    </div>
                    <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                    <div className="text-lg font-bold text-accent mb-2">{stat.label}</div>
                    <div className="text-sm text-white/70">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;