import React from 'react';
import { Section, Text, Button, Hr } from '@react-email/components';
import Layout from './layout.js';

/**
 * Email sent to admins when a new user awaits approval.
 * @param {{name?: string,email?: string,phone?: string,course?: string,plan?: string}} props
 */
export default function AdminApprovalEmail({ name = 'Unknown', email = 'Unavailable', phone = 'Unavailable', course = 'Unknown', plan = 'Not specified' }) {
  const appUrl = process.env.APP_URL || 'https://codedmastery.com';

  return React.createElement(Layout, null,
    React.createElement(Section, { style: { padding: '0 0 24px' } },
      React.createElement(Text, { style: { margin: 0, color: '#2563eb', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' } }, 'New user approval request'),
      React.createElement(Text, { style: { margin: '16px 0 0', fontSize: '28px', fontWeight: 700, color: '#0f172a' } }, 'A new registration is waiting for review'),
      React.createElement(Text, { style: { margin: '16px 0 0', fontSize: '16px', color: '#475569' } }, 'Review the details below and approve the user when ready.')
    ),
    React.createElement(Section, { style: { backgroundColor: '#f8fafc', borderRadius: '18px', padding: '24px', margin: '24px 0' } },
      React.createElement(Text, { style: { margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: 700 } }, 'User details'),
      React.createElement(Text, { style: { margin: '12px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'Name:'), ' ', name),
      React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'Email:'), ' ', email),
      React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'Phone:'), ' ', phone),
      React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'Course:'), ' ', course),
      React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '15px', color: '#475569' } }, React.createElement('strong', null, 'Plan:'), ' ', plan)
    ),
    React.createElement(Section, { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
      React.createElement(Text, { style: { margin: 0, color: '#0f172a', fontWeight: 700 } }, 'Status'),
      React.createElement(Text, { style: { margin: 0, color: '#2563eb', fontWeight: 700 } }, 'Waiting Approval')
    ),
    React.createElement(Hr, { style: { borderColor: '#e2e8f0', margin: '24px 0' } }),
    React.createElement(Section, null,
      React.createElement(Button, { href: appUrl, style: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, textDecoration: 'none' } }, 'Review registration')
    )
  );
}
