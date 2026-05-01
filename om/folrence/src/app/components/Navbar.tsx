import { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1565c0] rounded-lg flex items-center justify-center relative overflow-hidden">
              <Plus className="w-6 h-6 md:w-7 md:h-7 text-white absolute" strokeWidth={3} />
            </div>
            <div>
              <h1 className="font-['Cormorant_Garamond'] font-semibold text-xl md:text-2xl text-[#1565c0]">
                Florence Hospital
              </h1>
              <p className="text-[10px] md:text-xs text-[#64748b] hidden sm:block">ENT Specialty Clinic</p>
            </div>
          </div>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="text-[#1a1a2e] hover:text-[#1565c0] transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('services')} className="text-[#1a1a2e] hover:text-[#1565c0] transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection('doctor')} className="text-[#1a1a2e] hover:text-[#1565c0] transition-colors">
              Doctor
            </button>
            <button onClick={() => scrollToSection('about')} className="text-[#1a1a2e] hover:text-[#1565c0] transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-[#1a1a2e] hover:text-[#1565c0] transition-colors">
              Contact
            </button>
            <button
              onClick={() => scrollToSection('appointment')}
              className="bg-[#1565c0] text-white px-6 py-2.5 rounded-full hover:bg-[#0d47a1] transition-all hover:shadow-lg"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
