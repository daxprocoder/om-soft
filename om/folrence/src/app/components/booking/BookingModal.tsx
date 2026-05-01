import { useState, useEffect } from 'react';
import { X, User, Stethoscope, CalendarDays, CheckCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Step1Patient from './Step1Patient';
import Step2Doctor from './Step2Doctor';
import Step3Schedule from './Step3Schedule';
import Step4Confirm from './Step4Confirm';
import { DOCTORS } from './Step2Doctor';
import type { PatientInfo, Booking } from '../../../lib/bookingStore';
import { saveBooking, generateBookingId } from '../../../lib/bookingStore';
import { generateMeetLink, generateGoogleCalendarLink } from '../../../lib/calendarUtils';
import { LocalNotifications } from '@capacitor/local-notifications';

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: 'Patient Info', icon: User },
  { id: 2, label: 'Doctor',       icon: Stethoscope },
  { id: 3, label: 'Schedule',     icon: CalendarDays },
  { id: 4, label: 'Confirm',      icon: CheckCircle },
];

const DEFAULT_PATIENT: PatientInfo = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: '',
  medicalNotes: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: Props) {
  const [step, setStep]               = useState<Step>(1);
  const [direction, setDirection]     = useState(0);
  const [patient, setPatient]         = useState<PatientInfo>(DEFAULT_PATIENT);
  const [doctorId, setDoctorId]       = useState('');
  const [consultType, setConsultType] = useState('');
  const [date, setDate]               = useState('');
  const [slot, setSlot]               = useState('');
  const [booking, setBooking]         = useState<Booking | null>(null);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setDirection(0);
        setPatient(DEFAULT_PATIENT);
        setDoctorId('');
        setConsultType('');
        setDate('');
        setSlot('');
        setBooking(null);
      }, 300);
    }
  }, [isOpen]);

  const handleNext = (nextStep: Step) => {
    setDirection(1);
    setStep(nextStep);
  };

  const handleBack = (prevStep: Step) => {
    setDirection(-1);
    setStep(prevStep);
  };

  const handleConfirm = () => {
    const doctor = DOCTORS.find((d) => d.id === doctorId)!;
    const bookingId = generateBookingId();
    const meetLink = generateMeetLink(bookingId);
    const calendarLink = generateGoogleCalendarLink({
      title: `Appointment with ${doctor.name}`,
      description: `Florence Hospital appointment\nPatient: ${patient.name}\nType: ${consultType}`,
      date,
      timeSlot: slot,
      doctorName: doctor.name,
      meetLink,
      consultationType: consultType as any,
    });

    const saved = saveBooking({
      id: bookingId,
      patient,
      doctorId,
      doctorName: doctor.name,
      consultationType: consultType as any,
      date,
      timeSlot: slot,
      meetLink,
      calendarLink,
    });

    // Save to backend + send confirmation emails
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    fetch(`${backendUrl}/.netlify/functions/save-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saved),
    })
      .then(res => res.json())
      .then(async data => {
        console.log('Booking saved & emails:', data);
        
        // Trigger native push notification on Android/iOS via Capacitor
        try {
          let permStatus = await LocalNotifications.checkPermissions();
          if (permStatus.display !== 'granted') {
            permStatus = await LocalNotifications.requestPermissions();
          }
          if (permStatus.display === 'granted') {
            await LocalNotifications.schedule({
              notifications: [
                {
                  title: 'Appointment Booked! ✅',
                  body: `Your appointment with ${doctor.name} on ${date} at ${slot} has been successfully submitted.`,
                  id: Math.floor(Math.random() * 100000),
                  schedule: { at: new Date(Date.now() + 1000) },
                  sound: null,
                  attachments: null,
                  actionTypeId: '',
                  extra: null
                }
              ]
            });
          }
        } catch (e) {
          console.error('LocalNotifications failed:', e);
        }

        // Fallback to Web Notification API (for desktop browsers)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Booking Confirmed! ✅', {
            body: `Your appointment with ${doctor.name} on ${date} at ${slot} has been confirmed.`,
            icon: '/favicon.ico',
          });
        }
      })
      .catch(err => console.error('Failed to save booking:', err));

    setBooking(saved);
    setDirection(1);
    setStep(4);
  };

  if (!isOpen) return null;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-4">
      {/* Backdrop (hidden on mobile, visible on desktop) */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm hidden md:block"
        onClick={step !== 4 ? onClose : undefined}
      />
      <div className="absolute inset-0 bg-white md:hidden" />

      {/* Modal / Mobile Screen */}
      <div className="relative w-full max-w-2xl h-[100dvh] md:h-auto md:max-h-[90vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between shrink-0 z-20 relative shadow-sm">
          {step > 1 && step < 4 ? (
            <button onClick={() => handleBack((step - 1) as Step)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-100">
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10"></div> // Placeholder for alignment
          )}
          <div className="font-semibold text-slate-800 text-sm">
            {step === 4 ? 'Confirmed' : `Step ${step} of 3`}
          </div>
          {step !== 4 ? (
            <button onClick={onClose} className="p-2 -mr-2 text-slate-500 rounded-full hover:bg-slate-100">
              <X className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10"></div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex relative bg-gradient-to-r from-[#0d47a1] via-[#1565c0] to-[#1976d2] px-6 py-5 shrink-0 flex-col z-20">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-white font-bold text-lg">Book Appointment</h1>
              <p className="text-blue-200 text-xs mt-0.5">Florence Hospital</p>
            </div>
            {step !== 4 && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Desktop Step Progress */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id || (s.id === 4 && step === 4);
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? 'bg-green-400'
                        : isActive
                        ? 'bg-white'
                        : 'bg-white/20'
                    }`}>
                      {isDone
                        ? <CheckCircle className="w-4 h-4 text-white" />
                        : <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-white/50'}`} />}
                    </div>
                    <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                      isActive ? 'text-white' : isDone ? 'text-blue-200' : 'text-white/40'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all duration-500 ${step > s.id ? 'bg-green-400' : 'bg-white/20'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Progress Bar (thin line at top) */}
        <div className="md:hidden w-full h-1 bg-slate-100 z-20 shrink-0">
          <div 
            className="h-full bg-[#1565c0] transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body (scrollable) */}
        <div className="relative flex-1 overflow-hidden bg-white z-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0 overflow-y-auto"
            >
              {step === 1 && (
                <Step1Patient
                  data={patient}
                  onChange={setPatient}
                  onNext={() => handleNext(2)}
                />
              )}
              {step === 2 && (
                <Step2Doctor
                  doctorId={doctorId}
                  consultationType={consultType}
                  onDoctorChange={setDoctorId}
                  onConsultationChange={setConsultType}
                  onNext={() => handleNext(3)}
                  onBack={() => handleBack(1)}
                />
              )}
              {step === 3 && (
                <Step3Schedule
                  doctorId={doctorId}
                  selectedDate={date}
                  selectedSlot={slot}
                  onDateChange={setDate}
                  onSlotChange={setSlot}
                  onNext={handleConfirm}
                  onBack={() => handleBack(2)}
                />
              )}
              {step === 4 && booking && (
                <Step4Confirm
                  booking={booking}
                  onBack={() => handleBack(3)}
                  onClose={onClose}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
