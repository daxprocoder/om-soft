// ─── Booking Store ──────────────────────────────────────────────────────────
// All bookings are persisted to localStorage so they survive page reloads.

export type ConsultationType =
  | 'in-person'
  | 'video'
  | 'follow-up'
  | 'emergency';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  medicalNotes: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  patient: PatientInfo;
  doctorId: string;
  doctorName: string;
  consultationType: ConsultationType;
  date: string;        // ISO date string: "2026-04-25"
  timeSlot: string;    // "09:00", "09:30", etc.
  status: BookingStatus;
  meetLink: string;
  calendarLink: string;
}

const STORAGE_KEY = 'florence_bookings';

function loadAll(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function generateBookingId(): string {
  return 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function saveBooking(
  data: Omit<Booking, 'createdAt' | 'status'> & { id?: string }
): Booking {
  const booking: Booking = {
    ...data,
    id: data.id ?? generateBookingId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  const all = loadAll();
  all.push(booking);
  saveAll(all);
  return booking;
}

export function getBookings(): Booking[] {
  return loadAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getBookedSlots(doctorId: string, date: string): string[] {
  return loadAll()
    .filter(
      (b) =>
        b.doctorId === doctorId &&
        b.date === date &&
        b.status !== 'cancelled'
    )
    .map((b) => b.timeSlot);
}

export function updateBookingStatus(id: string, status: BookingStatus): void {
  const all = loadAll();
  const idx = all.findIndex((b) => b.id === id);
  if (idx !== -1) {
    all[idx].status = status;
    saveAll(all);
  }
}

export function deleteBooking(id: string): void {
  saveAll(loadAll().filter((b) => b.id !== id));
}
