'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SankoreLogo } from '../shared/SankoreLogo';
import { useTheme } from '../shared/ThemeProvider';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Q2 Actual',
    sublabel: 'Live Portfolio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    path: '/deliberation',
    label: 'Deliberation',
    sublabel: 'Portfolio Modeler',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
        <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
];

/* Sun icon for light mode */
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

/* Moon icon for dark mode */
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 py-6 px-3"
      style={{
        width: '220px',
        minWidth: '220px',
        background: theme === 'dark' ? 'rgba(10, 18, 36, 0.85)' : 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--glass-border)',
        transition: 'background 0.35s ease',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <SankoreLogo size={36} />
        <div>
          <div className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>Sankore</div>
          <div className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>T-01 Equity</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group no-underline"
              style={{
                background: isActive ? 'rgba(196, 169, 90, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(196, 169, 90, 0.25)' : '1px solid transparent',
                textDecoration: 'none',
              }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(196, 169, 90, 0.25), rgba(196, 169, 90, 0.08))'
                    : 'var(--glass-bg)',
                  color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 4px 12px rgba(196, 169, 90, 0.15)' : 'none',
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  className="text-[13px] font-semibold transition-colors"
                  style={{ color: isActive ? 'var(--gold)' : 'var(--text-secondary)' }}
                >
                  {item.label}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {item.sublabel}
                </div>
              </div>
              {/* Active indicator */}
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-6 rounded-full"
                  style={{ background: 'var(--gold)', boxShadow: '0 0 8px rgba(196, 169, 90, 0.4)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-1 mb-2">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 pt-4 border-t border-white/5">
        <div className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Deliberation v1.1<br />
          Sankore Investments
        </div>
      </div>
    </aside>
  );
};
