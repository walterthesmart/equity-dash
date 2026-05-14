'use client';
import React from 'react';
import type { PortfolioSummary, Sleeve } from '@/lib/types';

interface Props {
  summary: PortfolioSummary;
  sleeves: Sleeve[];
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export const TopStatsGrid: React.FC<Props> = ({ summary, sleeves }) => {
  const totalPnl = summary.unrealizedPnl;
  const bestSleeve = sleeves.reduce((best, sl) => sl.ytdReturn > best.ytdReturn ? sl : best, sleeves[0]);
  const totalHoldings = sleeves.reduce((s, sl) => s + sl.holdings.length, 0);
  const alpha = summary.ytdReturn - summary.benchmarkReturn;

  return (
    <section className="stats-grid mb-8 stagger-children">
      {/* 1. Live Value */}
      <div className="glass-card glass-card-3d stat-card">
        <div className="stat-card-inner">
          <div className="stat-info">
            <h3>Live Value</h3>
            <div className="stat-value text-2xl">{fmt(summary.liveValue)}</div>
            <span className={`stat-change ${(summary.dailyReturn || 0) >= 0 ? 'positive' : 'negative'}`}>
              {fmtPct(summary.dailyReturn || 0)} Daily
            </span>
          </div>
          <div className="stat-icon cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Unrealized P&L */}
      <div className="glass-card glass-card-3d stat-card">
        <div className="stat-card-inner">
          <div className="stat-info">
            <h3>Unrealized P&L</h3>
            <div className="stat-value text-2xl" style={{ 
              WebkitTextFillColor: totalPnl >= 0 ? 'var(--success)' : 'var(--coral)' 
            }}>
              {fmt(totalPnl)}
            </div>
            <span className={`stat-change ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
              {totalHoldings} Holdings · {sleeves.length} Sleeves
            </span>
          </div>
          <div className={`stat-icon ${totalPnl >= 0 ? 'success' : 'purple'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Portfolio Beta */}
      <div className="glass-card glass-card-3d stat-card">
        <div className="stat-card-inner">
          <div className="stat-info">
            <h3>Portfolio Beta</h3>
            <div className="stat-value text-2xl">{summary.totalBeta.toFixed(2)}</div>
            <span className="stat-change" style={{ 
              background: 'rgba(196, 169, 90, 0.15)', 
              color: 'var(--gold)' 
            }}>
              S&P Vol: {summary.spVolatility}%
            </span>
          </div>
          <div className="stat-icon magenta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* 4. ITD Return */}
      <div className="glass-card glass-card-3d stat-card">
        <div className="stat-card-inner">
          <div className="stat-info">
            <h3>ITD Return</h3>
            <div className="stat-value text-2xl" style={{ WebkitTextFillColor: (summary.itdReturn || summary.ytdReturn) >= 0 ? 'var(--success)' : 'var(--coral)' }}>
              {fmtPct(summary.itdReturn || summary.ytdReturn)}
            </div>
            <span className={`stat-change ${(summary.itdReturn || summary.ytdReturn) >= 0 ? 'positive' : 'negative'}`}>
              Inception to Date
            </span>
          </div>
          <div className="stat-icon cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* 5. YTD Return */}
      <div className="glass-card glass-card-3d stat-card">
        <div className="stat-card-inner">
          <div className="stat-info">
            <h3>YTD Return</h3>
            <div className="stat-value text-2xl" style={{ WebkitTextFillColor: summary.ytdReturn >= 0 ? 'var(--success)' : 'var(--coral)' }}>
              {fmtPct(summary.ytdReturn)}
            </div>
            <span className={`stat-change ${summary.ytdReturn >= 0 ? 'positive' : 'negative'}`}>
              Year to Date
            </span>
          </div>
          <div className="stat-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* 6. MTD Return */}
      <div className="glass-card glass-card-3d stat-card">
        <div className="stat-card-inner">
          <div className="stat-info">
            <h3>MTD Return</h3>
            <div className="stat-value text-2xl" style={{ WebkitTextFillColor: (summary.mtdReturn || 0) >= 0 ? 'var(--success)' : 'var(--coral)' }}>
              {fmtPct(summary.mtdReturn || 0)}
            </div>
            <span className={`stat-change ${(summary.mtdReturn || 0) >= 0 ? 'positive' : 'negative'}`}>
              Month to Date
            </span>
          </div>
          <div className="stat-icon magenta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
