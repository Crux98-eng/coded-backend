import React from 'react';
import sendEmail from './sendEmail.js';
import AdminApprovalEmail from './templates/adminApproval.js';
import AccountApprovedEmail from './templates/accountApproved.js';
import InvoiceEmail from './templates/invoice.js';
import AccountBlockedEmail from './templates/accountBlocked.js';
import WelcomeEmail from './templates/welcome.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function resolvePayload(payload) {
  if (typeof payload === 'string') {
    return { email: payload };
  }

  return payload ?? {};
}

/**
 * Send the admin approval request email to the configured admin address.
 * @param {Object} user - Pending user information.
 * @returns {Promise<unknown>}
 */
export async function sendAdminApprovalEmail(user) {
  if (!ADMIN_EMAIL) {
    throw new Error('Missing environment variable: ADMIN_EMAIL');
  }

  const payload = user ?? {};

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: 'New user waiting approval',
    react: React.createElement(AdminApprovalEmail, {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      course: payload.course_name || payload.course,
      plan: payload.plan,
    }),
  });
}

/**
 * Notify the user that their account has been approved.
 * @param {string|Object} payload - User email or object with email and name.
 * @returns {Promise<unknown>}
 */
export async function sendUserApprovedEmail(payload) {
  const { email, name } = resolvePayload(payload);

  if (!email) {
    throw new Error('Missing recipient email for account approval email.');
  }

  return sendEmail({
    to: email,
    subject: 'Your account has been approved 🎉',
    react: React.createElement(AccountApprovedEmail, { name }),
  });
}

/**
 * Send an invoice email to a user.
 * @param {string|Object} payload - Recipient email or object with email, name, course, and amount.
 * @returns {Promise<unknown>}
 */
export async function sendUserInvoice(payload) {
  const { email, name, course, amount } = resolvePayload(payload);

  if (!email) {
    throw new Error('Missing recipient email for invoice email.');
  }

  return sendEmail({
    to: email,
    subject: 'Your invoice is ready',
    react: React.createElement(InvoiceEmail, { name, course, amount }),
  });
}

/**
 * Notify a user their account has been blocked.
 * @param {string|Object} payload - Recipient email or object with email and name.
 * @returns {Promise<unknown>}
 */
export async function sendUserEmailBlocking(payload) {
  const { email, name } = resolvePayload(payload);

  if (!email) {
    throw new Error('Missing recipient email for blocked account email.');
  }

  return sendEmail({
    to: email,
    subject: 'Your account has been blocked',
    react: React.createElement(AccountBlockedEmail, { name }),
  });
}

/**
 * Send a welcome email to a newly registered user.
 * @param {string|Object} payload - Recipient email or object with email and name.
 * @returns {Promise<unknown>}
 */
export async function sendWelcomeEmail(payload) {
  const { email, name } = resolvePayload(payload);

  if (!email) {
    throw new Error('Missing recipient email for welcome email.');
  }

  return sendEmail({
    to: email,
    subject: 'Welcome to our learning platform',
    react: React.createElement(WelcomeEmail, { name }),
  });
}
