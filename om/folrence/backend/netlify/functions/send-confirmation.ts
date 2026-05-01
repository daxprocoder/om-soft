import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  try {
    const booking = JSON.parse(event.body || '{}');
    const { patient, doctorName, date, timeSlot, consultationType, meetLink, id } = booking;

    const smtpUser = process.env.SMTP_USER || 'Daxprocoder@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'tvwk xfcr hdlb sswh';
    const hospitalName = process.env.HOSPITAL_NAME || 'Florence Hospital';
    const doctorEmail = process.env.DOCTOR_EMAIL || 'Daxprocoder@gmail.com';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Email to Patient
    const patientMailOptions = {
      from: `"${hospitalName}" <${smtpUser}>`,
      to: patient.email,
      subject: `Booking Confirmed: ${id}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #1565c0;">Booking Confirmation</h2>
          <p>Dear ${patient.name},</p>
          <p>Your appointment has been successfully scheduled.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${id}</p>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${timeSlot}</p>
            <p><strong>Type:</strong> ${consultationType}</p>
          </div>
          ${consultationType === 'video' ? `
            <p><strong>Video Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
            <p style="color: #64748b; font-size: 14px;">Please join the call at the scheduled time.</p>
          ` : ''}
          <p>Thank you for choosing ${hospitalName}.</p>
        </div>
      `,
    };

    // Email to Doctor
    const doctorMailOptions = {
      from: `"${hospitalName} System" <${smtpUser}>`,
      to: doctorEmail,
      subject: `New Booking: ${patient.name} - ${date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #1565c0;">New Appointment Request</h2>
          <p>A new appointment has been booked via the website.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Patient:</strong> ${patient.name}</p>
            <p><strong>Contact:</strong> ${patient.phone} | ${patient.email}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${timeSlot}</p>
            <p><strong>Consultation:</strong> ${consultationType}</p>
            <p><strong>Notes:</strong> ${patient.medicalNotes || 'None'}</p>
          </div>
          ${consultationType === 'video' ? `<p><strong>Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>` : ''}
          <p>Please log in to the dashboard to manage this booking.</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(patientMailOptions),
      transporter.sendMail(doctorMailOptions),
    ]);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Emails sent successfully' }),
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
