// ═══════════════════════════════════════════════════════════════
// Equity Model Types — Sankore T-01
// ═══════════════════════════════════════════════════════════════

export interface Holding {
  name: string;
  ticker: string;
  weight: number;
  beta: number;
  notional: number;
  shares: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  ytdReturn: number;
  itdGain?: number;
  itdReturn?: number;
  monthlyReturns: number[];
  // Enhanced fields from Q2 Actual
  dailyReturn?: number;
  realizedPnl?: number;
  liveValue?: number;
  currentWeight?: number;
  weightDeviation?: number;
  rebalanceAmount?: number;
  tradeDirection?: string;
}

export interface Sleeve {
  name: string;
  holdings: Holding[];
  totalWeight: number;
  totalNotional: number;
  totalPnl: number;
  ytdReturn: number;
  itdGain?: number;
  itdReturn?: number;
  weightedBeta: number;
  monthlyReturns: number[];
}

export interface PortfolioSummary {
  inceptionDate: string;
  totalValue: number;
  liveValue: number;
  unrealizedPnl: number;
  dailyReturn: number;
  ytdReturn: number;
  itdReturn?: number;
  mtdReturn?: number;
  benchmarkReturn: number;
  spVolatility: number;
  portfolioVolatility: number | null;
  totalBeta: number;
  monthlyReturns: number[];
  // Enhanced fields from Q2 Actual
  cashValue?: number;
  cashPercent?: number;
  investedCapital?: number;
  totalRealizedPnl?: number;
  winCount?: number;
  lossCount?: number;
  longExposure?: number;
  shortExposure?: number;
}

export type SleeveCategory = 'core' | 'tactical' | 'protective' | 'hedge';

export interface SleeveClassification {
  sleeve: string;
  category: SleeveCategory;
  color: string;
}
