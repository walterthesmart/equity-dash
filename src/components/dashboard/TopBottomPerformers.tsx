'use client';
import React from 'react';
import type { Sleeve } from '@/lib/types';

interface Props {
  sleeves: Sleeve[];
}

const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

/* ── Sparkline SVG ──
   Generates a realistic-looking price trajectory from entry to current price
   using seeded pseudo-random walk, so it's deterministic per ticker. */
function generatePriceTrajectory(entryPrice: number, currentPrice: number, ticker: string, points: number = 12): number[] {
  if (entryPrice <= 0 || currentPrice <= 0) return [];
  
  // Simple seeded hash from ticker string
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) {
    seed = ((seed << 5) - seed + ticker.charCodeAt(i)) | 0;
  }
  const nextRand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed / 0x7fffffff) * 2 - 1; // -1 to 1
  };

  const totalReturn = (currentPrice - entryPrice) / entryPrice;
  const trajectory: number[] = [entryPrice];
  
  // Generate random walk that ends at the current price
  const rawSteps: number[] = [];
  for (let i = 1; i < points; i++) {
    rawSteps.push(nextRand() * 0.04); // ±4% daily noise
  }
  
  // Adjust steps so the cumulative sum hits the target return
  const rawSum = rawSteps.reduce((s, v) => s + v, 0);
  const adjustment = (totalReturn - rawSum) / rawSteps.length;
  
  let price = entryPrice;
  for (const step of rawSteps) {
    price = price * (1 + step + adjustment);
    trajectory.push(Math.max(price, 0.01));
  }
  // Ensure last point is exactly currentPrice
  trajectory[trajectory.length - 1] = currentPrice;
  
  return trajectory;
}

const Sparkline: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({
  data, color, width = 72, height = 28,
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padY = 3;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = padY + ((max - v) / range) * (height - padY * 2);
    return `${x},${y}`;
  }).join(' ');

  // Gradient fill area
  const areaPath = `M 0,${padY + ((max - data[0]) / range) * (height - padY * 2)} ` +
    data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = padY + ((max - v) / range) * (height - padY * 2);
      return `L ${x},${y}`;
    }).join(' ') +
    ` L ${width},${height} L 0,${height} Z`;

  const gradId = `sparkFill-${color.replace('#', '')}-${data.length}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle
        cx={width}
        cy={padY + ((max - data[data.length - 1]) / range) * (height - padY * 2)}
        r="2.5"
        fill={color}
      />
    </svg>
  );
};

export const TopBottomPerformers: React.FC<Props> = ({ sleeves }) => {
  // Flatten all holdings across all sleeves
  const allHoldings = sleeves.flatMap(sleeve => 
    sleeve.holdings.map(h => ({ ...h, sleeveName: sleeve.name }))
  );

  const sorted = [...allHoldings].sort((a, b) => b.ytdReturn - a.ytdReturn);
  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();

  return (
    <section className="content-grid mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {/* Top Performers */}
      <div className="glass-card">
        <div className="card-header">
          <div>
            <h2 className="card-title" style={{ color: "var(--success)" }}>
              <span className="mr-2">▲</span>Top Performers
            </h2>
            <p className="card-subtitle">Highest YTD returns across the portfolio</p>
          </div>
        </div>

        <div className="space-y-2">
          {top5.map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: 'var(--success)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[var(--steel-blue)]">{h.ticker}</span>
                  <span className="text-[11px] text-[var(--text-muted)] truncate">{h.name}</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{h.sleeveName}</div>
              </div>
              <Sparkline data={generatePriceTrajectory(h.entryPrice, h.currentPrice, h.ticker)} color="#22c55e" />
              <div className="text-right ml-2">
                <div className="font-mono font-bold text-sm text-[var(--success)]">{fmtPct(h.ytdReturn)}</div>
                <div className="font-mono text-[10px] text-[var(--text-muted)]">{fmt(h.pnl)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Performers */}
      <div className="glass-card">
        <div className="card-header">
          <div>
            <h2 className="card-title" style={{ color: "var(--coral)" }}>
              <span className="mr-2">▼</span>Lagging Positions
            </h2>
            <p className="card-subtitle">Positions requiring attention or review</p>
          </div>
        </div>

        <div className="space-y-2">
          {bottom5.map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                background: 'rgba(212, 100, 90, 0.15)',
                color: 'var(--coral)',
                border: '1px solid rgba(212, 100, 90, 0.3)',
              }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[var(--steel-blue)]">{h.ticker}</span>
                  <span className="text-[11px] text-[var(--text-muted)] truncate">{h.name}</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{h.sleeveName}</div>
              </div>
              <Sparkline data={generatePriceTrajectory(h.entryPrice, h.currentPrice, h.ticker)} color="#D4645A" />
              <div className="text-right ml-2">
                <div className="font-mono font-bold text-sm text-[var(--coral)]">{fmtPct(h.ytdReturn)}</div>
                <div className="font-mono text-[10px] text-[var(--text-muted)]">{fmt(h.pnl)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
