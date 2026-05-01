import { useState } from 'react';
import { Calendar, Phone, MapPin, Clock, Sparkles } from 'lucide-react';
import BookingModal from './booking/BookingModal';

export default function Appointment() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="appointment" className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-12 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Book Your Visit
            </div>
            <h2 className="font-['Cormorant_Garamond'] font-bold text-3xl sm:text-5xl text-white mb-4">
              Schedule Your Appointment
            </h2>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              Take the first step towards better ENT health. Our team is ready to provide you with expert care — book in minutes.
            </p>
          </div>

          {/* CTA Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Clock,    label: 'Quick Booking',    desc: 'Complete in under 3 minutes' },
                { icon: Calendar, label: 'Instant Scheduling', desc: 'Choose your preferred date & time' },
                { icon: Phone,    label: 'Email Confirmation', desc: 'Get confirmation directly in inbox' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white font-semibold text-sm">{label}</div>
                  <div className="text-white/60 text-xs mt-1">{desc}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                id="book-appointment-btn"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-3 bg-white text-[#1565c0] hover:bg-blue-50 px-10 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Book Appointment Now
              </button>
              <p className="text-white/50 text-xs mt-4">Mon – Sat · 9:00 AM – 5:00 PM · Free to book</p>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
            <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              <div className="text-white/60 text-sm mb-1">Call Us</div>
              <div className="text-white font-semibold text-lg">+1 (555) 123-4567</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-400">
              <div className="text-white/60 text-sm mb-1">Location</div>
              <div className="text-white font-semibold text-lg flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" />
                Medical Center Dr
              </div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              <div className="text-white/60 text-sm mb-1">Email</div>
              <div className="text-white font-semibold text-lg">care@florence.health</div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
