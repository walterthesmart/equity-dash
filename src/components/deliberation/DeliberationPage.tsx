'use client';
import React, { useState, useMemo, useCallback } from 'react';
import type { Holding, Sleeve, PortfolioSummary, SleeveClassification } from '@/lib/types';
import { DELIB_SLEEVES, DELIB_SLEEVE_CLASSIFICATIONS, DELIB_PORTFOLIO_SUMMARY } from '@/data/deliberationConstants';
import { PORTFOLIO_SUMMARY as Q2_SUMMARY, SLEEVES as Q2_SLEEVES } from '@/data/equityConstants';

import { TopStatsGrid } from '@/components/dashboard/TopStatsGrid';
import { SleeveOverview } from '@/components/dashboard/SleeveOverview';
import { AllocationBreakdown } from '@/components/dashboard/AllocationBreakdown';
import { MonthlyReturnsGrid } from '@/components/dashboard/MonthlyReturnsGrid';
import { CashDeploymentPanel } from '@/components/dashboard/CashDeploymentPanel';
import { TopBottomPerformers } from '@/components/dashboard/TopBottomPerformers';
import { SleeveDetailModal } from '@/components/dashboard/SleeveDetailModal';
import { EquityCurve } from '@/components/dashboard/EquityCurve';
import { TradeSignals } from '@/components/dashboard/TradeSignals';

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

interface ModelRow {
  id: string;
  sleeve: string;
  ticker: string;
  name: string;
  weight: number;
  beta: number;
  entryPrice: number;
  currentPrice: number;
  itdGain: number;
  itdReturn: number;
  ytdReturn: number;
  monthlyReturns: number[];
}

interface DeliberationPageProps {
  initialRows?: ModelRow[];
}

function buildInitialRows(): ModelRow[] {
  const rows: ModelRow[] = [];
  DELIB_SLEEVES.forEach(sleeve => {
    sleeve.holdings.forEach((h: Holding) => {
      rows.push({
        id: `${sleeve.name}-${h.ticker}`,
        sleeve: sleeve.name,
        ticker: h.ticker,
        name: h.name,
        weight: h.weight,
        beta: h.beta,
        entryPrice: h.entryPrice,
        currentPrice: h.currentPrice,
        itdGain: h.itdGain || 0,
        itdReturn: h.itdReturn || 0,
        ytdReturn: h.ytdReturn,
        monthlyReturns: h.monthlyReturns || new Array(12).fill(0),
      });
    });
  });
  return rows;
}

/* ── Comparison Delta Arrow ── */
const DeltaIndicator: React.FC<{ label: string; modelVal: number; actualVal: number; format: 'pct' | 'currency' | 'num' }> = ({ label, modelVal, actualVal, format }) => {
  const delta = modelVal - actualVal;
  const isPositive = delta >= 0;
  const color = isPositive ? 'var(--success)' : 'var(--coral)';
  
  let formatted = '';
  if (format === 'pct') formatted = `${isPositive ? '+' : ''}${delta.toFixed(2)}%`;
  else if (format === 'currency') formatted = `${isPositive ? '+' : ''}${fmt(delta)}`;
  else formatted = `${isPositive ? '+' : ''}${delta.toFixed(2)}`;

  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-mono font-semibold" style={{ color }}>
        {isPositive ? '▲' : '▼'} {formatted}
      </span>
    </div>
  );
};

