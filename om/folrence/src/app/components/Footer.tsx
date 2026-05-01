import { Phone, Mail, MapPin, Plus, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0d47a1] text-white hidden md:block">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Hospital Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Plus className="w-7 h-7 text-[#1565c0]" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-['Cormorant_Garamond'] font-semibold text-2xl">
                  Florence Hospital
                </h3>
                <p className="text-sm text-white/70">ENT Specialty Clinic</p>
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              Providing world-class ear, nose, and throat care with compassion and expertise.
              Your health and comfort are our top priorities.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white hover:text-[#1565c0] rounded-full flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white hover:text-[#1565c0] rounded-full flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white hover:text-[#1565c0] rounded-full flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white hover:text-[#1565c0] rounded-full flex items-center justify-center transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Cormorant_Garamond'] font-semibold text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-white/70 hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="text-white/70 hover:text-white transition-colors">Services</a></li>
              <li><a href="#doctor" className="text-white/70 hover:text-white transition-colors">Our Doctor</a></li>
              <li><a href="#appointment" className="text-white/70 hover:text-white transition-colors">Book Appointment</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div id="about">
            <h4 className="font-['Cormorant_Garamond'] font-semibold text-xl mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-white/70" />
                <div>
                  <div className="text-white/70 text-sm">Reception</div>
                  <a href="tel:+15551234567" className="hover:text-white/80 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-white/70" />
                <div>
                  <a href="mailto:care@florence.health" className="hover:text-white/80 transition-colors">
                    care@florence.health
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-white/70" />
                <div className="text-white/70">
                  123 Medical Plaza<br />
                  Healthcare District<br />
                  New York, NY 10001
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Florence Hospital. All rights reserved. | Designed with care for your health</p>
        </div>
      </div>
    </footer>
  );
}
