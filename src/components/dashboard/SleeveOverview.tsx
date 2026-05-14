'use client';
import React from 'react';
import type { Sleeve, SleeveClassification } from '@/lib/types';

interface Props {
  sleeves: Sleeve[];
  classifications: SleeveClassification[];
  onSleeveClick: (index: number) => void;
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export const SleeveOverview: React.FC<Props> = ({ sleeves, classifications, onSleeveClick }) => {
  return (
    <div className="glass-card table-card">
      <div className="card-header">
        <div>
          <h2 className="card-title" style={{ color: "var(--gold)" }}>Sleeve Allocation</h2>
          <p className="card-subtitle">9 thematic sleeves across core, tactical, protective & hedge buckets</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sleeve</th>
              <th style={{ textAlign: "center" }}>Category</th>
              <th style={{ textAlign: "right" }}>Weight</th>
              <th style={{ textAlign: "right" }}>Notional</th>
              <th style={{ textAlign: "right" }}>P&L</th>
              <th style={{ textAlign: "right" }}>YTD</th>
              <th style={{ textAlign: "center" }}>β</th>
            </tr>
          </thead>
          <tbody>
            {sleeves.map((sleeve, i) => {
              const cls = classifications.find(c => c.sleeve === sleeve.name);
              const catLabel = cls?.category?.toUpperCase() || '—';
              const catColor = cls?.color || 'var(--text-muted)';

              return (
                <tr 
                  key={i} 
                  className="cursor-pointer group"
                  onClick={() => onSleeveClick(i)}
                  style={{ transition: "all 0.2s ease" }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                        style={{ background: catColor, boxShadow: `0 0 8px ${catColor}40` }}
                      />
                      <div>
                        <div className="font-medium text-[var(--text-primary)] text-[13px] group-hover:text-white transition-colors">
                          {sleeve.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          {sleeve.holdings.length} holding{sleeve.holdings.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className="status-badge" style={{
                      background: `${catColor}20`,
                      color: catColor,
                      fontSize: "10px",
                      minWidth: "70px",
                      justifyContent: "center",
                    }}>
                      {catLabel}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="font-mono text-[13px] text-[var(--text-primary)]">
                      {sleeve.totalWeight.toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="font-mono text-[13px] text-[var(--text-muted)]">
                      {fmt(sleeve.totalNotional)}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="font-mono text-[13px] font-semibold" style={{
                      color: sleeve.totalPnl >= 0 ? 'var(--success)' : 'var(--coral)'
                    }}>
                      {fmt(sleeve.totalPnl)}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="font-mono text-[13px] font-bold" style={{
                      color: sleeve.ytdReturn >= 0 ? 'var(--success)' : 'var(--coral)'
                    }}>
                      {fmtPct(sleeve.ytdReturn)}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className="font-mono text-[12px] px-2 py-0.5 rounded" style={{
                      background: "var(--glass-bg)",
                      color: Math.abs(sleeve.weightedBeta) > 0.1 ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}>
                      {sleeve.weightedBeta >= 0 ? '+' : ''}{sleeve.weightedBeta.toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer totals */}
          <tfoot>
            <tr style={{ borderTop: "2px solid var(--glass-border)" }}>
              <td className="font-bold text-[var(--gold)] text-[13px]">Total Portfolio</td>
              <td></td>
              <td style={{ textAlign: "right" }}>
                <span className="font-mono font-bold text-[var(--gold)] text-[13px]">100%</span>
              </td>
              <td style={{ textAlign: "right" }}>
                <span className="font-mono font-bold text-[var(--gold)] text-[13px]">
                  {fmt(sleeves.reduce((s, sl) => s + sl.totalNotional, 0))}
                </span>
              </td>
              <td style={{ textAlign: "right" }}>
                <span className="font-mono font-bold text-[13px]" style={{
                  color: sleeves.reduce((s, sl) => s + sl.totalPnl, 0) >= 0 ? 'var(--success)' : 'var(--coral)'
                }}>
                  {fmt(sleeves.reduce((s, sl) => s + sl.totalPnl, 0))}
                </span>
              </td>
              <td style={{ textAlign: "right" }}>
                <span className="font-mono font-bold text-[13px]" style={{ color: 'var(--gold)' }}>
                  {fmtPct(sleeves.reduce((s, sl) => s + sl.ytdReturn * (sl.totalWeight / 100), 0))}
                </span>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
