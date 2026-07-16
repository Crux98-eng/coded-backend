import resend from '../../config/resend.js';
import { render } from '@react-email/render';

// Build a reusable email sender that supports React templates and plain HTML.

/**
 * Send an email through Resend.
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email address or list of addresses.
 * @param {string} options.subject - Email subject line.
 * @param {import('react').ReactElement} [options.react] - React Email template element.
 * @param {string} [options.html] - Plain HTML content fallback.
 * @param {string} [options.from] - Optional custom sender address.
 * @returns {Promise<unknown>} - Resend email API response.
 */
export default async function sendEmail({ to, subject, react, html, from }) {
  const sender = from || process.env.EMAIL_FROM;

  if (!sender) {
    throw new Error('Missing environment variable: EMAIL_FROM');
  }

  const recipients = typeof to === 'string' ? [to] : Array.isArray(to) ? to : [];

  if (recipients.length === 0) {
    throw new Error('Invalid email recipient. Provide `to` as a string or non-empty array.');
  }

  const body = react ? render(react) : html;

  if (!body) {
    throw new Error('Email body is missing. Provide either `react` or `html`.');
  }

  try {
    return await resend.emails.send({
      from: sender,
      to: recipients,
      subject,
      html: body,
    });
  } catch (error) {
    const message = error?.message ?? String(error);
    throw new Error(`Email send failed for ${recipients.join(', ')}: ${message}`);
  }
}
