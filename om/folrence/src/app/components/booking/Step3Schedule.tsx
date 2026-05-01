import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronLeft as PrevMonth, ChevronRight as NextMonth, Clock } from 'lucide-react';
import { getBookedSlots } from '../../../lib/bookingStore';

// Generate 30-min slots: 09:00 – 16:30
function generateSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 16; h++) {
    for (const m of [0, 30]) {
      if (h === 16 && m === 30) break;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}
const ALL_SLOTS = generateSlots();

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function formatTime12(slot: string) {
  const [h, m] = slot.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
}

interface Props {
  doctorId: string;
  selectedDate: string;
  selectedSlot: string;
  onDateChange: (date: string) => void;
  onSlotChange: (slot: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Schedule({
  doctorId,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
  onNext,
  onBack,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Days in current view
  const calDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const total = new Date(viewYear, viewMonth + 1, 0).getDate();
    return { first, total };
  }, [viewYear, viewMonth]);

  const bookedSlots = useMemo(
    () => (selectedDate ? getBookedSlots(doctorId, selectedDate) : []),
    [doctorId, selectedDate]
  );

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDate = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    // Disable past dates and Sundays (0 = Sun)
    if (d < today || d.getDay() === 0) return;
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateChange(iso);
    onSlotChange('');
  };

  const isSelectedDay = (day: number) => {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return iso === selectedDate;
  };

  const isDisabledDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today || d.getDay() === 0;
  };

  const isToday = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d.toDateString() === new Date().toDateString();
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col min-h-[calc(100vh-3.5rem)] md:min-h-0 pb-28 md:pb-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">Choose Date & Time</h2>
        <p className="text-slate-500 text-xs md:text-sm">Available Mon–Sat, 9:00 AM – 5:00 PM</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* ── Calendar ── */}
        <div className="bg-slate-50 rounded-2xl p-5">
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <PrevMonth className="w-4 h-4 text-slate-600" />
            </button>
            <span className="font-semibold text-slate-700 text-sm">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <NextMonth className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className={`text-center text-[11px] font-semibold py-1 ${d === 'Sun' ? 'text-rose-400' : 'text-slate-400'}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: calDays.first }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: calDays.total }).map((_, i) => {
              const day = i + 1;
              const disabled = isDisabledDay(day);
              const selected = isSelectedDay(day);
              const todayClass = isToday(day);
              return (
                <button
                  key={day}
                  onClick={() => selectDate(day)}
                  disabled={disabled}
                  className={`aspect-square flex items-center justify-center text-xs font-medium rounded-lg mx-0.5 transition-all ${
                    selected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : disabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : todayClass
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold'
                      : 'text-slate-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600 inline-block" />Selected</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 inline-block" />Today</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200 inline-block" />Unavailable</span>
          </div>
        </div>

        {/* ── Time Slots ── */}
        <div>
          {selectedDate ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-slate-600">Available Slots</span>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                {ALL_SLOTS.map((slot) => {
                  const booked = bookedSlots.includes(slot);
                  const sel = selectedSlot === slot;

                  // Disable past slots if it's today
                  let isPast = false;
                  if (selectedDate === new Date().toISOString().split('T')[0]) {
                    const [h, m] = slot.split(':').map(Number);
                    const now = new Date();
                    const slotTime = new Date();
                    slotTime.setHours(h, m, 0, 0);
                    if (slotTime < now) {
                      isPast = true;
                    }
                  }

                  const disabled = booked || isPast;

                  return (
                    <button
                      key={slot}
                      onClick={() => !disabled && onSlotChange(slot)}
                      disabled={disabled}
                      className={`py-2.5 text-xs font-medium rounded-xl border-2 transition-all ${
                        disabled
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                          : sel
                          ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                          : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:shadow-sm'
                      }`}
                    >
                      {formatTime12(slot)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-slate-400">
                Slots marked in grey are already booked. Each appointment is 30 minutes.
              </p>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-slate-400 text-sm">Select a date to see<br />available time slots</p>
            </div>
          )}
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
          disabled={!selectedDate || !selectedSlot}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-10 py-4 md:py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 disabled:shadow-none disabled:scale-100 max-md:flex-1 text-base"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
