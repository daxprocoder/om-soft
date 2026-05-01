import { ArrowRight, Play } from 'lucide-react';

export default function Hero({ onBookClick }: { onBookClick?: () => void }) {
  const scrollToAppointment = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      const element = document.getElementById('appointment');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-16 md:pt-24 pb-8 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#e3f2fd] via-white to-[#f0f9ff]">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#1565c0]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#42a5f5]/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-[#e3f2fd] rounded-full text-[#1565c0] text-sm font-medium">
              ✨ Award-Winning ENT Care
            </div>

            <h1 className="font-['Cormorant_Garamond'] font-bold text-5xl sm:text-6xl lg:text-7xl text-[#1a1a2e] leading-tight">
              Expert ENT Care<br />
              <span className="text-[#1565c0]">You Can Trust</span>
            </h1>

            <p className="text-lg text-[#64748b] leading-relaxed max-w-xl">
              Providing comprehensive ear, nose, and throat care with state-of-the-art technology
              and compassionate expertise. Your health and comfort are our top priorities.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToAppointment}
                className="group bg-[#1565c0] text-white px-8 py-4 rounded-full hover:bg-[#0d47a1] transition-all hover:shadow-xl flex items-center gap-2"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToServices}
                className="group bg-white text-[#1565c0] px-8 py-4 rounded-full border-2 border-[#1565c0] hover:bg-[#e3f2fd] transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[#64748b]">Modern Infrastructure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[#64748b]">Board Certified Doctors</span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="relative">
              {/* Main Circle */}
              <div className="w-full aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1565c0] to-[#42a5f5] rounded-full opacity-60"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-3/4 h-3/4">
                    {/* Stethoscope Icon */}
                    <circle cx="100" cy="80" r="15" fill="none" stroke="#1565c0" strokeWidth="3"/>
                    <path d="M 85 80 Q 85 50 100 40" fill="none" stroke="#1565c0" strokeWidth="3"/>
                    <path d="M 115 80 Q 115 50 100 40" fill="none" stroke="#1565c0" strokeWidth="3"/>
                    <circle cx="100" cy="40" r="8" fill="#1565c0"/>
                    <path d="M 100 95 L 100 140" stroke="#1565c0" strokeWidth="3"/>
                    <circle cx="100" cy="150" r="15" fill="#e3f2fd" stroke="#1565c0" strokeWidth="3"/>

                    {/* Medical Cross */}
                    <g transform="translate(150, 100)">
                      <rect x="-4" y="-12" width="8" height="24" fill="#42a5f5" rx="2"/>
                      <rect x="-12" y="-4" width="24" height="8" fill="#42a5f5" rx="2"/>
                    </g>

                    {/* Heartbeat Line */}
                    <path d="M 30 120 L 45 120 L 50 110 L 55 130 L 60 120 L 75 120"
                          fill="none" stroke="#42a5f5" strokeWidth="2" opacity="0.6"/>
                  </svg>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 -left-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#e3f2fd] rounded-full flex items-center justify-center">
                    <span className="text-2xl">🩺</span>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748b]">Experience</div>
                    <div className="font-semibold text-[#1565c0]">15+ Years</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -right-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#e3f2fd] rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748b]">Rating</div>
                    <div className="font-semibold text-[#1565c0]">4.9/5.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
