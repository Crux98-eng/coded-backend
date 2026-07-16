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
    console.debug('[mailing wrapper] importing ESM service at', esmPath);
    emailServicePromise = import(esmPath).catch(err => {
      console.error('[mailing wrapper] failed to import ESM email service', err);
      throw err;
    });
  }

  return emailServicePromise;
}

async function safeCall(methodName, payload) {
  try {
    console.debug('[mailing wrapper] calling', methodName, 'with payload', payload ? (typeof payload === 'object' ? JSON.stringify(payload) : payload) : null);
    const service = await getEmailService();
    const result = await service[methodName](payload);
    console.debug('[mailing wrapper] result', methodName, result);
    return result;
  } catch (error) {
    const message = error?.message ?? String(error);
    console.error(`[mailing wrapper] Email service error (${methodName}):`, {
      message,
      stack: error?.stack,
    });
    // Return a structured error object so callers won't throw unexpectedly.
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
