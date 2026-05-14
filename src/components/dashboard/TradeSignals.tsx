'use client';
import React from 'react';
import type { Sleeve } from '@/lib/types';

interface Props {
  sleeves: Sleeve[];
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

const DIRECTION_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  BUY:    { bg: 'rgba(34,197,94,0.1)',  color: 'var(--success)', border: 'rgba(34,197,94,0.25)' },
  SELL:   { bg: 'rgba(212,100,90,0.1)', color: 'var(--coral)',   border: 'rgba(212,100,90,0.25)' },
  SHORT:  { bg: 'rgba(147,51,234,0.1)', color: '#9333ea',        border: 'rgba(147,51,234,0.25)' },
  COVER:  { bg: 'rgba(234,179,8,0.1)',  color: '#eab308',        border: 'rgba(234,179,8,0.25)' },
  DEPLOY: { bg: 'rgba(6,182,212,0.1)',  color: '#06b6d4',        border: 'rgba(6,182,212,0.25)' },
};

export const TradeSignals: React.FC<Props> = ({ sleeves }) => {
  const allHoldings = sleeves.flatMap(s =>
    s.holdings.map(h => ({ ...h, sleeveName: s.name }))
  );

  // Only show holdings that have a trade direction and rebalance amount
  const signals = allHoldings
    .filter(h => h.tradeDirection && h.tradeDirection !== '')
    .sort((a, b) => Math.abs(b.rebalanceAmount ?? 0) - Math.abs(a.rebalanceAmount ?? 0));

  if (signals.length === 0) return null;

  return (
    <div className="glass-card" style={{ marginBottom: '16px' }}>
      <div className="card-header">
        <div>
          <h2 className="card-title" style={{ color: 'var(--gold)' }}>
            Trade Signals & Rebalancing
          </h2>
          <p className="card-subtitle">
            Position-level action items — weight deviations & rebalance amounts
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ minWidth: '120px' }}>Holding</th>
              <th>Ticker</th>
              <th>Sleeve</th>
              <th style={{ textAlign: 'center' }}>Direction</th>
              <th style={{ textAlign: 'right' }}>Daily</th>
              <th style={{ textAlign: 'right' }}>Weight Dev</th>
              <th style={{ textAlign: 'right' }}>Rebalance Amt</th>
              <th style={{ textAlign: 'right' }}>Current Value</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((h, i) => {
              const dir = h.tradeDirection ?? '';
              const style = DIRECTION_STYLES[dir] || DIRECTION_STYLES['BUY'];
              return (
                <tr key={i}>
                  <td>
                    <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
                      {h.name.length > 28 ? h.name.slice(0, 26) + '…' : h.name}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono font-bold text-[12px]" style={{ color: 'var(--steel-blue)' }}>
                      {h.ticker}
                    </span>
                  </td>
                  <td>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {h.sleeveName}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                    >
                      {dir}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="font-mono text-[11px]" style={{
                      color: (h.dailyReturn ?? 0) >= 0 ? 'var(--success)' : 'var(--coral)'
                    }}>
                      {fmtPct(h.dailyReturn ?? 0)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="font-mono text-[11px] font-semibold" style={{
                      color: (h.weightDeviation ?? 0) >= 0 ? 'var(--success)' : 'var(--coral)'
                    }}>
                      {fmtPct(h.weightDeviation ?? 0)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="font-mono text-[11px] font-bold" style={{
                      color: (h.rebalanceAmount ?? 0) >= 0 ? 'var(--coral)' : 'var(--success)'
                    }}>
                      {fmt(h.rebalanceAmount ?? 0)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      {fmt(h.liveValue ?? 0)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
