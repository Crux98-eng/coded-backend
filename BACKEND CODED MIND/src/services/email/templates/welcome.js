import React from 'react';
import { Section, Text, Button } from '@react-email/components';
import Layout from './layout.js';

/**
 * Welcome email template for new users.
 * @param {{name?: string}} props
 */
export default function WelcomeEmail({ name = 'there' }) {
  const appUrl = process.env.APP_URL || 'https://codedmastery.com';

  return React.createElement(Layout, null,
    React.createElement(Section, { style: { padding: '0 0 24px' } },
      React.createElement(Text, { style: { margin: 0, color: '#2563eb', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' } }, 'Welcome to Coded Mastery'),
      React.createElement(Text, { style: { margin: '16px 0 0', fontSize: '28px', fontWeight: 700, color: '#0f172a' } }, `Hi ${name}, welcome aboard.`),
      React.createElement(Text, { style: { margin: '16px 0 0', fontSize: '16px', color: '#475569' } }, 'Your learning journey begins today. Explore expert-led courses and grow your skills on the platform.')
    ),
    React.createElement(Section, { style: { textAlign: 'center' } },
      React.createElement(Button, { href: appUrl, style: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, textDecoration: 'none' } }, 'Explore courses')
    )
  );
}
