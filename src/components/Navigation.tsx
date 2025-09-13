import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import ShieldLogo from './ShieldLogo';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Logo Bar */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-4">
            <ShieldLogo className="h-16 w-auto" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-foreground">Shield Security</h1>
              <p className="text-base text-muted-foreground">Professional Security Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="nav-sticky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </button>
              
              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border border-border">
                  <DropdownMenuItem onClick={() => scrollToSection('services')}>
                    All Services
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => scrollToSection('services')}>
                    Manned Guarding
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => scrollToSection('services')}>
                    Mobile Patrol
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => scrollToSection('services')}>
                    Private investigations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => scrollToSection('services')}>
                    Advanced Surveillance System
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => scrollToSection('services')}>
                    Escort services
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => scrollToSection('news')}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                News
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                FAQs
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('home')}
                className="block text-foreground hover:text-primary px-3 py-2 text-base font-medium w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block text-foreground hover:text-primary px-3 py-2 text-base font-medium w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block text-foreground hover:text-primary px-3 py-2 text-base font-medium w-full text-left"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('news')}
                className="block text-foreground hover:text-primary px-3 py-2 text-base font-medium w-full text-left"
              >
                News
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-foreground hover:text-primary px-3 py-2 text-base font-medium w-full text-left"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="block text-foreground hover:text-primary px-3 py-2 text-base font-medium w-full text-left"
              >
                FAQs
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
