'use client';
import React from 'react';
import type { Sleeve, SleeveClassification } from '@/lib/types';

interface Props {
  sleeves: Sleeve[];
  classifications: SleeveClassification[];
}

const CATEGORY_LABELS: Record<string, string> = {
  core: "Core Thematic",
  tactical: "Tactical Alpha",
  protective: "Protective Capital",
  hedge: "Hedge / Short",
};

const CATEGORY_COLORS: Record<string, { bar: string; solid: string; text: string }> = {
  core:       { bar: "linear-gradient(90deg, #1E3D6F, #7BA4C7)", solid: "#7BA4C7", text: "var(--steel-blue)" },
  tactical:   { bar: "linear-gradient(90deg, #A08940, #C4A95A)", solid: "#C4A95A", text: "var(--gold)" },
  protective: { bar: "linear-gradient(90deg, #166534, #22c55e)", solid: "#22c55e", text: "var(--success)" },
  hedge:      { bar: "linear-gradient(90deg, #6b21a8, #9333ea)", solid: "#9333ea", text: "#9333ea" },
};

/* ── SVG Donut Chart ── */
const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 68;
  const innerR = 44;

  let cumulativeAngle = -90; // start at top

  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const startRad = (Math.PI / 180) * startAngle;
    const endRad = (Math.PI / 180) * endAngle;
    const largeArc = angle > 180 ? 1 : 0;

    const x1o = cx + outerR * Math.cos(startRad);
    const y1o = cy + outerR * Math.sin(startRad);
    const x2o = cx + outerR * Math.cos(endRad);
    const y2o = cy + outerR * Math.sin(endRad);
    const x1i = cx + innerR * Math.cos(endRad);
    const y1i = cy + innerR * Math.sin(endRad);
    const x2i = cx + innerR * Math.cos(startRad);
    const y2i = cy + innerR * Math.sin(startRad);

    const path = [
      `M ${x1o} ${y1o}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i}`,
      'Z',
    ].join(' ');

    return { ...d, path, pct: ((d.value / total) * 100).toFixed(0) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-chart">
      {slices.map((s, i) => (
        <path
          key={i}
          d={s.path}
          fill={s.color}
          opacity={0.85}
          className="donut-slice"
          aria-label={`${s.label}: ${s.pct}%`}
        />
      ))}
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700" fontFamily="'Space Mono', monospace">
        {total.toFixed(0)}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="500" letterSpacing="1">
        ALLOCATED
      </text>
    </svg>
  );
};

export const AllocationBreakdown: React.FC<Props> = ({ sleeves, classifications }) => {
  // Aggregate weights by category
  const categoryTotals: Record<string, number> = { core: 0, tactical: 0, protective: 0, hedge: 0 };
  
  sleeves.forEach(sleeve => {
    const cls = classifications.find(c => c.sleeve === sleeve.name);
    if (cls) {
      categoryTotals[cls.category] += sleeve.totalWeight;
    }
  });

  const donutData = Object.entries(categoryTotals)
    .filter(([, v]) => v > 0)
    .map(([cat, weight]) => ({
      label: CATEGORY_LABELS[cat],
      value: weight,
      color: CATEGORY_COLORS[cat].solid,
    }));

  return (
    <div className="glass-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Allocation Breakdown</h2>
          <p className="card-subtitle">Exposure by strategic bucket</p>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex justify-center mb-6">
        <DonutChart data={donutData} />
      </div>

      {/* Progress bars */}
      <div className="space-y-5">
        {Object.entries(categoryTotals).map(([cat, weight]) => {
          const cfg = CATEGORY_COLORS[cat];
          const label = CATEGORY_LABELS[cat];
          return (
            <div key={cat} className="progress-item" style={{ marginBottom: 0 }}>
              <div className="progress-header">
                <span className="progress-label font-semibold" style={{ color: cfg.text }}>{label}</span>
                <span className="progress-value font-mono">{weight.toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${weight}%`, background: cfg.bar }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini legend */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="grid grid-cols-2 gap-2">
          {sleeves.map((sleeve, i) => {
            const cls = classifications.find(c => c.sleeve === sleeve.name);
            return (
              <div key={i} className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ background: cls?.color || '#666' }}
                />
                <span className="truncate">{sleeve.name}</span>
                <span className="font-mono ml-auto text-[var(--text-primary)]">{sleeve.totalWeight}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
