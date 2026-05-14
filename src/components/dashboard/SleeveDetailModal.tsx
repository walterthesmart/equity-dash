'use client';
import React from 'react';
import type { Sleeve, SleeveClassification } from '@/lib/types';
import { MONTH_LABELS } from '@/data/equityConstants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sleeve: Sleeve | null;
  classification: SleeveClassification | null;
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export const SleeveDetailModal: React.FC<Props> = ({ isOpen, onClose, sleeve, classification }) => {
  if (!isOpen || !sleeve) return null;

  const catColor = classification?.color || 'var(--text-primary)';
  const catLabel = classification?.category?.toUpperCase() || '';

  // Find best/worst holdings
  const sorted = [...sleeve.holdings].sort((a, b) => b.ytdReturn - a.ytdReturn);
  const bestHolding = sorted[0];
  const worstHolding = sorted[sorted.length - 1];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md transition-opacity"
      onClick={onClose}
      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.15) transparent" }}
    >
      <div className="flex items-start justify-center min-h-full p-4 py-8">
      <div 
        className="glass-card relative flex flex-col p-6 max-w-6xl w-full mx-4 shadow-2xl"
        style={{
          border: "1px solid var(--glass-border)",
          background: "var(--bg-gradient-2)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ background: catColor, boxShadow: `0 0 12px ${catColor}` }} />
            <h2 className="text-2xl font-bold tracking-wide text-[var(--text-primary)] uppercase">
              {sleeve.name}
            </h2>
            <span className="status-badge" style={{ background: `${catColor}20`, color: catColor }}>
              {catLabel}
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-sm">
            {sleeve.holdings.length} holding{sleeve.holdings.length > 1 ? 's' : ''} • 
            Weight: {sleeve.totalWeight}% • 
            Beta: {sleeve.weightedBeta >= 0 ? '+' : ''}{sleeve.weightedBeta.toFixed(2)} •
            Notional: {fmt(sleeve.totalNotional)}
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/20 rounded-xl p-4 border border-white/5 text-center">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Total P&L</div>
            <div className="font-mono font-bold text-lg" style={{ color: sleeve.totalPnl >= 0 ? 'var(--success)' : 'var(--coral)' }}>
              {fmt(sleeve.totalPnl)}
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/5 text-center">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">YTD Return</div>
            <div className="font-mono font-bold text-lg" style={{ color: sleeve.ytdReturn >= 0 ? 'var(--success)' : 'var(--coral)' }}>
              {fmtPct(sleeve.ytdReturn)}
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/5 text-center">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Best Holding</div>
            <div className="font-mono font-bold text-sm text-[var(--success)]">{bestHolding.ticker}</div>
            <div className="font-mono text-[11px] text-[var(--success)]">{fmtPct(bestHolding.ytdReturn)}</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/5 text-center">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Worst Holding</div>
            <div className="font-mono font-bold text-sm text-[var(--coral)]">{worstHolding.ticker}</div>
            <div className="font-mono text-[11px] text-[var(--coral)]">{fmtPct(worstHolding.ytdReturn)}</div>
          </div>
        </div>

        {/* Holdings table */}
        <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-black/40 border-b border-white/10">
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest">Security</th>
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest">Ticker</th>
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest text-right">Weight</th>
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest text-right">Beta</th>
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest text-right">Shares</th>
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest text-right">Entry</th>
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest text-right">Current</th>
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest text-right">P&L</th>
                  <th className="p-3 text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest text-right">YTD</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sleeve.holdings.map((h, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 font-medium text-[var(--text-primary)]">{h.name}</td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-[var(--steel-blue)]">{h.ticker}</span>
                    </td>
                    <td className="p-3 text-right font-mono text-[var(--text-muted)]">{h.weight.toFixed(2)}%</td>
                    <td className="p-3 text-right font-mono text-[var(--text-muted)]">{h.beta.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-[var(--text-muted)]">{h.shares.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-[var(--text-muted)]">${h.entryPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-[var(--text-primary)]">${h.currentPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-semibold" style={{
                      color: h.pnl >= 0 ? 'var(--success)' : 'var(--coral)'
                    }}>
                      {fmt(h.pnl)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold" style={{
                      color: h.ytdReturn >= 0 ? 'var(--success)' : 'var(--coral)'
                    }}>
                      {fmtPct(h.ytdReturn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Returns mini chart */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <h3 className="text-[var(--gold)] font-bold text-xs uppercase tracking-widest mb-4">Monthly Returns</h3>
          <div className="flex items-end gap-1.5 h-20">
            {sleeve.monthlyReturns.slice(0, 6).map((val, mi) => {
              const maxAbs = Math.max(...sleeve.monthlyReturns.map(Math.abs), 1);
              const heightPct = (Math.abs(val) / maxAbs) * 100;
              const isPositive = val >= 0;
              const isActive = val !== 0;

              return (
                <div key={mi} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative" style={{ height: "60px" }}>
                    {isActive && (
                      <div 
                        className="absolute bottom-0 w-full rounded-t transition-all duration-500"
                        style={{
                          height: `${Math.max(heightPct, 5)}%`,
                          background: isPositive
                            ? 'linear-gradient(to top, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.6))'
                            : 'linear-gradient(to top, rgba(212, 100, 90, 0.3), rgba(212, 100, 90, 0.6))',
                          boxShadow: isPositive
                            ? '0 0 8px rgba(34, 197, 94, 0.2)'
                            : '0 0 8px rgba(212, 100, 90, 0.2)',
                        }}
                      />
                    )}
                  </div>
                  <span className="text-[9px] font-mono" style={{
                    color: !isActive ? 'var(--text-muted)' : isPositive ? 'var(--success)' : 'var(--coral)'
                  }}>
                    {isActive ? `${val > 0 ? '+' : ''}${val.toFixed(1)}` : '—'}
                  </span>
                  <span className="text-[8px] text-[var(--text-muted)] uppercase">{MONTH_LABELS[mi]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
