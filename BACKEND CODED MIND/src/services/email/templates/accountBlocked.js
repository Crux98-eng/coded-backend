import React from 'react';
import { Section, Text, Button } from '@react-email/components';
import Layout from './layout.js';

/**
 * Email template for users whose account has been blocked.
 * @param {{name?: string}} props
 */
export default function AccountBlockedEmail({ name = 'there' }) {
  const appUrl = process.env.APP_URL || 'https://codedmastery.example.com';
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@example.com';

  return React.createElement(Layout, null,
    React.createElement(Section, { style: { textAlign: 'center', padding: '0 0 24px' } },
      React.createElement(Text, { style: { margin: 0, fontSize: '18px', color: '#ef4444', fontWeight: 700 } }, 'Account disabled'),
      React.createElement(Text, { style: { margin: '16px 0 0', fontSize: '28px', fontWeight: 700, color: '#0f172a' } }, `Hi ${name}, your subscription has expired`),
      React.createElement(Text, { style: { margin: '16px 0 0', fontSize: '16px', color: '#475569' } }, 'Your account has been temporarily disabled. Renew now to restore access and continue learning.')
    ),
    React.createElement(Section, { style: { backgroundColor: '#fef2f2', borderRadius: '18px', padding: '24px', margin: '24px 0', border: '1px solid #fecaca' } },
      React.createElement(Text, { style: { margin: 0, fontSize: '15px', color: '#991b1b' } }, 'Subscription expired'),
      React.createElement(Text, { style: { margin: '10px 0 0', fontSize: '15px', color: '#475569' } }, 'Your subscription has lapsed and account access is now locked.'),
      React.createElement(Text, { style: { margin: '10px 0 0', fontSize: '15px', color: '#475569' } }, 'Please contact support to resolve your account or renew your plan.')
    ),
    React.createElement(Section, { style: { textAlign: 'center' } },
      React.createElement(Button, { href: appUrl, style: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, textDecoration: 'none' } }, 'Renew subscription')
    ),
    React.createElement(Section, { style: { marginTop: '24px' } },
      React.createElement(Text, { style: { margin: 0, fontSize: '15px', color: '#475569' } }, 'Need help? Email ', React.createElement('a', { href: `mailto:${supportEmail}`, style: { color: '#2563eb', textDecoration: 'none' } }, supportEmail), '.')
    )
  );
}
