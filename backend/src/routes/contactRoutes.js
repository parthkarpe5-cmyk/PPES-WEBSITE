const express = require('express');
const router = express.Router();

// Prefer using the official Resend SDK. Keep this server-side only.
let ResendClass = null;
try {
  const ResendImport = require('resend');
  // Support both CommonJS and ESM default/name exports
  ResendClass = ResendImport?.Resend || ResendImport?.default || ResendImport || null;
} catch (e) {
  console.warn('Resend SDK not installed. Please run `npm install resend` in backend.');
}

const resendClient = ResendClass ? new ResendClass(process.env.RESEND_API_KEY) : null;

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message, createdAt } = req.body || {};

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Validation failed: name, email and message are required.' });
  }

  const submittedAt = createdAt || new Date().toISOString();

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.4;color:#111">
      <h2>New Contact Form Submission - PPES Website</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || 'N/A')}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || 'N/A')}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      <p><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
    </div>
  `;

  if (!resendClient) {
    console.error('Resend client not configured');
    return res.status(500).json({ success: false, message: 'Email service not configured.' });
  }

  try {
    await resendClient.emails.send({
      from: process.env.SENDER_EMAIL || 'no-reply@prarambhpath.org',
      to: process.env.RECIPIENT_EMAIL || 'prarambhpath4444@gmail.com',
      subject: 'New Contact Form Submission - PPES Website',
      html,
    });

    return res.json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = router;
