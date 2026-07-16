import React from 'react';
import { Section, Text, Button } from '@react-email/components';
import Layout from './layout.js';

/**
 * Email template for users whose account has been approved.
 * @param {{name?: string}} props
 */
export default function AccountApprovedEmail({ name = 'there' }) {
  const appUrl = process.env.APP_URL || 'https://codedmastery.example.com';

  return React.createElement(Layout, null,
    React.createElement(Section, { style: { textAlign: 'center', padding: '0 0 24px' } },
      React.createElement(Text, { style: { margin: 0, fontSize: '18px', color: '#10b981', fontWeight: 700 } }, '✅ Account approved'),
      React.createElement(Text, { style: { margin: '16px 0 0', fontSize: '28px', fontWeight: 700, color: '#0f172a' } }, `Welcome aboard, ${name}!`),
      React.createElement(Text, { style: { margin: '16px 0 0', fontSize: '16px', color: '#475569' } }, 'Your account is now active. Log in to continue learning and access your courses.')
    ),
    React.createElement(Section, { style: { textAlign: 'center' } },
      React.createElement(Button, { href: appUrl, style: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, textDecoration: 'none' } }, 'Log in to your dashboard')
    )
  );
}
