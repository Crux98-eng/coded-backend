import dotenv from 'dotenv';
import { Resend } from 'resend';

// Load environment variables so the Resend client uses the configured API key.
dotenv.config();

const { RESEND_API_KEY } = process.env;

if (!RESEND_API_KEY) {
  throw new Error('Missing environment variable: RESEND_API_KEY');
}

const resend = new Resend(RESEND_API_KEY);

export default resend;
