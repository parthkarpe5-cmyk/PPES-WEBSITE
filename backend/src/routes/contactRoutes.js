const express = require('express');
const router = express.Router();

// Initialize Resend client asynchronously on first use
let resendClient = null;
let resendInitialized = false;

async function initializeResend() {
  if (resendInitialized) return;
  
  try {
    // Use dynamic import to load the ESM module from CommonJS
    const ResendImport = await import('resend');
    // Get the default export (the Resend class)
    const Resend = ResendImport.default;
    resendClient = new Resend(process.env.RESEND_API_KEY);
    resendInitialized = true;
  } catch (e) {
    console.error('Failed to initialize Resend:', e.message);
    resendInitialized = true; // Set to true so we don't keep trying
  }
}

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

  // Initialize Resend if not already done
  if (!resendInitialized) {
    await initializeResend();
  }

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
