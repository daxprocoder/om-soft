import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import nodemailer from 'nodemailer';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  try {
    const booking = JSON.parse(event.body || '{}');

    // Save booking to Netlify Blobs
    const store = getStore({
      name: 'bookings',
      siteID: '3d1051ef-7ed2-4a76-9e93-e04ec67caf2c',
      token: 'nfp_FCYAPv7t5in4wNQp9V2ucGiSiRaaH9M2f723'
    });
    const bookingWithMeta = {
      ...booking,
      status: booking.status || 'pending',
      createdAt: new Date().toISOString(),
    };
    await store.setJSON(booking.id, bookingWithMeta);

    // Send confirmation emails
    const smtpUser = process.env.SMTP_USER || 'Daxprocoder@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'tvwk xfcr hdlb sswh';
    const hospitalName = process.env.HOSPITAL_NAME || 'Florence Hospital';
    const doctorEmail = process.env.DOCTOR_EMAIL || 'Daxprocoder@gmail.com';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    });

    const emailResults = { patient: 'pending', doctor: 'pending' };

    // Email to Patient
    try {
      await transporter.sendMail({
        from: `"${hospitalName}" <${smtpUser}>`,
        to: booking.patient.email,
        subject: `Booking Confirmed: ${booking.id}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #1565c0;">Booking Confirmation</h2>
            <p>Dear ${booking.patient.name},</p>
            <p>Your appointment has been successfully scheduled.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Booking ID:</strong> ${booking.id}</p>
              <p><strong>Doctor:</strong> ${booking.doctorName}</p>
              <p><strong>Date:</strong> ${booking.date}</p>
              <p><strong>Time:</strong> ${booking.timeSlot}</p>
              <p><strong>Type:</strong> ${booking.consultationType}</p>
            </div>
            ${booking.consultationType === 'video' && booking.meetLink ? `
              <p><strong>Video Link:</strong> <a href="${booking.meetLink}">${booking.meetLink}</a></p>
              <p style="color: #64748b; font-size: 14px;">Please join the call at the scheduled time.</p>
            ` : ''}
            <p>Thank you for choosing ${hospitalName}.</p>
          </div>
        `,
      });
      emailResults.patient = 'sent';
    } catch (err: any) {
      console.error('Patient email failed:', err.message);
      emailResults.patient = `failed: ${err.message}`;
    }

    // Email to Doctor/Admin
    try {
      await transporter.sendMail({
        from: `"${hospitalName} System" <${smtpUser}>`,
        to: doctorEmail,
        subject: `New Booking: ${booking.patient.name} - ${booking.date}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #1565c0;">New Appointment Request</h2>
            <p>A new appointment has been booked.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Patient:</strong> ${booking.patient.name}</p>
              <p><strong>Contact:</strong> ${booking.patient.phone} | ${booking.patient.email}</p>
              <p><strong>Date:</strong> ${booking.date}</p>
              <p><strong>Time:</strong> ${booking.timeSlot}</p>
              <p><strong>Consultation:</strong> ${booking.consultationType}</p>
              <p><strong>Notes:</strong> ${booking.patient.medicalNotes || 'None'}</p>
            </div>
            ${booking.consultationType === 'video' && booking.meetLink ? `<p><strong>Meet Link:</strong> <a href="${booking.meetLink}">${booking.meetLink}</a></p>` : ''}
            <p>Please log in to the admin dashboard to manage this booking.</p>
          </div>
        `,
      });
      emailResults.doctor = 'sent';
    } catch (err: any) {
      console.error('Doctor email failed:', err.message);
      emailResults.doctor = `failed: ${err.message}`;
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Booking saved successfully',
        booking: bookingWithMeta,
        emails: emailResults,
      }),
    };
  } catch (error: any) {
    console.error('Error saving booking:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
