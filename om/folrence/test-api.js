const url = 'https://theflorencehospital.netlify.app/.netlify/functions/save-booking';
const payload = {
  id: 'TEST-SCRIPT-001',
  patient: { name: 'Node Test', email: 'Daxprocoder@gmail.com', phone: '123' },
  doctorName: 'Dr. Test',
  consultationType: 'in-person',
  date: '2026-05-01',
  timeSlot: '10:00 AM'
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
