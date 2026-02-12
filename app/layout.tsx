import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'GRC Lite',
  description: 'GRC Lite MVP for ISO 27001/27002 and PCI DSS basics'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
