import React from 'react';
import { SankoreLogo } from '../shared/SankoreLogo';

interface Props {
  onSync: () => void;
  syncing: boolean;
  lastSynced: string | null;
}

export const Header: React.FC<Props> = ({ onSync, syncing, lastSynced }) => (
  <nav className="navbar flex justify-between items-center mb-8">
    <div className="flex items-center gap-4">
      <SankoreLogo size={48} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Sankore <span style={{ color: "var(--gold)", fontWeight: 300 }}>Equity Model</span>
        </h1>
        <div className="text-xs mt-0.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Deliberation v1.1 • Model Portfolio • {SLEEVES_COUNT} Securities
        </div>
      </div>
    </div>
    <div className="navbar-right flex items-center gap-4">
      {lastSynced && (
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Synced: {lastSynced}
        </div>
      )}
      <button
        onClick={onSync}
        disabled={syncing}
        className="nav-btn flex items-center justify-center gap-2 transition-all"
        title="Sync from Google Sheets"
        style={{
          width: "auto",
          padding: "0 16px",
          background: syncing ? "var(--glass-hover)" : "var(--glass-bg)",
          cursor: syncing ? "wait" : "pointer",
        }}
      >
        <svg
          viewBox="0 0 24 24" fill="none" stroke="var(--steel-blue)" strokeWidth="2"
          style={{ width: "16px", height: "16px", animation: syncing ? "spin 1s linear infinite" : "none" }}
        >
          <path d="M23 4v6h-6"></path>
          <path d="M1 20v-6h6"></path>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
          <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
        </svg>
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          {syncing ? "Syncing..." : "Sync"}
        </span>
      </button>

      <div className="font-medium tracking-wide" style={{ color: "var(--text-secondary)", fontFamily: "'Space Mono', monospace", fontSize: "14px" }}>
        {new Date().toISOString().split('T')[0]}
      </div>
    </div>
  </nav>
);

// Hardcoded count so it doesn't need data import at the header level
const SLEEVES_COUNT = 27;
