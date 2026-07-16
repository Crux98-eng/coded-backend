const { join } = require('path');
const { pathToFileURL } = require('url');

/**
 * Lazily import the ESM email service implementation.
 * This wrapper preserves the existing CommonJS interface used by routes.
 */
let emailServicePromise = null;

function getEmailService() {
  if (!emailServicePromise) {
    const esmPath = pathToFileURL(join(__dirname, '../src/services/email/index.js')).href;
    emailServicePromise = import(esmPath);
  }

  return emailServicePromise;
}

async function safeCall(methodName, payload) {
  try {
    const service = await getEmailService();
    return await service[methodName](payload);
  } catch (error) {
    const message = error?.message ?? String(error);
    console.error(`Email service error (${methodName}):`, message);
    return { success: false, error: message };
  }
}

module.exports = {
  sendAdminApprovalEmail: async (payload) => safeCall('sendAdminApprovalEmail', payload),
  sendUserApprovedEmail: async (payload) => safeCall('sendUserApprovedEmail', payload),
  sendUserInvoice: async (payload) => safeCall('sendUserInvoice', payload),
  sendUserEmailBlocking: async (payload) => safeCall('sendUserEmailBlocking', payload),
  sendWelcomeEmail: async (payload) => safeCall('sendWelcomeEmail', payload),
};
