import { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, FileText, ChevronRight } from 'lucide-react';
import type { PatientInfo } from '../../../lib/bookingStore';

// ⚠️ IMPORTANT: InputWrapper must be defined OUTSIDE the component.
// If defined inside, React treats it as a new component type on every render,
// causing inputs to remount and lose focus after each keystroke.
function InputWrapper({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <div>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

interface Props {
  data: PatientInfo;
  onChange: (data: PatientInfo) => void;
  onNext: () => void;
}

export default function Step1Patient({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof PatientInfo, string>>>({});

  const set = (field: keyof PatientInfo, value: string) => {
    onChange({ ...data, [field]: value });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e: Partial<Record<keyof PatientInfo, string>> = {};
    if (!data.name.trim()) e.name = 'Full name is required';
    else if (data.name.length > 30) e.name = 'Name cannot exceed 30 characters';

    if (!data.email.trim()) e.email = 'Email is required';
    else if (data.email.length > 50) e.email = 'Email cannot exceed 50 characters';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) e.email = 'Invalid email address pattern';

    if (!data.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(data.phone)) e.phone = 'Phone number must be exactly 10 digits';

    if (!data.dob) e.dob = 'Date of birth is required';
    else {
      const birthDate = new Date(data.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18) e.dob = 'Patient must be at least 18 years old';
    }

    if (!data.gender) e.gender = 'Please select a gender';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const inputCls = (field: keyof PatientInfo) =>
    `w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:bg-white ${
      errors[field]
        ? 'border-red-300 focus:border-red-400'
        : 'border-transparent focus:border-blue-400'
    }`;

  // Calculate max date for DOB (18 years ago from today)
  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 18);
  const maxDobStr = maxDob.toISOString().split('T')[0];

  return (
    <div className="p-4 sm:p-8 flex flex-col min-h-[calc(100vh-3.5rem)] md:min-h-0 pb-28 md:pb-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">Patient Registration</h2>
        <p className="text-slate-500 text-xs md:text-sm">Please provide your details to proceed</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {/* Full Name */}
        <InputWrapper error={errors.name}>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={data.name}
              maxLength={30}
              onChange={(e) => set('name', e.target.value)}
              className={inputCls('name')}
              placeholder="John Smith"
            />
          </div>
        </InputWrapper>

        {/* Email */}
        <InputWrapper error={errors.email}>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              value={data.email}
              maxLength={50}
              onChange={(e) => set('email', e.target.value)}
              className={inputCls('email')}
              placeholder="john@example.com"
            />
          </div>
        </InputWrapper>

        {/* Phone */}
        <InputWrapper error={errors.phone}>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="relative flex">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-400">+91</span>
            </div>
            <input
              type="tel"
              value={data.phone}
              maxLength={10}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');
              }}
              onChange={(e) => set('phone', e.target.value)}
              className={`${inputCls('phone')} !pl-20`}
              placeholder="00000 00000"
            />
          </div>
        </InputWrapper>

        {/* Date of Birth */}
        <InputWrapper error={errors.dob}>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Date of Birth (18+) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={data.dob}
              onChange={(e) => set('dob', e.target.value)}
              max={maxDobStr}
              className={inputCls('dob')}
            />
          </div>
        </InputWrapper>

        {/* Gender */}
        <InputWrapper error={errors.gender}>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Gender <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-3">
            {['Male', 'Female', 'Other'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => set('gender', g)}
                className={`flex-1 py-3.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  data.gender === g
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-transparent hover:border-blue-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </InputWrapper>

        {/* Address */}
        <InputWrapper error={errors.address}>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Address (Max 150)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={data.address}
              maxLength={150}
              onChange={(e) => set('address', e.target.value)}
              className={inputCls('address')}
              placeholder="123 Main St, City, State"
            />
          </div>
        </InputWrapper>

        {/* Medical Notes - full width */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Medical Notes / Reason for Visit (Max 500)
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <textarea
              value={data.medicalNotes}
              maxLength={500}
              onChange={(e) => set('medicalNotes', e.target.value)}
              rows={3}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:bg-white focus:border-blue-400 resize-none"
              placeholder="Brief description of your symptoms or reason for visit..."
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-slate-100 flex justify-end max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:bg-white max-md:p-4 max-md:border-t max-md:z-50 max-md:shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] md:mt-10 md:pt-6 md:border-t">
        <button
          onClick={handleNext}
          type="button"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-4 md:py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 max-md:w-full text-base"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
