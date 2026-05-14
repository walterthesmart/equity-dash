'use client';

import React, { useState, useCallback } from 'react';
import type { PortfolioSummary, Sleeve, SleeveClassification } from '@/lib/types';
import { TopStatsGrid } from '@/components/dashboard/TopStatsGrid';
import { SleeveOverview } from '@/components/dashboard/SleeveOverview';
import { AllocationBreakdown } from '@/components/dashboard/AllocationBreakdown';
import { EquityCurve } from '@/components/dashboard/EquityCurve';
import { MonthlyReturnsGrid } from '@/components/dashboard/MonthlyReturnsGrid';
import { TopBottomPerformers } from '@/components/dashboard/TopBottomPerformers';
import { SleeveDetailModal } from '@/components/dashboard/SleeveDetailModal';
import { CashDeploymentPanel } from '@/components/dashboard/CashDeploymentPanel';
import { TradeSignals } from '@/components/dashboard/TradeSignals';

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

interface Props {
  summary: PortfolioSummary;
  sleeves: Sleeve[];
  classifications: SleeveClassification[];
  lastUpdated: string;
}

export function Q2ActualDashboard({ summary: initialSummary, sleeves: initialSleeves, classifications: initialClassifications, lastUpdated }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [selectedSleeveIdx, setSelectedSleeveIdx] = useState<number | null>(null);

  // Live data state — initialized from server-rendered props
  const [summary, setSummary] = useState(initialSummary);
  const [sleeves, setSleeves] = useState(initialSleeves);
  const [classifications, setClassifications] = useState(initialClassifications);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    try {
      const resp = await fetch('/api/portfolio');
      if (resp.ok) {
        const data = await resp.json();
        setSummary(data.summary);
        setSleeves(data.sleeves);
        setClassifications(data.classifications);
        setLastSynced(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('[Sankore] Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  }, []);

  const selectedSleeve = selectedSleeveIdx !== null ? sleeves[selectedSleeveIdx] : null;
  const selectedClassification = selectedSleeve
    ? classifications.find(c => c.sleeve === selectedSleeve.name) || null
    : null;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Q2 Actual <span style={{ color: 'var(--gold)', fontWeight: 300 }}>Portfolio</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            🟢 Live — {fmt(summary.liveValue)} / {fmt(summary.totalValue)} Capital Base
            {lastUpdated && ` — Sheet: ${lastUpdated}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            LIVE
          </span>
          {lastSynced && (
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Synced: {lastSynced}</span>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="nav-btn flex items-center gap-2"
            style={{ width: 'auto', padding: '0 16px', cursor: syncing ? 'wait' : 'pointer' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--steel-blue)" strokeWidth="2"
              style={{ width: 16, height: 16, animation: syncing ? 'spin 1s linear infinite' : 'none' }}>
              <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
              <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
            </svg>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {syncing ? 'Syncing...' : 'Sync'}
            </span>
          </button>
          <div className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toISOString().split('T')[0]}
          </div>
        </div>
      </div>

      <TopStatsGrid summary={summary} sleeves={sleeves} />
      <EquityCurve summary={summary} sleeves={sleeves} classifications={classifications} />

      {/* Cash Deployment & P&L Intelligence */}
      <CashDeploymentPanel summary={summary} sleeves={sleeves} />

      <section className="content-grid mb-8" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <SleeveOverview sleeves={sleeves} classifications={classifications} onSleeveClick={setSelectedSleeveIdx} />
        <AllocationBreakdown sleeves={sleeves} classifications={classifications} />
      </section>

      <TopBottomPerformers sleeves={sleeves} />

      {/* Trade Signals */}
      <TradeSignals sleeves={sleeves} />

      <div className="mb-4">
        <MonthlyReturnsGrid sleeves={sleeves} portfolioMonthly={summary.monthlyReturns} />
      </div>

      <SleeveDetailModal
        isOpen={selectedSleeveIdx !== null}
        onClose={() => setSelectedSleeveIdx(null)}
        sleeve={selectedSleeve}
        classification={selectedClassification}
      />

      <footer className="text-center pb-8 pt-4">
        <p className="text-[11px] text-[var(--text-muted)]">
          T-01 Equity Model — Q2 Actual — Sankore Investments — 🔗 Live Google Sheets
        </p>
      </footer>
    </div>
  );
}
