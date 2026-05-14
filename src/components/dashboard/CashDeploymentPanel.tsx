'use client';
import React from 'react';
import type { PortfolioSummary, Sleeve } from '@/lib/types';

interface Props {
  summary: PortfolioSummary;
  sleeves: Sleeve[];
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export const CashDeploymentPanel: React.FC<Props> = ({ summary, sleeves }) => {
  const cashValue = summary.cashValue ?? 0;
  const investedCapital = summary.investedCapital ?? (summary.totalValue - cashValue);
  const cashPct = summary.cashPercent ?? (cashValue / summary.totalValue * 100);
  const investedPct = 100 - cashPct;
  const totalRealizedPnl = summary.totalRealizedPnl ?? 0;
  const unrealizedPnl = summary.unrealizedPnl;
  const totalPnl = unrealizedPnl + totalRealizedPnl;
  const winCount = summary.winCount ?? 0;
  const lossCount = summary.lossCount ?? 0;
  const totalPositions = winCount + lossCount;
  const winRate = totalPositions > 0 ? (winCount / totalPositions * 100) : 0;

  // Gather all trade signals
  const allHoldings = sleeves.flatMap(s =>
    s.holdings.map(h => ({ ...h, sleeveName: s.name }))
  );
  const buySignals = allHoldings.filter(h => h.tradeDirection === 'BUY');
  const sellSignals = allHoldings.filter(h => h.tradeDirection === 'SELL' || h.tradeDirection === 'COVER');

  return (
    <section className="content-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '16px' }}>
      {/* Cash & Deployment */}
      <div className="glass-card" style={{ padding: '14px 16px' }}>
        <h2 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--steel-blue)' }}>
          Capital Deployment
        </h2>
        <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
          Invested vs cash allocation breakdown
        </p>

        {/* Deployment ring */}
        <div className="flex items-center gap-6 mb-5">
          <div className="relative" style={{ width: 100, height: 100 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              {/* Invested arc */}
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="var(--steel-blue)" strokeWidth="10"
                strokeDasharray={`${investedPct * 2.513} ${(100 - investedPct) * 2.513}`}
                strokeDashoffset="62.83"
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
              {/* Cash arc */}
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="var(--gold)" strokeWidth="10" strokeOpacity="0.4"
                strokeDasharray={`${cashPct * 2.513} ${(100 - cashPct) * 2.513}`}
                strokeDashoffset={`${62.83 - investedPct * 2.513}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
              {/* Center text */}
              <text x="50" y="46" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="700" fontFamily="'Space Mono', monospace">
                {investedPct.toFixed(0)}%
              </text>
              <text x="50" y="60" textAnchor="middle" fill="var(--text-muted)" fontSize="8" letterSpacing="1">
                DEPLOYED
              </text>
            </svg>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Invested</span>
                <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--steel-blue)' }}>{fmt(investedCapital)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width: `${investedPct}%`, background: 'var(--steel-blue)', transition: 'width 0.8s ease' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Cash</span>
                <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--gold)' }}>{fmt(cashValue)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width: `${cashPct}%`, background: 'var(--gold)', opacity: 0.6, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Trade Signals Summary */}
        <div className="pt-3 border-t border-white/5">
          <div className="text-[9px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Rebalance Signals
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <div className="font-mono font-bold text-[18px]" style={{ color: 'var(--success)' }}>{buySignals.length}</div>
              <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--success)' }}>BUY</div>
            </div>
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(212,100,90,0.08)', border: '1px solid rgba(212,100,90,0.15)' }}>
              <div className="font-mono font-bold text-[18px]" style={{ color: 'var(--coral)' }}>{sellSignals.length}</div>
              <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--coral)' }}>SELL / COVER</div>
            </div>
          </div>
        </div>
      </div>

      {/* P&L Breakdown & Win/Loss */}
      <div className="glass-card" style={{ padding: '14px 16px' }}>
        <h2 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--gold)' }}>
          P&L Intelligence
        </h2>
        <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
          Realized vs unrealized breakdown & portfolio health
        </p>

        {/* P&L breakdown */}
        <div className="space-y-3 mb-5">
          {[
            { label: 'Unrealized P&L', value: unrealizedPnl, color: unrealizedPnl >= 0 ? 'var(--success)' : 'var(--coral)' },
            { label: 'Realized P&L', value: totalRealizedPnl, color: totalRealizedPnl >= 0 ? 'var(--success)' : 'var(--coral)' },
            { label: 'Total P&L', value: totalPnl, color: totalPnl >= 0 ? 'var(--success)' : 'var(--coral)' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              <span className="font-mono font-bold text-[13px]" style={{ color: item.color }}>{fmt(item.value)}</span>
            </div>
          ))}
        </div>

        {/* Win/Loss metrics */}
        <div className="pt-3 border-t border-white/5">
          <div className="text-[9px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Position Scorecard
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="font-mono font-bold text-[16px]" style={{ color: 'var(--success)' }}>{winCount}</div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Winners</div>
            </div>
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="font-mono font-bold text-[16px]" style={{ color: 'var(--coral)' }}>{lossCount}</div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Losers</div>
            </div>
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="font-mono font-bold text-[16px]" style={{ color: winRate >= 50 ? 'var(--success)' : 'var(--coral)' }}>
                {winRate.toFixed(0)}%
              </div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Win Rate</div>
            </div>
          </div>
        </div>

        {/* Alpha bar */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Alpha vs S&P 500</span>
            <span className="font-mono font-bold text-[12px]" style={{
              color: (summary.ytdReturn - summary.benchmarkReturn) >= 0 ? 'var(--success)' : 'var(--coral)'
            }}>
              {fmtPct(summary.ytdReturn - summary.benchmarkReturn)}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full" style={{
              width: `${Math.min(Math.abs(summary.ytdReturn - summary.benchmarkReturn) / 30 * 100, 100)}%`,
              background: (summary.ytdReturn - summary.benchmarkReturn) >= 0
                ? 'linear-gradient(90deg, #22c55e, #10b981)'
                : 'linear-gradient(90deg, #D4645A, #dc2626)',
            }} />
          </div>
        </div>
      </div>
    </section>
  );
};
