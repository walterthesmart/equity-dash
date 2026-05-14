import type { Metadata } from 'next';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sankore T-01 — Equity Model',
  description: 'Live portfolio dashboard — Q2 Actual',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AnimatedBackground />
          <div className="dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1, padding: '30px', maxWidth: '1400px' }}>
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
