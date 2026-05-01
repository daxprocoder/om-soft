import { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Download, ExternalLink, Video, Mail, Loader2, ChevronLeft, User, Clock, Stethoscope } from 'lucide-react';
import type { Booking } from '../../../lib/bookingStore';
import { downloadICS, formatDate, formatTime } from '../../../lib/calendarUtils';
import { sendPatientConfirmation, sendDoctorNotification } from '../../../lib/emailService';

const CONSULT_LABELS: Record<string, string> = {
  'in-person': 'In-Person Consultation',
  'video': 'Video Consultation',
  'follow-up': 'Follow-up Visit',
  'emergency': 'Urgent Consultation',
};

interface Props {
  booking: Booking;
  onBack: () => void;
  onClose: () => void;
}

export default function Step4Confirm({ booking, onBack, onClose }: Props) {
  const [emailState, setEmailState] = useState<'sending' | 'sent' | 'error'>('sending');

  useEffect(() => {
    const send = async () => {
      try {
        await Promise.all([
          sendPatientConfirmation(booking),
          sendDoctorNotification(booking),
        ]);
        setEmailState('sent');
      } catch {
        setEmailState('error');
      }
    };
    send();
  }, [booking]);

  const isVideo = booking.consultationType === 'video';
  const consultLabel = CONSULT_LABELS[booking.consultationType] ?? booking.consultationType;

  return (
    <div className="p-4 sm:p-8 flex flex-col min-h-[calc(100vh-3.5rem)] md:min-h-0 pb-28 md:pb-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-400/20 animate-ping mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mt-5 mb-2">Appointment Booked!</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Your appointment request has been submitted. You'll receive a confirmation once it's approved.
        </p>

        {/* Booking ID */}
        <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 rounded-xl border-2 border-blue-100">
          <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider">Booking ID</span>
          <span className="font-mono font-bold text-blue-700 text-lg tracking-widest">{booking.id}</span>
        </div>
      </div>

      {/* Email Status */}
      <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
        emailState === 'sending' ? 'bg-amber-50 text-amber-700' :
        emailState === 'sent' ? 'bg-green-50 text-green-700' :
        'bg-red-50 text-red-700'
      }`}>
        {emailState === 'sending' ? (
          <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /><span className="text-sm font-medium">Sending confirmation emails…</span></>
        ) : emailState === 'sent' ? (
          <><Mail className="w-4 h-4 flex-shrink-0" /><span className="text-sm font-medium">Confirmation emails sent to patient & doctor ✓</span></>
        ) : (
          <><Mail className="w-4 h-4 flex-shrink-0" /><span className="text-sm font-medium">Email notification failed (check server logs)</span></>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {/* Patient */}
        <div className="bg-slate-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient</span>
          </div>
          <div className="font-bold text-slate-800">{booking.patient.name}</div>
          <div className="text-sm text-slate-500 mt-0.5">{booking.patient.email}</div>
          <div className="text-sm text-slate-500">{booking.patient.phone}</div>
        </div>

        {/* Doctor */}
        <div className="bg-slate-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doctor</span>
          </div>
          <div className="font-bold text-slate-800">{booking.doctorName}</div>
          <div className="text-sm text-slate-500 mt-0.5">{consultLabel}</div>
        </div>

        {/* Date & Time */}
        <div className="bg-blue-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Date</span>
          </div>
          <div className="font-bold text-blue-800 text-sm">{formatDate(booking.date)}</div>
        </div>

        {/* Time */}
        <div className="bg-blue-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Time</span>
          </div>
          <div className="font-bold text-blue-800 text-2xl">{formatTime(booking.timeSlot)}</div>
          <div className="text-xs text-blue-500 mt-0.5">30 minute session</div>
        </div>
      </div>

      {/* Video Meet Link */}
      {isVideo && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Jitsi Meet — Video Call Link</span>
          </div>
          <div className="font-mono text-sm break-all opacity-90 mb-1">{booking.meetLink}</div>
          <p className="text-xs opacity-60 mb-3">Click to join your video consultation (no app install needed)</p>
          <a
            href={booking.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Join Video Call Now
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <a
          href={booking.calendarLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-4 md:py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
        >
          <Calendar className="w-5 h-5" />
          Add to Google Calendar
        </a>
        <button
          onClick={() => downloadICS(booking)}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-4 md:py-3.5 rounded-xl font-semibold text-sm transition-colors"
        >
          <Download className="w-5 h-5" />
          Download .ics File
        </button>
      </div>

      {/* Navigation */}
      <div className="mt-auto pt-6 border-slate-100 flex justify-center max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:bg-white max-md:p-4 max-md:border-t max-md:z-50 max-md:shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] md:mt-8 md:pt-6 md:border-t">
        <button
          onClick={onClose}
          type="button"
          className="px-10 py-4 md:py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 max-md:w-full text-base"
        >
          Done
        </button>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
