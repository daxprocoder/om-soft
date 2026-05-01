import type { Booking } from './bookingStore';
import { formatDate, formatTime } from './calendarUtils';

// ─── Email Service ───────────────────────────────────────────────────────────
// Calls the Vite server middleware at /api/send-email (nodemailer / Gmail SMTP)

const CONSULTATION_LABELS: Record<string, string> = {
  'in-person': 'In-Person Consultation',
  'video': 'Video Consultation (Google Meet)',
  'follow-up': 'Follow-up Visit',
  'emergency': 'Emergency Visit',
};

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error('Email API error:', text);
    }
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

// ─── Patient Confirmation ────────────────────────────────────────────────────
export async function sendPatientConfirmation(booking: Booking): Promise<void> {
  const consultLabel = CONSULTATION_LABELS[booking.consultationType] ?? booking.consultationType;
  const isVideo = booking.consultationType === 'video';

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%); padding: 40px 40px 30px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 28px; font-weight: 700; }
  .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 15px; }
  .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; padding: 6px 18px; border-radius: 100px; font-size: 13px; margin-bottom: 16px; }
  .body { padding: 36px 40px; }
  .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 8px; }
  .message { color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
  .card { background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 20px; border-left: 4px solid #1565c0; }
  .card-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 12px; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #64748b; font-size: 14px; }
  .detail-value { color: #1a1a2e; font-size: 14px; font-weight: 600; }
  .booking-id { font-family: monospace; font-size: 20px; font-weight: 700; color: #1565c0; text-align: center; padding: 16px; background: #e3f2fd; border-radius: 10px; margin-bottom: 24px; letter-spacing: 2px; }
  .btn { display: inline-block; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; text-decoration: none; text-align: center; }
  .btn-primary { background: linear-gradient(135deg, #1565c0, #42a5f5); color: #fff; }
  .btn-meet { background: linear-gradient(135deg, #1e88e5, #42a5f5); color: #fff; }
  .btn-ics { background: #f1f5f9; color: #1565c0; }
  .btn-row { text-align: center; margin: 28px 0; }
  .footer { background: #f8fafc; padding: 24px 40px; text-align: center; }
  .footer p { color: #94a3b8; font-size: 13px; margin: 4px 0; }
  .meet-box { background: linear-gradient(135deg, #e3f2fd, #f0f9ff); border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; text-align: center; }
  .meet-box h3 { color: #1565c0; margin: 0 0 8px; font-size: 16px; }
  .meet-link { color: #1976d2; font-size: 14px; word-break: break-all; }
  .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="badge">✓ Appointment Requested</div>
    <h1>Florence Hospital</h1>
    <p>Your appointment has been received and is pending confirmation</p>
  </div>
  <div class="body">
    <p class="greeting">Dear ${booking.patient.name},</p>
    <p class="message">
      Thank you for booking with Florence Hospital. We have received your appointment request and it is currently being reviewed. 
      You will receive another notification once your appointment is confirmed.
    </p>
    
    <div class="booking-id">Booking ID: ${booking.id}</div>
    
    <div class="card">
      <div class="card-title">📅 Appointment Details</div>
      <div class="detail-row">
        <span class="detail-label">Doctor</span>
        <span class="detail-value">${booking.doctorName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Consultation Type</span>
        <span class="detail-value">${consultLabel}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(booking.date)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${formatTime(booking.timeSlot)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value"><span class="status-badge">⏳ Pending Confirmation</span></span>
      </div>
    </div>

    ${isVideo ? `
    <div class="meet-box">
      <h3>🎥 Your Jitsi Meet Video Call Link</h3>
      <a href="${booking.meetLink}" class="meet-link">${booking.meetLink}</a>
      <p style="color:#64748b;font-size:13px;margin-top:8px;">Click to join at your appointment time — no app or account needed</p>
      <div style="text-align:center;margin-top:12px;">
        <a href="${booking.meetLink}" style="display:inline-block;background:linear-gradient(135deg,#1565c0,#42a5f5);color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">🎥 Join Video Call</a>
      </div>
    </div>
    ` : ''}

    <div class="btn-row">
      <a href="${booking.calendarLink}" class="btn btn-primary">📅 Add to Google Calendar</a>
    </div>

    <div class="card">
      <div class="card-title">👤 Your Details on File</div>
      <div class="detail-row">
        <span class="detail-label">Name</span>
        <span class="detail-value">${booking.patient.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone</span>
        <span class="detail-value">${booking.patient.phone}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value">${booking.patient.email}</span>
      </div>
    </div>

    <p style="color:#64748b;font-size:14px;line-height:1.6;">
      📍 <strong>Location:</strong> Florence Hospital, Medical Center Drive<br>
      📞 <strong>Questions?</strong> Call us at +1 (555) 123-4567<br>
      🕒 <strong>Hours:</strong> Monday – Saturday, 9:00 AM – 5:00 PM
    </p>
  </div>
  <div class="footer">
    <p><strong>Florence Hospital</strong> — Excellence in ENT Care</p>
    <p>This is an automated notification. Please do not reply to this email.</p>
  </div>
</div>
</body>
</html>`;

  await sendEmail({
    to: booking.patient.email,
    subject: `[Florence Hospital] Appointment Confirmation — ${booking.id}`,
    html,
  });
}

// ─── Doctor Notification ─────────────────────────────────────────────────────
export async function sendDoctorNotification(booking: Booking): Promise<void> {
  const consultLabel = CONSULTATION_LABELS[booking.consultationType] ?? booking.consultationType;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #1a237e 0%, #283593 100%); padding: 40px 40px 30px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 26px; font-weight: 700; }
  .header p { color: rgba(255,255,255,0.75); margin: 8px 0 0; font-size: 15px; }
  .alert-badge { display: inline-block; background: #ff6b35; color: #fff; padding: 6px 18px; border-radius: 100px; font-size: 13px; margin-bottom: 16px; font-weight: 600; }
  .body { padding: 36px 40px; }
  .card { background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
  .card-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 12px; font-weight: 700; }
  .detail-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #e2e8f0; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #64748b; font-size: 14px; }
  .detail-value { color: #1a1a2e; font-size: 14px; font-weight: 600; max-width: 60%; text-align: right; }
  .booking-id { font-family: monospace; font-size: 18px; font-weight: 700; color: #283593; text-align: center; padding: 14px; background: #e8eaf6; border-radius: 10px; margin-bottom: 24px; letter-spacing: 2px; }
  .highlight-card { background: linear-gradient(135deg, #e8eaf6, #ede7f6); border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; border-left: 4px solid #3949ab; }
  .btn { display: inline-block; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; text-decoration: none; text-align: center; }
  .btn-primary { background: linear-gradient(135deg, #283593, #3949ab); color: #fff; }
  .btn-row { text-align: center; margin: 24px 0; }
  .medical-notes { background: #fff8e1; border-radius: 10px; padding: 16px; border-left: 4px solid #ffc107; font-size: 14px; color: #37474f; line-height: 1.6; }
  .footer { background: #f8fafc; padding: 24px 40px; text-align: center; }
  .footer p { color: #94a3b8; font-size: 13px; margin: 4px 0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="alert-badge">🔔 New Appointment</div>
    <h1>New Patient Booking</h1>
    <p>A new appointment has been requested — Review and confirm in the admin panel</p>
  </div>
  <div class="body">
    <div class="booking-id">Booking ID: ${booking.id}</div>

    <div class="highlight-card">
      <div class="card-title">📅 Appointment Summary</div>
      <div class="detail-row">
        <span class="detail-label">Doctor</span>
        <span class="detail-value">${booking.doctorName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Consultation Type</span>
        <span class="detail-value">${consultLabel}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(booking.date)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${formatTime(booking.timeSlot)}</span>
      </div>
      ${booking.consultationType === 'video' ? `
      <div class="detail-row">
        <span class="detail-label">Jitsi Meet Link</span>
        <span class="detail-value" style="font-size:12px;"><a href="${booking.meetLink}" style="color:#1565c0;">${booking.meetLink}</a></span>
      </div>
      <div style="text-align:center;margin-top:8px;">
        <a href="${booking.meetLink}" style="display:inline-block;background:linear-gradient(135deg,#1565c0,#42a5f5);color:#fff;padding:8px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">🎥 Join Patient's Call</a>
      </div>` : ''}
    </div>

    <div class="card">
      <div class="card-title">👤 Patient Information</div>
      <div class="detail-row">
        <span class="detail-label">Full Name</span>
        <span class="detail-value">${booking.patient.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value">${booking.patient.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone</span>
        <span class="detail-value">${booking.patient.phone}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date of Birth</span>
        <span class="detail-value">${booking.patient.dob}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Gender</span>
        <span class="detail-value">${booking.patient.gender}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Address</span>
        <span class="detail-value">${booking.patient.address}</span>
      </div>
    </div>

    ${booking.patient.medicalNotes ? `
    <div class="card-title" style="margin-bottom:8px;">📋 Medical Notes / Reason for Visit</div>
    <div class="medical-notes">${booking.patient.medicalNotes}</div>
    <br>` : ''}

    <div class="btn-row">
      <a href="${booking.calendarLink}" class="btn btn-primary">📅 Add to Google Calendar</a>
    </div>

    <p style="color:#64748b;font-size:14px;text-align:center;">
      Log in to the <strong>Admin Panel</strong> to confirm or manage this booking.
    </p>
  </div>
  <div class="footer">
    <p><strong>Florence Hospital</strong> — Admin Notification System</p>
    <p>Booked at: ${new Date(booking.createdAt).toLocaleString()}</p>
  </div>
</div>
</body>
</html>`;

  await sendEmail({
    to: 'Daxprocoder@gmail.com',
    subject: `[Admin] New Booking: ${booking.patient.name} — ${formatDate(booking.date)} at ${formatTime(booking.timeSlot)}`,
    html,
  });
}
