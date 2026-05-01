import { useState, useEffect } from 'react';
import { Calendar, Phone, MessageCircle, Clock, Video, User } from 'lucide-react';
import BookingModal from './booking/BookingModal';
import { getBookings, Booking } from '../../lib/bookingStore';

export default function MobileBookingDashboard({ onJoinCall }: { onJoinCall?: (room: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const refresh = () => setBookings(getBookings());

  useEffect(() => {
    refresh();
    const handleStorageChange = () => refresh();
    window.addEventListener('florence_bookings_changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('florence_bookings_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isModalOpen]);

  // Sort by date and time (upcoming first)
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.timeSlot || '00:00'}`);
    const dateB = new Date(`${b.date}T${b.timeSlot || '00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="p-4 bg-slate-50 min-h-screen pb-24">
      {/* Header Profile / Title */}
      <div className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
        <p className="text-sm text-slate-500">Manage your consultations and bookings</p>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h2 className="text-lg font-bold text-slate-800 mb-2 relative z-10">Need a Doctor?</h2>
        <p className="text-sm text-slate-500 mb-4 relative z-10">Book a new appointment or video consultation instantly.</p>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-[#1565c0] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 transition-transform relative z-10"
        >
          <Calendar className="w-5 h-5" />
          Book New Appointment
        </button>
      </div>

      {/* Contact Support Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:bg-slate-50 transition-colors">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-700">WhatsApp Us</span>
        </a>
        <a href="tel:+1234567890" className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:bg-slate-50 transition-colors">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Call Clinic</span>
        </a>
      </div>

      {/* Recent Bookings List */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          Upcoming Calls
        </h3>
        
        {sortedBookings.length === 0 ? (
          <div className="bg-white border border-slate-100 border-dashed rounded-2xl p-6 text-center">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onJoinCall={onJoinCall} 
              />
            ))}
          </div>
        )}
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function BookingCard({ 
  booking, 
  onJoinCall
}: { 
  booking: Booking; 
  onJoinCall?: (room: string) => void;
}) {
  const isVideo = booking.consultationType === 'video';
  
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-slate-800">{booking.doctorName}</h4>
          <p className="text-xs text-slate-500 capitalize">{booking.consultationType.replace('-', ' ')}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
            booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
            'bg-slate-100 text-slate-600'
          }`}>
            {booking.status}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 bg-slate-50 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 text-sm text-slate-700">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-700">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{booking.timeSlot}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User className="w-3.5 h-3.5" />
            {booking.patient.name}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isVideo && booking.meetLink && (
            <button 
              onClick={() => onJoinCall?.(booking.meetLink!)}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:bg-blue-100"
            >
              <Video className="w-3.5 h-3.5" />
              Join Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
