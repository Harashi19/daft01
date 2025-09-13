import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import News from '@/components/News';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Services />
        <News />
        <FAQ />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
