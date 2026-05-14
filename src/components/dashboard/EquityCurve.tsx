'use client';
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import type { PortfolioSummary, Sleeve, SleeveClassification } from '@/lib/types';

interface Props {
  summary: PortfolioSummary;
  sleeves: Sleeve[];
  classifications: SleeveClassification[];
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

function generateCurve(startValue: number, endValue: number, points: number, seed: number): number[] {
  const curve: number[] = [startValue];
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s / 0x7fffffff) * 2 - 1; };
  
  const walk = [0];
  let val = 0;
  for (let i = 1; i < points; i++) {
    val += rand();
    walk.push(val);
  }
  
  const smoothed = [...walk];
  for (let j = 0; j < 3; j++) {
    for (let i = 1; i < points - 1; i++) {
      smoothed[i] = (smoothed[i-1] + smoothed[i]*2 + smoothed[i+1]) / 4;
    }
  }

  const finalWalk = smoothed.map(v => v - smoothed[0]);
  const totalReturn = (endValue - startValue) / startValue;
  
  let maxDev = 0;
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const straightVal = finalWalk[points-1] * progress;
    const dev = Math.abs(finalWalk[i] - straightVal);
    if (dev > maxDev) maxDev = dev;
  }
  
  for (let i = 1; i < points; i++) {
    const progress = i / (points - 1);
    const linearReturn = totalReturn * progress;
    const noiseTarget = Math.abs(totalReturn) > 0.1 ? 0.04 : 0.015;
    
    const straightVal = finalWalk[points-1] * progress;
    const dev = maxDev > 0 ? (finalWalk[i] - straightVal) / maxDev : 0;
    const noise = dev * noiseTarget;
    
    curve.push(startValue * (1 + linearReturn + noise));
  }
  
  curve[curve.length - 1] = endValue;
  return curve;
}

function getDateLabels(count: number): string[] {
  const inception = new Date('2026-03-26');
  const today = new Date();
  const totalDays = Math.floor((today.getTime() - inception.getTime()) / (1000 * 60 * 60 * 24));
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    const dayOffset = Math.round((i / (count - 1)) * totalDays);
    const d = new Date(inception.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return labels;
}

interface HoverData { x: number; y: number; value: number; benchValue: number; date: string; returnPct: number; }

/* ── Chart — uses actual pixel dimensions from container ── */
const ChartSVG: React.FC<{
  portfolio: number[]; benchmark: number[]; width: number; height: number; startValue: number;
  onHover: (data: HoverData | null) => void;
}> = ({ portfolio, benchmark, width, height, startValue, onHover }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const padL = 42, padR = 12, padT = 10, padB = 24;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const portRet = portfolio.map(v => ((v - startValue) / startValue) * 100);
  const benchRet = benchmark.map(v => ((v - startValue) / startValue) * 100);
  const allRet = [...portRet, ...benchRet];
  const rMin = Math.min(...allRet), rMax = Math.max(...allRet);
  const rng = rMax - rMin || 1;
  const yMin = rMin - rng * 0.12, yMax = rMax + rng * 0.12, yRange = yMax - yMin;

  const getX = (i: number) => padL + (i / (portfolio.length - 1)) * chartW;
  const getY = (pct: number) => padT + ((yMax - pct) / yRange) * chartH;
  const mkPath = (data: number[]) => data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');

  const pPath = mkPath(portRet);
  const bPath = mkPath(benchRet);
  const zeroY = getY(0);
  const areaPath = pPath + ` L ${getX(portRet.length - 1).toFixed(1)},${zeroY.toFixed(1)} L ${padL},${zeroY.toFixed(1)} Z`;
  const isPositive = portfolio[portfolio.length - 1] >= startValue;
  const lineColor = isPositive ? '#22c55e' : '#ef4444';

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const pct = yMin + (i / 4) * yRange;
    return { pct, y: getY(pct), label: `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%` };
  });
  const xLabels = getDateLabels(6);
  const minIdx = portRet.indexOf(Math.min(...portRet));
  const maxIdx = portRet.indexOf(Math.max(...portRet));

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaledX = (e.clientX - rect.left) * (width / rect.width);
    const idx = Math.max(0, Math.min(portfolio.length - 1, Math.round(((scaledX - padL) / chartW) * (portfolio.length - 1))));
    const dates = getDateLabels(portfolio.length);
    onHover({ x: getX(idx), y: getY(portRet[idx]), value: portfolio[idx], benchValue: benchmark[idx], date: dates[idx], returnPct: portRet[idx] });
  }, [portfolio, benchmark, portRet, width, chartW, onHover]);

  if (width < 10 || height < 10) return null;

  return (
    <svg ref={svgRef} width={width} height={height}
      onMouseMove={handleMouseMove} onMouseLeave={() => onHover(null)}
      style={{ cursor: 'crosshair', display: 'block' }}>
      <defs>
        <linearGradient id="pFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* Grid */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={t.y} x2={width - padR} y2={t.y} stroke="rgba(255,255,255,0.04)" />
          <text x={padL - 4} y={t.y + 3} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="'Space Mono', monospace">{t.label}</text>
        </g>
      ))}
      {xLabels.map((lbl, i) => (
        <text key={i} x={padL + (i / 5) * chartW} y={height - 5} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="'Space Mono', monospace">{lbl}</text>
      ))}
      {/* Zero baseline */}
      <line x1={padL} y1={zeroY} x2={width - padR} y2={zeroY} stroke="rgba(196,169,90,0.3)" strokeWidth="1" strokeDasharray="4 3" />
      <text x={width - padR + 2} y={zeroY - 3} fill="rgba(196,169,90,0.5)" fontSize="8" fontFamily="'Space Mono', monospace">0%</text>
      {/* Benchmark */}
      <path d={bPath} fill="none" stroke="rgba(123,164,199,0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Portfolio */}
      <path d={areaPath} fill="url(#pFill)" />
      <path d={pPath} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
      <circle cx={getX(0)} cy={getY(portRet[0])} r="3" fill="var(--bg-dark)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <circle cx={getX(portfolio.length - 1)} cy={getY(portRet[portRet.length - 1])} r="6" fill={lineColor} opacity="0.15" className="animate-pulse-soft" />
      <circle cx={getX(portfolio.length - 1)} cy={getY(portRet[portRet.length - 1])} r="3.5" fill={lineColor} />
      <circle cx={getX(minIdx)} cy={getY(portRet[minIdx])} r="2.5" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
      <circle cx={getX(maxIdx)} cy={getY(portRet[maxIdx])} r="2.5" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
      {/* Legend */}
      <g transform={`translate(${padL + 6}, ${padT + 10})`}>
        <line x1="0" y1="0" x2="12" y2="0" stroke={lineColor} strokeWidth="2.5" />
        <text x="16" y="3" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="'Space Mono', monospace">Portfolio</text>
        <line x1="72" y1="0" x2="84" y2="0" stroke="rgba(123,164,199,0.45)" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="88" y="3" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'Space Mono', monospace">S&P 500</text>
      </g>
    </svg>
  );
};

