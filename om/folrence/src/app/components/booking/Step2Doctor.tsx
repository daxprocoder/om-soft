import { ChevronLeft, ChevronRight, Video, User, RefreshCw, Zap } from 'lucide-react';

export const DOCTORS = [
  {
    id: 'dr-anderson',
    name: 'Dr. Sarah Anderson',
    title: 'MS ENT, FACS',
    specialty: 'ENT Specialist',
    experience: '15+ Years',
    patients: '25K+',
    rating: 5,
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 'dr-carter',
    name: 'Dr. James Carter',
    title: 'MD, MBBS',
    specialty: 'General Physician',
    experience: '12+ Years',
    patients: '18K+',
    rating: 5,
    color: 'from-indigo-600 to-violet-400',
  },
];

export const CONSULTATION_TYPES = [
  {
    id: 'in-person',
    label: 'In-Person Consultation',
    icon: User,
    description: 'Visit the clinic for a face-to-face consultation',
    color: 'blue',
  },
  {
    id: 'video',
    label: 'Video Consultation',
    icon: Video,
    description: 'Online consultation via Jitsi from anywhere',
    color: 'violet',
  },
  {
    id: 'follow-up',
    label: 'Follow-up Visit',
    icon: RefreshCw,
    description: 'Continue your treatment with a follow-up session',
    color: 'emerald',
  },
  {
    id: 'emergency',
    label: 'Urgent Consultation',
    icon: Zap,
    description: 'Same-day slot for urgent concerns (subject to availability)',
    color: 'rose',
  },
] as const;

const COLOR_STYLES: Record<string, { ring: string; bg: string; text: string; icon: string }> = {
  blue:    { ring: 'ring-blue-400',    bg: 'bg-blue-50',    text: 'text-blue-700',    icon: 'text-blue-500'    },
  violet:  { ring: 'ring-violet-400',  bg: 'bg-violet-50',  text: 'text-violet-700',  icon: 'text-violet-500'  },
  emerald: { ring: 'ring-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' },
  rose:    { ring: 'ring-rose-400',    bg: 'bg-rose-50',    text: 'text-rose-700',    icon: 'text-rose-500'    },
};

interface Props {
  doctorId: string;
  consultationType: string;
  onDoctorChange: (id: string) => void;
  onConsultationChange: (type: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Doctor({
  doctorId,
  consultationType,
  onDoctorChange,
  onConsultationChange,
  onNext,
  onBack,
}: Props) {
  const canContinue = doctorId && consultationType;

  return (
    <div className="p-4 sm:p-8 flex flex-col min-h-[calc(100vh-3.5rem)] md:min-h-0 pb-28 md:pb-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">Select Doctor & Consultation</h2>
        <p className="text-slate-500 text-xs md:text-sm">Choose your preferred doctor and consultation type</p>
      </div>

      {/* Doctor Selection */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Available Doctors
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {DOCTORS.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onDoctorChange(doc.id)}
              className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 group ${
                doctorId === doc.id
                  ? 'border-blue-500 bg-blue-50/60 shadow-lg shadow-blue-500/10'
                  : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'
              }`}
            >
              {doctorId === doc.id && (
                <div className="absolute top-4 right-4 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doc.color} flex items-center justify-center mb-4 shadow-lg`}>
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <circle cx="20" cy="14" r="8" fill="white" opacity="0.9" />
                  <path d="M4 36 Q20 28 36 36" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9"/>
                </svg>
              </div>
              <div className="font-bold text-slate-800 text-base">{doc.name}</div>
              <div className="text-xs text-slate-500 mt-0.5 mb-3">{doc.title} · {doc.specialty}</div>
              <div className="flex gap-3">
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{doc.experience}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{doc.patients} patients</span>
              </div>
              <div className="flex gap-0.5 mt-3">
                {Array.from({ length: doc.rating }).map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Consultation Type */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Consultation Type
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {CONSULTATION_TYPES.map((type) => {
            const cs = COLOR_STYLES[type.color];
            const Icon = type.icon;
            const selected = consultationType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onConsultationChange(type.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selected
                    ? `border-current ${cs.bg} ring-2 ${cs.ring} ring-offset-0 shadow-md`
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${selected ? cs.bg : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${selected ? cs.icon : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${selected ? cs.text : 'text-slate-700'}`}>{type.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{type.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto pt-6 border-slate-100 flex items-center justify-between gap-3 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:bg-white max-md:p-4 max-md:border-t max-md:z-50 max-md:shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] md:mt-10 md:pt-6 md:border-t">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center justify-center gap-2 px-6 py-4 md:py-3.5 text-slate-600 hover:text-slate-800 font-bold text-sm transition-all hover:bg-slate-50 rounded-xl border border-slate-200 md:border-transparent max-md:flex-1 text-base"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          type="button"
          disabled={!canContinue}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-10 py-4 md:py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 disabled:shadow-none disabled:scale-100 max-md:flex-1 text-base"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
