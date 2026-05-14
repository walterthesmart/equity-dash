'use client';
import React from 'react';
import type { Sleeve } from '@/lib/types';
import { MONTH_LABELS } from '@/data/equityConstants';

interface Props {
  sleeves: Sleeve[];
  portfolioMonthly: number[];
}

const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export const MonthlyReturnsGrid: React.FC<Props> = ({ sleeves, portfolioMonthly }) => {
  // Only show months that have data (non-zero)
  const activeMonths = portfolioMonthly.reduce((count, val, idx) => val !== 0 || idx < count ? idx + 1 : count, 0);
  const displayMonths = Math.max(activeMonths, 5); // show at least 5

  return (
    <div className="glass-card table-card">
      <div className="card-header">
        <div>
          <h2 className="card-title" style={{ color: "var(--steel-blue)" }}>Monthly Returns</h2>
          <p className="card-subtitle">Sleeve-level performance attribution by month</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table" style={{ fontSize: "12px" }}>
          <thead>
            <tr>
              <th style={{ minWidth: "160px" }}>Sleeve</th>
              {Array.from({ length: displayMonths }, (_, i) => (
                <th key={i} style={{ textAlign: "center", minWidth: "60px" }}>{MONTH_LABELS[i]}</th>
              ))}
              <th style={{ textAlign: "right", minWidth: "70px" }}>YTD</th>
            </tr>
          </thead>
          <tbody>
            {sleeves.map((sleeve, si) => (
              <tr key={si}>
                <td>
                  <span className="font-medium text-[var(--text-primary)] text-[12px]">{sleeve.name}</span>
                </td>
                {Array.from({ length: displayMonths }, (_, mi) => {
                  const val = sleeve.monthlyReturns[mi] || 0;
                  const isActive = val !== 0;
                  // Heat-map color intensity
                  const intensity = Math.min(Math.abs(val) / 20, 1);
                  const bg = !isActive ? 'transparent' :
                    val >= 0 
                      ? `rgba(34, 197, 94, ${0.1 + intensity * 0.25})`
                      : `rgba(212, 100, 90, ${0.1 + intensity * 0.25})`;
                  const color = !isActive ? 'var(--text-muted)' : val >= 0 ? 'var(--success)' : 'var(--coral)';

                  return (
                    <td key={mi} style={{ textAlign: "center", padding: "8px 4px" }}>
                      <span 
                        className="font-mono text-[11px] px-1.5 py-0.5 rounded inline-block min-w-[48px]"
                        style={{ background: bg, color }}
                      >
                        {isActive ? fmtPct(val) : '—'}
                      </span>
                    </td>
                  );
                })}
                <td style={{ textAlign: "right" }}>
                  <span className="font-mono font-bold text-[12px]" style={{
                    color: sleeve.ytdReturn >= 0 ? 'var(--success)' : 'var(--coral)'
                  }}>
                    {fmtPct(sleeve.ytdReturn)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Portfolio total row */}
          <tfoot>
            <tr style={{ borderTop: "2px solid var(--glass-border)" }}>
              <td className="font-bold text-[var(--gold)] text-[12px]">Portfolio</td>
              {Array.from({ length: displayMonths }, (_, mi) => {
                const val = portfolioMonthly[mi] || 0;
                const isActive = val !== 0;
                const intensity = Math.min(Math.abs(val) / 10, 1);
                const bg = !isActive ? 'transparent' :
                  val >= 0 
                    ? `rgba(34, 197, 94, ${0.15 + intensity * 0.3})`
                    : `rgba(212, 100, 90, ${0.15 + intensity * 0.3})`;
                const color = !isActive ? 'var(--text-muted)' : val >= 0 ? 'var(--success)' : 'var(--coral)';

                return (
                  <td key={mi} style={{ textAlign: "center", padding: "8px 4px" }}>
                    <span 
                      className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded inline-block min-w-[48px]"
                      style={{ background: bg, color }}
                    >
                      {isActive ? fmtPct(val) : '—'}
                    </span>
                  </td>
                );
              })}
              <td style={{ textAlign: "right" }}>
                <span className="font-mono font-bold text-[13px]" style={{ color: 'var(--gold)' }}>
                  {fmtPct(portfolioMonthly.reduce((s, v) => s + v, 0))}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