export const DeliberationPage: React.FC<DeliberationPageProps> = ({ initialRows }) => {
  const [rows, setRows] = useState<ModelRow[]>(initialRows || buildInitialRows());
  const [selectedSleeveIdx, setSelectedSleeveIdx] = useState<number | null>(null);
  const [newTicker, setNewTicker] = useState('');
  const [newSleeve, setNewSleeve] = useState('US Core');
  const [customSleeveName, setCustomSleeveName] = useState('');
  const [newWeight, setNewWeight] = useState(0);
  const [capitalBase, setCapitalBase] = useState(DELIB_PORTFOLIO_SUMMARY.totalValue);
  const [showComparison, setShowComparison] = useState(true);
  const [isPushing, setIsPushing] = useState(false);

  const updateWeight = (id: string, weight: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, weight: Math.max(0, Math.min(100, weight)) } : r));
  };

  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  const addRow = () => {
    if (!newTicker.trim()) return;
    const ticker = newTicker.toUpperCase().trim();
    if (rows.find(r => r.ticker === ticker)) return;
    
    const finalSleeve = newSleeve === 'Custom' ? (customSleeveName.trim() || 'Custom Sleeve') : newSleeve;

    setRows(prev => [...prev, {
      id: `${finalSleeve}-${ticker}`,
      sleeve: finalSleeve,
      ticker,
      name: `${ticker} (New)`,
      weight: newWeight,
      beta: 1.0,
      entryPrice: 0,
      currentPrice: 0,
      itdGain: 0,
      itdReturn: 0,
      ytdReturn: 0,
      monthlyReturns: new Array(12).fill(0),
    }]);
    setNewTicker('');
    setNewWeight(0);
    if (newSleeve === 'Custom') {
      setNewSleeve(finalSleeve);
    }
  };

  const handleReset = useCallback(() => {
    setRows(initialRows || buildInitialRows());
    setCapitalBase(DELIB_PORTFOLIO_SUMMARY.totalValue);
  }, [initialRows]);

  const handleExportCSV = useCallback(() => {
    const header = ['Sleeve', 'Security', 'Ticker', 'Weight %', 'Beta', 'Notional', 'Entry', 'Current', 'YTD %', 'Proj P&L'];
    const csvRows = rows.map(r => {
      const notional = capitalBase * (r.weight / 100);
      const projPnl = notional * (r.ytdReturn / 100);
      return [r.sleeve, r.name, r.ticker, r.weight.toFixed(2), r.beta.toFixed(2), notional.toFixed(2), r.entryPrice.toFixed(2), r.currentPrice.toFixed(2), r.ytdReturn.toFixed(2), projPnl.toFixed(2)];
    });
    const csv = [header, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deliberation_model_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, capitalBase]);

  const handlePushToSheet = async () => {
    setIsPushing(true);
    try {
      const header = ['Sleeve', 'Security', 'Ticker', 'Weight %', 'Beta', 'Notional', 'Entry', 'Current', 'YTD %', 'Proj P&L'];
      const values = rows.map(r => {
        const notional = capitalBase * (r.weight / 100);
        const projPnl = notional * (r.ytdReturn / 100);
        return [
          r.sleeve, r.name, r.ticker, r.weight.toFixed(2), r.beta.toFixed(2), 
          notional.toFixed(2), r.entryPrice.toFixed(2), r.currentPrice.toFixed(2), 
          r.ytdReturn.toFixed(2), projPnl.toFixed(2)
        ];
      });
      const sheetData = [header, ...values];

      const res = await fetch('/api/update-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          range: "'Sandbox Export'!A1", 
          values: sheetData
        })
      });

      if (!res.ok) throw new Error('Failed to update sheet');
      alert('Successfully pushed model to Google Sheets (Sandbox Export tab)!');
    } catch (err) {
      console.error(err);
      alert('Error pushing to sheet. Ensure credentials are set and the sheet has a "Sandbox Export" tab.');
    } finally {
      setIsPushing(false);
    }
  };

  const activeRows = rows.filter(r => r.weight > 0);
  const totalWeight = activeRows.reduce((s, r) => s + r.weight, 0);
  const portfolioBeta = totalWeight > 0 ? activeRows.reduce((s, r) => s + r.beta * (r.weight / 100), 0) / (totalWeight / 100) : 0;
  const weightedYtd = totalWeight > 0 ? activeRows.reduce((s, r) => s + r.ytdReturn * (r.weight / 100), 0) / (totalWeight / 100) : 0;
  const totalPnl = activeRows.reduce((s, r) => s + capitalBase * (r.weight / 100) * ((r.itdReturn || 0) / 100), 0);
  const sleevesList = Array.from(new Set(rows.map(r => r.sleeve)));
  const weightOk = Math.abs(totalWeight - 100) < 0.5;

  // Convert model state into standardized Sleeve and PortfolioSummary objects for rendering
  const modelSleeves: Sleeve[] = sleevesList.map(sleeveName => {
    const sleeveRows = rows.filter(r => r.sleeve === sleeveName);
    const sleeveWeight = sleeveRows.reduce((s, r) => s + r.weight, 0);
    const sleeveNotional = capitalBase * (sleeveWeight / 100);
    const sleevePnl = sleeveRows.reduce((s, r) => s + capitalBase * (r.weight / 100) * ((r.itdReturn || 0) / 100), 0);
    const sleeveBeta = sleeveWeight > 0 ? sleeveRows.reduce((s, r) => s + r.beta * (r.weight / sleeveWeight), 0) : 0;
    const sleeveYtd = sleeveWeight > 0 ? sleeveRows.reduce((s, r) => s + r.ytdReturn * (r.weight / sleeveWeight), 0) : 0;
    
    const monthlyReturns = new Array(12).fill(0);
    if (sleeveWeight > 0) {
      for (let m = 0; m < 12; m++) {
        monthlyReturns[m] = sleeveRows.reduce((s, r) => s + (r.weight / sleeveWeight) * (r.monthlyReturns?.[m] || 0), 0);
      }
    }

    return {
      name: sleeveName,
      totalWeight: sleeveWeight,
      totalNotional: sleeveNotional,
      totalPnl: sleevePnl,
      ytdReturn: sleeveYtd,
      weightedBeta: sleeveBeta,
      monthlyReturns: monthlyReturns.map(v => Math.round(v * 100) / 100),
      holdings: sleeveRows.map(r => ({
        name: r.name,
        ticker: r.ticker,
        weight: r.weight,
        beta: r.beta,
        notional: capitalBase * (r.weight / 100),
        shares: 0,
        entryPrice: r.entryPrice,
        currentPrice: r.currentPrice,
        pnl: capitalBase * (r.weight / 100) * ((r.itdReturn || 0) / 100),
        itdGain: r.itdGain,
        itdReturn: r.itdReturn,
        ytdReturn: r.ytdReturn,
        monthlyReturns: r.monthlyReturns,
        dailyReturn: 0,
        realizedPnl: 0,
        liveValue: capitalBase * (r.weight / 100) + (capitalBase * (r.weight / 100) * ((r.itdReturn || 0) / 100)),
      }))
    };
  });

  const portfolioMonthly = new Array(12).fill(0);
  for (let m = 0; m < 12; m++) {
    portfolioMonthly[m] = Math.round(activeRows.reduce((s, r) => s + (r.weight / 100) * (r.monthlyReturns?.[m] || 0), 0) * 100) / 100;
  }

  const currentMonthIdx = new Date().getMonth();
  const mtdReturn = portfolioMonthly[currentMonthIdx] || 0;
  const itdReturn = totalWeight > 0 ? activeRows.reduce((s, r) => s + (r.itdReturn || 0) * (r.weight / 100), 0) / (totalWeight / 100) : 0;

  const modelSummary: PortfolioSummary = {
    inceptionDate: "Model Simulation",
    totalValue: capitalBase,
    liveValue: capitalBase + totalPnl,
    unrealizedPnl: totalPnl,
    dailyReturn: 0,
    ytdReturn: weightedYtd,
    itdReturn: itdReturn,
    mtdReturn: mtdReturn,
    benchmarkReturn: Q2_SUMMARY.benchmarkReturn,
    spVolatility: Q2_SUMMARY.spVolatility,
    portfolioVolatility: null,
    totalBeta: portfolioBeta,
    monthlyReturns: portfolioMonthly,
    cashValue: Math.max(0, capitalBase * (1 - totalWeight / 100)),
    cashPercent: Math.max(0, 100 - totalWeight),
    investedCapital: capitalBase * (totalWeight / 100),
    totalRealizedPnl: 0,
    winCount: activeRows.filter(r => r.ytdReturn > 0).length,
    lossCount: activeRows.filter(r => r.ytdReturn < 0).length,
    longExposure: modelSleeves.filter(s => s.weightedBeta >= 0).reduce((s, sl) => s + sl.totalWeight, 0),
    shortExposure: modelSleeves.filter(s => s.weightedBeta < 0).reduce((s, sl) => s + sl.totalWeight, 0),
  };

  // Ensure classification records exist for any custom sleeves added
  const classifications: SleeveClassification[] = sleevesList.map(s => {
    const existing = DELIB_SLEEVE_CLASSIFICATIONS.find(c => c.sleeve === s);
    return existing || { sleeve: s, category: 'tactical', color: 'var(--gold)' };
  });

  const q2Metrics = {
    beta: Q2_SUMMARY.totalBeta,
    ytd: Q2_SUMMARY.ytdReturn,
    pnl: Q2_SUMMARY.unrealizedPnl,
    value: Q2_SUMMARY.totalValue
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Deliberation <span style={{ color: 'var(--gold)', fontWeight: 300 }}>v1.1</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            🟡 Sandbox — Interactive Portfolio Modeler — {fmt(modelSummary.liveValue)} Projected Value
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono"
            style={{ background: 'rgba(234, 179, 8, 0.15)', color: 'var(--warning)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
            MODEL
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="nav-btn text-[11px] font-semibold tracking-wider"
              style={{
                background: showComparison ? 'rgba(123, 164, 199, 0.15)' : 'var(--glass-bg)',
                color: showComparison ? 'var(--steel-blue)' : 'var(--text-muted)',
              }}
            >
              vs Q2
            </button>
            <button onClick={handleExportCSV} className="nav-btn text-[11px]">CSV</button>
            <button onClick={handleReset} className="nav-btn text-[11px]">Reset</button>
            <button 
              onClick={handlePushToSheet} 
              disabled={isPushing}
              className="px-3 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--amber))',
                color: 'var(--bg-dark)',
                border: 'none',
                opacity: isPushing ? 0.7 : 1,
                cursor: isPushing ? 'wait' : 'pointer'
              }}
            >
              {isPushing ? 'Pushing...' : 'Push to Sheet'}
            </button>
          </div>
          <div className="font-mono text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Base:</span>
            <input
              type="number"
              value={capitalBase}
              onChange={e => setCapitalBase(Number(e.target.value) || 0)}
              className="bg-transparent border-none outline-none text-right font-mono font-bold w-24"
              style={{ color: 'var(--gold)', borderBottom: '1px solid var(--glass-border)' }}
            />
          </div>
        </div>
      </div>

      {/* Comparison Banner */}
      {showComparison && (
        <div className="mb-6 px-5 py-4 rounded-xl border glass-card" style={{
          background: 'linear-gradient(135deg, rgba(123,164,199,0.06), rgba(196,169,90,0.04))',
          borderColor: 'rgba(123, 164, 199, 0.15)',
        }}>
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--steel-blue)' }}>
              Model vs Q2 Actual Deviation
            </div>
            <div className="flex items-center gap-6">
              <DeltaIndicator label="Beta" modelVal={portfolioBeta} actualVal={q2Metrics.beta} format="num" />
              <DeltaIndicator label="YTD" modelVal={weightedYtd} actualVal={q2Metrics.ytd} format="pct" />
              <DeltaIndicator label="P&L" modelVal={totalPnl} actualVal={q2Metrics.pnl} format="currency" />
            </div>
          </div>
        </div>
      )}

      {/* Use standard Q2 Actual UI Components injected with Model Data */}
      <TopStatsGrid summary={modelSummary} sleeves={modelSleeves} />
      <EquityCurve summary={modelSummary} sleeves={modelSleeves} classifications={classifications} />

      {/* Editable Holdings Table - Core feature of Deliberation */}
      <div className="glass-card mb-6 mt-6">
        <div className="card-header flex justify-between items-center">
          <div>
            <h2 className="card-title" style={{ color: 'var(--gold)' }}>Interactive Sandbox</h2>
            <p className="card-subtitle">Adjust weights to model different portfolio configurations</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Add Ticker Controls */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTicker}
                onChange={e => setNewTicker(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRow()}
                placeholder="Ticker"
                className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs font-mono w-20 outline-none focus:border-[var(--gold)]"
                style={{ color: 'var(--text-primary)' }}
              />
              <select
                value={newSleeve}
                onChange={e => setNewSleeve(e.target.value)}
                className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs w-32 outline-none focus:border-[var(--gold)]"
                style={{ color: 'var(--text-primary)' }}
              >
                {sleevesList.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="Custom">+ New Sleeve</option>
              </select>
              {newSleeve === 'Custom' && (
                <input
                  type="text"
                  value={customSleeveName}
                  onChange={e => setCustomSleeveName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRow()}
                  placeholder="Sleeve Name"
                  className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs font-mono w-28 outline-none focus:border-[var(--gold)]"
                  style={{ color: 'var(--text-primary)' }}
                />
              )}
              <button onClick={addRow} className="nav-btn text-[10px] px-2 py-1">+ Add</button>
            </div>
            <div className="text-[11px] font-mono px-3 py-1 rounded bg-black/20" style={{ color: weightOk ? 'var(--success)' : 'var(--coral)' }}>
              Weight: {totalWeight.toFixed(1)}% / 100%
            </div>
          </div>
        </div>
        
        <div className="table-wrapper max-h-[500px] overflow-y-auto">
          <table className="data-table" style={{ fontSize: '12px' }}>
            <thead className="sticky top-0 bg-[var(--bg-dark)] z-10">
              <tr>
                <th>Sleeve</th>
                <th>Security</th>
                <th>Ticker</th>
                <th style={{ textAlign: 'center' }}>Weight %</th>
                <th style={{ textAlign: 'right' }}>Beta</th>
                <th style={{ textAlign: 'right' }}>Notional</th>
                <th style={{ textAlign: 'right' }}>Current</th>
                <th style={{ textAlign: 'right' }}>ITD %</th>
                <th style={{ textAlign: 'right' }}>ITD Gain</th>
                <th style={{ textAlign: 'right' }}>YTD</th>
                <th style={{ textAlign: 'right' }}>Proj. P&L</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {sleevesList.map(sleeveName => {
                const sleeveRows = rows.filter(r => r.sleeve === sleeveName);
                if (sleeveRows.length === 0) return null;
                const cls = classifications.find(c => c.sleeve === sleeveName);
                const dotColor = cls?.color || 'var(--text-muted)';

                return (
                  <React.Fragment key={sleeveName}>
                    {sleeveRows.map((row, ri) => {
                      const notional = capitalBase * (row.weight / 100);
                      const projPnl = notional * (row.ytdReturn / 100);
                      return (
                        <tr key={row.id} className="group hover:bg-white/[0.03]">
                          {ri === 0 && (
                            <td rowSpan={sleeveRows.length} className="align-top border-r border-white/5">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
                                <span className="text-[11px] font-semibold" style={{ color: dotColor }}>{sleeveName}</span>
                              </div>
                            </td>
                          )}
                          <td className="text-[var(--text-secondary)]">{row.name}</td>
                          <td><span className="font-mono font-bold text-[var(--steel-blue)]">{row.ticker}</span></td>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="number"
                              value={row.weight}
                              onChange={e => updateWeight(row.id, Number(e.target.value) || 0)}
                              className="bg-black/30 border border-white/10 rounded px-2 py-1 text-center font-mono text-[12px] w-16 outline-none focus:border-[var(--gold)]"
                              style={{ color: row.weight > 0 ? 'var(--gold)' : 'var(--text-muted)' }}
                              min={0} max={100} step={0.25}
                            />
                          </td>
                          <td className="text-right font-mono text-[var(--text-muted)]">{row.beta.toFixed(2)}</td>
                          <td className="text-right font-mono text-[var(--text-muted)]">{row.weight > 0 ? fmt(notional) : '—'}</td>
                          <td className="text-right font-mono text-[var(--text-primary)]">{row.currentPrice > 0 ? `$${row.currentPrice.toFixed(2)}` : '—'}</td>
                          <td className="text-right font-mono font-semibold" style={{
                            color: row.itdReturn >= 0 ? 'var(--success)' : 'var(--coral)'
                          }}>
                            {row.itdReturn !== 0 ? fmtPct(row.itdReturn) : '—'}
                          </td>
                          <td className="text-right font-mono font-semibold" style={{
                            color: row.itdGain >= 0 ? 'var(--success)' : 'var(--coral)'
                          }}>
                            {row.itdGain !== 0 ? fmt(row.itdGain) : '—'}
                          </td>
                          <td className="text-right font-mono font-semibold" style={{
                            color: row.ytdReturn >= 0 ? 'var(--success)' : 'var(--coral)'
                          }}>
                            {row.ytdReturn !== 0 ? fmtPct(row.ytdReturn) : '—'}
                          </td>
                          <td className="text-right font-mono font-semibold" style={{
                            color: projPnl >= 0 ? 'var(--success)' : 'var(--coral)'
                          }}>
                            {row.weight > 0 ? fmt(projPnl) : '—'}
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => removeRow(row.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--coral)] hover:text-red-400"
                              style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                              title="Remove"
                            >✕</button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash & Allocation Layout */}
      <CashDeploymentPanel summary={modelSummary} sleeves={modelSleeves} />

      <section className="content-grid mb-8" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <SleeveOverview sleeves={modelSleeves} classifications={classifications} onSleeveClick={setSelectedSleeveIdx} />
        <AllocationBreakdown sleeves={modelSleeves} classifications={classifications} />
      </section>

      <TopBottomPerformers sleeves={modelSleeves} />
      <TradeSignals sleeves={modelSleeves} />

      <div className="mb-4 mt-6">
        <MonthlyReturnsGrid sleeves={modelSleeves} portfolioMonthly={modelSummary.monthlyReturns} />
      </div>

      <footer className="text-center pb-8 pt-4 border-t border-white/5">
        <p className="text-[11px] text-[var(--text-muted)]">
          Deliberation v1.1 — Model Portfolio Workspace — Sankore Investments
        </p>
      </footer>

      {/* Sleeve Detail Modal */}
      <SleeveDetailModal 
        isOpen={selectedSleeveIdx !== null}
        onClose={() => setSelectedSleeveIdx(null)} 
        sleeve={selectedSleeveIdx !== null ? modelSleeves[selectedSleeveIdx] : null}
        classification={selectedSleeveIdx !== null ? classifications.find(c => c.sleeve === modelSleeves[selectedSleeveIdx].name) : undefined} 
      />
    </div>
  );
};
