import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqItems = [
    {
      question: 'What types of security services do you provide?',
      answer: 'We provide comprehensive security services including manned guarding for retail, schools, residential, industrial, farms, and mines. We also offer advanced surveillance systems, private investigations, and escort services. Each service is tailored to meet your specific security needs.'
    },
    {
      question: 'Do you offer free security assessments?',
      answer: 'Yes, we provide a free security assessment before signing any contract. This comprehensive survey evaluates your premises, lighting, dispatch systems, and access control procedures. Based on the risk level assessment, we provide a detailed report with our recommendations.'
    },
    {
      question: 'What areas do you serve?',
      answer: 'We serve the Harare area with our main office at 40 Clyde Rd, Rhodesville Highlands, and we have expanded coverage to include Glendale with our branch office at 13 GMB Rd, Afro Village Glendale. We provide services across both residential and commercial sectors in these areas.'
    },
    {
      question: 'How quickly can you respond to security incidents?',
      answer: 'Our average emergency response time is under 5 minutes. We maintain 24/7 monitoring and have strategically positioned response teams to ensure rapid deployment when needed. Our dispatch systems are designed for maximum efficiency and quick response times.'
    },
    {
      question: 'Are your security guards licensed and trained?',
      answer: 'Yes, all our security personnel are fully licensed, professionally trained, and regularly updated on the latest security protocols. We maintain strict hiring standards and provide ongoing training to ensure our guards deliver the highest level of professional security services.'
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="section-padding bg-shield-grey">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our security services.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-background rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-shield-grey/50 transition-colors"
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">
                  {item.question}
                </h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div 
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4 animate-in slide-in-from-top-2 duration-200"
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 bg-background rounded-lg p-8 border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our security experts are here to help. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+263783492669"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors"
            >
              Call Us Now
            </a>
            <a
              href="mailto:shieldsecc123@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;