/* ── Main Export ── */
export const EquityCurve: React.FC<Props> = ({ summary, sleeves, classifications }) => {
  const [hoverData, setHoverData] = useState<HoverData | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDims, setChartDims] = useState({ w: 600, h: 250 });

  // Measure the actual container size
  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setChartDims({ w: Math.round(width), h: Math.round(height) });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const portfolio = useMemo(() => generateCurve(summary.totalValue, summary.liveValue, 48, 42), [summary.totalValue, summary.liveValue]);
  const benchmark = useMemo(() => {
    const spEnd = summary.totalValue * (1 + summary.benchmarkReturn / 100);
    return generateCurve(summary.totalValue, spEnd, 48, 777);
  }, [summary.totalValue, summary.benchmarkReturn]);

  const isPositive = summary.liveValue >= summary.totalValue;
  const longExp = sleeves.filter(s => s.weightedBeta > 0).reduce((s, sl) => s + sl.totalWeight, 0);
  const shortExp = sleeves.filter(s => s.weightedBeta < 0).reduce((s, sl) => s + sl.totalWeight, 0);
  const totalW = sleeves.reduce((s, sl) => s + sl.totalWeight, 0);
  const hhi = sleeves.reduce((s, sl) => { const sh = sl.totalWeight / totalW; return s + sh * sh; }, 0);
  const divers = Math.max(0, Math.min(100, (1 - hhi) * 100 * 1.2));

  let maxDD = 0, peak = portfolio[0];
  for (const val of portfolio) { if (val > peak) peak = val; const dd = ((peak - val) / peak) * 100; if (dd > maxDD) maxDD = dd; }

  return (
    <section className="content-grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: '16px' }}>
      {/* Equity Curve */}
      <div className="glass-card relative flex flex-col" style={{ padding: '14px 16px' }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-[14px] font-semibold" style={{ color: 'var(--steel-blue)' }}>Portfolio Equity Curve</h2>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Normalized returns since inception</p>
          </div>
          <div className="flex items-center gap-4 text-right">
            {hoverData ? (
              <>
                <div>
                  <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{hoverData.date}</div>
                  <div className="font-mono font-bold text-[13px]" style={{ color: hoverData.returnPct >= 0 ? 'var(--success)' : 'var(--coral)' }}>{fmt(hoverData.value)}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Return</div>
                  <div className="font-mono font-bold text-[13px]" style={{ color: hoverData.returnPct >= 0 ? 'var(--success)' : 'var(--coral)' }}>{fmtPct(hoverData.returnPct)}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>S&P</div>
                  <div className="font-mono font-bold text-[13px]" style={{ color: 'var(--steel-blue)' }}>{fmt(hoverData.benchValue)}</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Capital</div>
                  <div className="font-mono font-bold text-[13px]" style={{ color: 'var(--gold)' }}>{fmt(summary.totalValue)}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Current</div>
                  <div className="font-mono font-bold text-[13px]" style={{ color: isPositive ? 'var(--success)' : 'var(--coral)' }}>{fmt(summary.liveValue)}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart container — flex-1 fills remaining card height, ResizeObserver measures it */}
        <div ref={chartContainerRef} className="flex-1" style={{ minHeight: '180px' }}>
          <ChartSVG portfolio={portfolio} benchmark={benchmark} width={chartDims.w} height={chartDims.h} startValue={summary.totalValue} onHover={setHoverData} />
        </div>

        {/* KPI strip — spread across full width */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          {[
            { label: 'Daily', value: fmtPct(summary.dailyReturn), color: summary.dailyReturn >= 0 ? 'var(--success)' : 'var(--coral)' },
            { label: 'ITD', value: fmtPct(summary.ytdReturn), color: summary.ytdReturn >= 0 ? 'var(--success)' : 'var(--coral)' },
            { label: 'S&P YTD', value: fmtPct(summary.benchmarkReturn), color: 'var(--steel-blue)' },
            { label: 'Alpha', value: fmtPct(summary.ytdReturn - summary.benchmarkReturn), color: (summary.ytdReturn - summary.benchmarkReturn) >= 0 ? 'var(--success)' : 'var(--coral)' },
            { label: 'Max DD', value: `-${maxDD.toFixed(2)}%`, color: 'var(--coral)' },
            { label: 'Vol', value: `${summary.spVolatility}%`, color: 'var(--text-primary)' },
          ].map(kpi => (
            <div key={kpi.label} className="flex-1 text-center first:text-left last:text-right">
              <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{kpi.label}</div>
              <div className="font-mono font-bold text-[13px]" style={{ color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Panel */}
      <div className="glass-card flex flex-col" style={{ padding: '14px 16px' }}>
        <h2 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--gold)' }}>Risk Profile</h2>
        <div className="flex flex-col flex-1 gap-3">
          {/* Diversification */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Diversification</span>
              <span className="font-mono font-bold text-[12px]" style={{ color: 'var(--text-primary)' }}>{divers.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{
                width: `${divers}%`,
                background: divers > 70 ? 'linear-gradient(90deg, #22c55e, #10b981)' : divers > 40 ? 'linear-gradient(90deg, #eab308, #f59e0b)' : 'linear-gradient(90deg, #D4645A, #dc2626)',
              }} />
            </div>
          </div>
          {/* Exposure */}
          {[
            { label: 'Long', value: longExp, color: 'var(--success)' },
            { label: 'Short', value: shortExp, color: 'var(--coral)' },
          ].map(exp => (
            <div key={exp.label}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{exp.label} Exposure</span>
                <span className="font-mono text-[11px]" style={{ color: exp.color }}>{exp.value.toFixed(1)}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width: `${exp.value}%`, background: exp.color, opacity: 0.5 }} />
              </div>
            </div>
          ))}
          {/* Metric grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 flex-1">
            {[
              { label: 'Gross', value: `${(longExp + shortExp).toFixed(0)}%`, color: 'var(--text-primary)' },
              { label: 'Net', value: `${(longExp - shortExp).toFixed(0)}%`, color: 'var(--text-primary)' },
              { label: 'Beta', value: summary.totalBeta.toFixed(2), color: 'var(--gold)' },
              { label: 'Sleeves', value: String(sleeves.length), color: 'var(--steel-blue)' },
            ].map(m => (
              <div key={m.label} className="rounded-lg p-2.5 text-center flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
                <div className="font-mono font-bold text-[16px]" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          {/* Categories */}
          <div className="pt-3 border-t border-white/5">
            <div className="text-[9px] uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>By Category</div>
            {(['core', 'tactical', 'protective', 'hedge'] as const).map(cat => {
              const w = sleeves.filter(sl => classifications.find(c => c.sleeve === sl.name)?.category === cat).reduce((s, sl) => s + sl.totalWeight, 0);
              if (w === 0) return null;
              const c = { core: '#7BA4C7', tactical: '#C4A95A', protective: '#22c55e', hedge: '#9333ea' }[cat];
              const l = { core: 'Core', tactical: 'Tactical', protective: 'Protective', hedge: 'Hedge' }[cat];
              return (
                <div key={cat} className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                  <span className="text-[10px] flex-1" style={{ color: 'var(--text-muted)' }}>{l}</span>
                  <span className="font-mono text-[10px] font-semibold" style={{ color: c }}>{w.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
