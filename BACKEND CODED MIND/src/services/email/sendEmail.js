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
  const rawSender = from ?? process.env.EMAIL_FROM;
  const sender = typeof rawSender === 'string' ? rawSender.trim().replace(/^"|"$/g, '').trim() : rawSender;

  if (!sender) {
    console.error('[email] missing or empty EMAIL_FROM', { rawSender });
    throw new Error('Missing environment variable: EMAIL_FROM');
  }

  const senderPattern = /^([^<>]+<[^<>\s]+@[^<>\s]+\.[^<>\s]+>|[^<>\s]+@[^<>\s]+\.[^<>\s]+)$/;
  if (!senderPattern.test(sender)) {
    console.error('[email] invalid from format', { rawSender, sender });
    throw new Error('Invalid EMAIL_FROM format. Expected `email@example.com` or `Name <email@example.com>`.');
  }

  const recipients = typeof to === 'string' ? [to] : Array.isArray(to) ? to : [];

  if (recipients.length === 0) {
    console.error('[email] invalid recipients', { to });
    throw new Error('Invalid email recipient. Provide `to` as a string or non-empty array.');
  }

  // Render React template if provided, otherwise use provided HTML.
  let body;
  try {
    if (react) {
      body = render(react);
    } else {
      body = html;
    }
  } catch (renderError) {
    console.error('[email] render error', renderError);
    throw new Error(`Email render failed: ${renderError?.message ?? String(renderError)}`);
  }

  if (!body) {
    console.error('[email] empty body after render/fallback');
    throw new Error('Email body is missing. Provide either `react` or `html`.');
  }

  // Debug log: small preview and metadata
  try {
    console.debug('[email] send payload', {
      from: sender,
      to: recipients,
      subject,
      bodyPreview: typeof body === 'string' ? `${body.slice(0, 240)}${body.length > 240 ? '...' : ''}` : undefined,
    });
  } catch (logErr) {
    console.error('[email] logging failed', logErr);
  }

  try {
    const response = await resend.emails.send({
      from: sender,
      to: recipients,
      subject,
      html: body,
    });

    // Informational log of success with limited details.
    try {
      console.info('[email] sent', { to: recipients, subject, id: response?.id ?? null });
    } catch (infoErr) {
      console.info('[email] sent (logging failed)');
    }

    return response;
  } catch (error) {
    // Detailed error logging for troubleshooting.
    console.error('[email] send error', {
      to: recipients,
      subject,
      message: error?.message ?? String(error),
      stack: error?.stack,
      data: error?.response ?? error?.body ?? null,
    });

    const message = error?.message ?? String(error);
    throw new Error(`Email send failed for ${recipients.join(', ')}: ${message}`);
  }
}
