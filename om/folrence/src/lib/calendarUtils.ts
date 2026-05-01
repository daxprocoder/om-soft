import type { Booking, ConsultationType } from './bookingStore';

// ─── Video Meet Link Generator (Structured for Professional Use) ────────────
// Generates a structured video call room link.
// Used for instant video consultations.
export function generateMeetLink(suffix?: string): string {
  const id = suffix
    ? suffix.replace(/[^a-zA-Z0-9]/g, '')
    : Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).slice(2, 7).toUpperCase();
  // Using a professional room naming convention
  return `https://meet.jit.si/Florence-Health-${id}`;
}

// ─── Google Calendar Pre-filled URL ─────────────────────────────────────────
export function generateGoogleCalendarLink(params: {
  title: string;
  description: string;
  date: string;      // "2026-04-25"
  timeSlot: string;  // "09:00"
  doctorName: string;
  meetLink: string;
  consultationType: ConsultationType;
}): string {
  const { title, description, date, timeSlot, meetLink } = params;

  // Build start/end in UTC format: 20260425T090000Z
  const [year, month, day] = date.split('-');
  const [hour, minute] = timeSlot.split(':');
  const startStr = `${year}${month}${day}T${hour}${minute}00`;
  // 30-min appointment
  const endMinutes = parseInt(minute) + 30;
  const endHour = endMinutes >= 60 ? String(parseInt(hour) + 1).padStart(2, '0') : hour;
  const endMin = String(endMinutes % 60).padStart(2, '0');
  const endStr = `${year}${month}${day}T${endHour}${endMin}00`;

  const details = encodeURIComponent(
    `${description}\n\nGoogle Meet: ${meetLink}\n\nFlorence Hospital Appointment System`
  );
  const encodedTitle = encodeURIComponent(title);
  const location = encodeURIComponent('Florence Hospital');

  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodedTitle}` +
    `&dates=${startStr}/${endStr}` +
    `&details=${details}` +
    `&location=${location}` +
    `&sf=true&output=xml`
  );
}

// ─── ICS Download ────────────────────────────────────────────────────────────
export function downloadICS(booking: Booking): void {
  const [year, month, day] = booking.date.split('-');
  const [hour, minute] = booking.timeSlot.split(':');
  const start = `${year}${month}${day}T${hour}${minute}00`;
  const endMinutes = parseInt(minute) + 30;
  const endHour = endMinutes >= 60 ? String(parseInt(hour) + 1).padStart(2, '0') : hour;
  const endMin = String(endMinutes % 60).padStart(2, '0');
  const end = `${year}${month}${day}T${endHour}${endMin}00`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Florence Hospital//Appointment//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@florence.health`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Appointment with ${booking.doctorName}`,
    `DESCRIPTION:Consultation type: ${booking.consultationType}\\nMeet: ${booking.meetLink}\\nBooking ID: ${booking.id}`,
    `LOCATION:Florence Hospital`,
    `URL:${booking.meetLink}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `appointment-${booking.id}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Human-readable date/time ────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(slot: string): string {
  const [h, m] = slot.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}
