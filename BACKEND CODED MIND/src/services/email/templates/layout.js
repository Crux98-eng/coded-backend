import React from 'react';
import { Html, Body, Container, Section, Text } from '@react-email/components';

/**
 * Shared email layout used by every message.
 * @param {{children: React.ReactNode}} props
 */
export default function Layout({ children }) {
  const appUrl = process.env.APP_URL || 'https://codedmastery.example.com';
  const appName = process.env.APP_NAME || 'Coded Mastery';
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@example.com';
  const year = new Date().getFullYear();

  return React.createElement(Html, null,
    React.createElement(Body, { style: { margin: 0, padding: 0, backgroundColor: '#eef2ff', fontFamily: 'Inter, system-ui, sans-serif' } },
      React.createElement(Container, { style: { width: '100%', maxWidth: '680px', margin: '0 auto', padding: '24px 16px' } },
        React.createElement(Section, { style: { backgroundColor: '#2563eb', padding: '24px 32px', borderRadius: '24px 24px 0 0' } },
          React.createElement(Text, { style: { color: '#ffffff', fontSize: '24px', fontWeight: 700, margin: 0 } }, appName)
        ),
        React.createElement(Section, { style: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '0 0 24px 24px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' } }, children),
        React.createElement(Section, { style: { backgroundColor: '#f8fafc', padding: '20px 24px', borderRadius: '20px', marginTop: '16px', textAlign: 'center' } },
          React.createElement(Text, { style: { margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' } }, appName),
          React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '13px', color: '#64748b' } },
            `${year} • `,
            React.createElement('a', { href: appUrl, style: { color: '#2563eb', textDecoration: 'none' } }, appUrl)
          ),
          React.createElement(Text, { style: { margin: '8px 0 0', fontSize: '13px', color: '#64748b' } },
            'Support: ',
            React.createElement('a', { href: `mailto:${supportEmail}`, style: { color: '#2563eb', textDecoration: 'none' } }, supportEmail)
          ),
          React.createElement(Text, { style: { margin: '12px 0 0', fontSize: '12px', color: '#94a3b8' } }, 'Powered by CODED MASTERY TECH')
        )
      )
    )
  );
}
