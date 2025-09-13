import { Shield, Car, Camera, Truck, Home, Building2, Factory, TreePine, Eye, Search } from 'lucide-react';
import { Button } from './ui/button';

const Services = () => {
  const services = [
    {
      icon: Building2,
      title: 'Retail Guards',
      description: 'Professional security personnel for retail establishments, ensuring customer and staff safety while preventing theft and maintaining order.',
      features: ['Loss prevention', 'Customer assistance', 'Emergency response']
    },
    {
      icon: Shield,
      title: 'School Guards',
      description: 'Specialized security for educational institutions, creating safe learning environments for students and staff.',
      features: ['Campus security', 'Access control', 'Emergency protocols']
    },
    {
      icon: Home,
      title: 'Residential Guards',
      description: 'Comprehensive residential security services for homes, gated communities, and private properties.',
      features: ['Perimeter security', '24/7 monitoring', 'Visitor management']
    },
    {
      icon: Factory,
      title: 'Industrial Guards',
      description: 'Heavy-duty security solutions for industrial facilities, protecting assets and ensuring operational continuity.',
      features: ['Asset protection', 'Safety compliance', 'Access monitoring']
    },
    {
      icon: TreePine,
      title: 'Farm Guards',
      description: 'Rural and agricultural security services protecting livestock, equipment, and property in remote locations.',
      features: ['Livestock protection', 'Equipment security', 'Perimeter patrol']
    },
    {
      icon: Car,
      title: 'Mine Guards',
      description: 'Specialized security for mining operations, ensuring site safety and protecting valuable resources.',
      features: ['Site security', 'Equipment protection', 'Safety protocols']
    },
    {
      icon: Camera,
      title: 'Advanced Surveillance',
      description: 'State-of-the-art CCTV systems and monitoring solutions for comprehensive security coverage.',
      features: ['24/7 monitoring', 'HD cameras', 'Remote access']
    },
    {
      icon: Search,
      title: 'Private Investigations',
      description: 'Professional investigation services for corporate and personal matters requiring discretion and expertise.',
      features: ['Background checks', 'Fraud investigation', 'Surveillance']
    },
    {
      icon: Truck,
      title: 'Escort Services',
      description: 'Secure transportation and escort services for high-value cargo and VIP protection.',
      features: ['VIP protection', 'Cargo escort', 'Route planning']
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Security Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive security solutions tailored to protect what matters most to you. 
            From residential to industrial, we provide professional security services across all sectors.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="card-security group hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mr-4 group-hover:bg-primary-hover transition-colors">
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="outline"
                onClick={scrollToContact}
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>

        {/* Free Assessment CTA */}
        <div className="text-center bg-shield-light rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Free Security Assessment
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We offer a free security assessment before signing any contract. This survey evaluates your premises, 
            lighting, dispatch systems, and access control procedures. Based on the level of risk and potential theft, 
            we provide a detailed report for your consideration.
          </p>
          <Button onClick={scrollToContact} className="btn-primary">
            Schedule Assessment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;