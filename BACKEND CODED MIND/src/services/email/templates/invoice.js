import React from 'react';
import { Section, Text, Button, Hr } from '@react-email/components';
import Layout from './layout.js';

/**
 * Invoice email template for payment requests.
 * @param {{name?: string,course?: string,amount?: string}} props
 */
export default function InvoiceEmail({ name = 'Student', course = 'Selected course', amount = process.env.PAYMENT_AMOUNT || 'K150' }) {
  const airtelMoney = process.env.AIRTEL_MONEY || '0775793777';
  const mtnMoney = process.env.MTN_MONEY || '+260760067551';
  const whatsappNumber = process.env.WHATSAPP_NUMBER || '260760067551';
  const supportEmail = process.env.SUPPORT_EMAIL || 'sakalaeric87@gmail.com';
  const appUrl = process.env.APP_URL || 'https://codedmastery.com';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  return React.createElement(Layout, null,
    React.createElement(Section, { style: { padding: '0 0 24px' } },
      React.createElement(Text, { style: { margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' } }, 'Invoice ready for payment'),
      React.createElement(Text, { style: { margin: '16px 0 0', color: '#475569' } }, `Hi ${name}, please complete your payment to activate your course access.`)
    ),
    React.createElement(Section, { style: { backgroundColor: '#f8fafc', borderRadius: '18px', padding: '24px', margin: '24px 0' } },
      React.createElement(Text, { style: { margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: 700 } }, 'Invoice details'),
      React.createElement(Text, { style: { margin: '12px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'Course:'), ` ${course}`),
      React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'Amount:'), ` ${amount}`),
      React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'Airtel Money:'), ` ${airtelMoney}`),
      React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'MTN Money:'), ` ${mtnMoney}`)
    ),
    React.createElement(Section, { style: { textAlign: 'center' } },
      React.createElement(Button, { href: whatsappLink, style: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, textDecoration: 'none', marginBottom: '16px' } }, 'Contact via WhatsApp'),
      React.createElement(Text, { style: { margin: '16px 0 0', color: '#475569' } }, 'If you have questions, email ', React.createElement('a', { href: `mailto:${supportEmail}`, style: { color: '#2563eb', textDecoration: 'none' } }, supportEmail), '.')
    ),
    React.createElement(Hr, { style: { borderColor: '#e2e8f0', margin: '24px 0' } }),
    React.createElement(Section, null,
      React.createElement(Text, { style: { margin: 0, color: '#475569' } }, 'Thank you for choosing Coded Mastery. We look forward to supporting your learning journey.'),
      React.createElement(Button, { href: appUrl, style: { backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, textDecoration: 'none', marginTop: '20px' } }, 'View platform')
    )
  );
}
