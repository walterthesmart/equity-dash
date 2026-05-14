import type { Sleeve, PortfolioSummary, SleeveClassification } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════
// DELIBERATION v1.1 — Model Portfolio
// Smaller $925K portfolio with thesis-driven sleeves
// ═══════════════════════════════════════════════════════════════

export const DELIB_PORTFOLIO_SUMMARY: PortfolioSummary = {
  inceptionDate: "2026-01-01",
  totalValue: 925801.00,
  liveValue: 925801.00,
  unrealizedPnl: 0,
  dailyReturn: 0,
  ytdReturn: 7.53,
  benchmarkReturn: 13.67,
  spVolatility: 12.14,
  portfolioVolatility: null,
  totalBeta: 0.67,
  monthlyReturns: [0.44, 4.68, -2.83, 4.39, 0.83, 0, 0, 0, 0, 0, 0, 0],
};

export const DELIB_SLEEVES: Sleeve[] = [
  {
    name: "Long Global Metal Miners",
    totalWeight: 0.00,
    totalNotional: 0,
    totalPnl: 0,
    ytdReturn: 0,
    weightedBeta: 0,
    monthlyReturns: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "VanEck Gold Miners ETF", ticker: "GDX", weight: 0, beta: 0.78, notional: 0, shares: 0, entryPrice: 85.73, currentPrice: 93.82, pnl: 0, ytdReturn: 9.44, monthlyReturns: [14.33, 22.97, -17.12, -9.27, 7.70, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Global X Copper Miners ETF", ticker: "COPX", weight: 0, beta: 1.17, notional: 0, shares: 0, entryPrice: 73.06, currentPrice: 86.96, pnl: 0, ytdReturn: 19.03, monthlyReturns: [19.64, 12.84, -18.34, 1.15, 10.01, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "US Core",
    totalWeight: 10.00,
    totalNotional: 92580.10,
    totalPnl: -167.16,
    ytdReturn: -0.18,
    weightedBeta: 0.06,
    monthlyReturns: [-5.60, 9.07, -2.55, 1.59, -1.63, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "Energy Select Sector SPDR ETF", ticker: "XLE", weight: 3.00, beta: 0.48, notional: 27774.03, shares: 451, entryPrice: 45.65, currentPrice: 57.43, pnl: -1846.49, ytdReturn: -6.65, monthlyReturns: [-17.02, 9.54, 5.45, -0.20, -2.41, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Materials Select Sector SPDR ETF", ticker: "XLB", weight: 1.00, beta: 0.99, notional: 9258.01, shares: 189, entryPrice: 46.12, currentPrice: 51.63, pnl: 479.03, ytdReturn: 5.17, monthlyReturns: [0.37, 8.40, -5.52, 1.76, 0.55, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Utilities Select Sector SPDR ETF", ticker: "XLU", weight: 3.00, beta: 0.65, notional: 27774.03, shares: 613, entryPrice: 43.18, currentPrice: 45.06, pnl: -165.43, ytdReturn: -0.60, monthlyReturns: [-4.59, 10.36, -3.39, 0.95, -3.20, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Industrial Select Sector SPDR ETF", ticker: "XLI", weight: 1.00, beta: 1.04, notional: 9258.01, shares: 57, entryPrice: 157.98, currentPrice: 172.34, pnl: 635.49, ytdReturn: 6.86, monthlyReturns: [2.59, 7.07, -7.18, 5.19, -0.36, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Consumer Staples Select Sector SPDR ETF", ticker: "XLP", weight: 2.00, beta: 0.52, notional: 18516.02, shares: 228, entryPrice: 77.69, currentPrice: 84.34, pnl: 730.23, ytdReturn: 3.94, monthlyReturns: [2.92, 7.78, -9.50, 3.33, 0.20, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "Global Relative Value",
    totalWeight: 5.00,
    totalNotional: 46290.05,
    totalPnl: 2040.65,
    ytdReturn: 4.41,
    weightedBeta: 0.04,
    monthlyReturns: [9.23, 0.36, -3.81, 2.53, -3.00, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "iShares MSCI Brazil ETF", ticker: "EWZ", weight: 2.50, beta: 0.73, notional: 23145.03, shares: 629, entryPrice: 32.20, currentPrice: 38.08, pnl: 805.04, ytdReturn: 3.48, monthlyReturns: [0.65, 4.56, -0.93, 2.76, -3.42, 0, 0, 0, 0, 0, 0, 0] },
      { name: "iShares MSCI Chile ETF", ticker: "ECH", weight: 2.50, beta: 0.74, notional: 23145.03, shares: 603, entryPrice: 40.37, currentPrice: 40.45, pnl: 1235.61, ytdReturn: 5.34, monthlyReturns: [17.81, -3.85, -6.69, 2.29, -2.58, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "Short Crypto",
    totalWeight: 0.00,
    totalNotional: 0,
    totalPnl: 0,
    ytdReturn: 0,
    weightedBeta: 0,
    monthlyReturns: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "ProShares Short Bitcoin ETF", ticker: "BITI", weight: 0, beta: -1.37, notional: 0, shares: 0, entryPrice: 22.58, currentPrice: 21.78, pnl: 0, ytdReturn: -3.54, monthlyReturns: [-9.20, 20.38, -10.15, -14.18, -2.20, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "Nearshoring",
    totalWeight: 15.00,
    totalNotional: 138870.15,
    totalPnl: 23091.51,
    ytdReturn: 16.63,
    weightedBeta: 0.17,
    monthlyReturns: [2.90, 5.74, -4.53, 8.66, 3.43, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "iShares MSCI Mexico ETF", ticker: "EWW", weight: 3.75, beta: 0.85, notional: 34717.54, shares: 474, entryPrice: 69.66, currentPrice: 79.85, pnl: 3107.48, ytdReturn: 8.95, monthlyReturns: [2.50, 7.75, -5.65, 0.38, 4.16, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Aztlan NA Nearshoring Stock Select ETF", ticker: "NRSH", weight: 3.75, beta: 1.15, notional: 34717.54, shares: 1436, entryPrice: 24.02, currentPrice: 31.83, pnl: 11002.74, ytdReturn: 31.69, monthlyReturns: [3.14, 1.56, -1.07, 18.92, 6.85, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Tema American Reshoring ETF", ticker: "RSHO", weight: 3.75, beta: 1.38, notional: 34717.54, shares: 703, entryPrice: 45.42, currentPrice: 57.00, pnl: 5365.50, ytdReturn: 15.45, monthlyReturns: [-1.60, 12.23, -7.10, 10.29, 2.04, 0, 0, 0, 0, 0, 0, 0] },
      { name: "iShares MSCI Poland ETF", ticker: "EPOL", weight: 3.75, beta: 1.10, notional: 34717.54, shares: 993, entryPrice: 36.25, currentPrice: 38.59, pnl: 3615.79, ytdReturn: 10.41, monthlyReturns: [7.55, 1.44, -4.33, 5.07, 0.68, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "Agricultural Commodities",
    totalWeight: 20.00,
    totalNotional: 0,
    totalPnl: 0,
    ytdReturn: 0,
    weightedBeta: 0.06,
    monthlyReturns: [-4.16, 3.99, 1.50, 1.14, -0.46, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "Invesco DB Agriculture Fund", ticker: "DBA", weight: 10.00, beta: 0.15, notional: 0, shares: 0, entryPrice: 25.56, currentPrice: 28.39, pnl: 0, ytdReturn: 11.07, monthlyReturns: [-5.35, 1.40, 4.15, 3.73, 1.00, 0, 0, 0, 0, 0, 0, 0] },
      { name: "VanEck Agribusiness ETF", ticker: "MOO", weight: 10.00, beta: 0.47, notional: 0, shares: 0, entryPrice: 73.68, currentPrice: 81.78, pnl: 0, ytdReturn: 10.99, monthlyReturns: [-2.97, 6.57, -1.14, -1.45, -1.92, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "Energy Transition",
    totalWeight: 20.00,
    totalNotional: 6943.51,
    totalPnl: 1099.93,
    ytdReturn: 15.84,
    weightedBeta: 0.11,
    monthlyReturns: [4.77, 5.24, -2.98, 9.74, 0.41, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "Sprott Critical Materials ETF", ticker: "SETM", weight: 8.33, beta: 0.97, notional: 2891.97, shares: 93, entryPrice: 30.16, currentPrice: 37.82, pnl: 612.49, ytdReturn: 21.18, monthlyReturns: [11.28, 11.23, -12.30, 9.18, 2.24, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Global X Uranium ETF", ticker: "URA", weight: 5.33, beta: 0.47, notional: 1850.44, shares: 40, entryPrice: 46.06, currentPrice: 53.29, pnl: 261.12, ytdReturn: 14.11, monthlyReturns: [17.75, -1.18, -9.35, 13.36, -4.57, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Invesco Optimum Yield Diversified Commodity ETF", ticker: "PDBC", weight: 6.34, beta: 0.04, notional: 2201.09, shares: 129, entryPrice: 13.28, currentPrice: 18.77, pnl: 226.32, ytdReturn: 10.28, monthlyReturns: [-14.69, 2.75, 14.61, 7.43, 2.18, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "Global Safe Havens",
    totalWeight: 15.00,
    totalNotional: 138870.15,
    totalPnl: 5852.33,
    ytdReturn: 4.21,
    weightedBeta: 0.10,
    monthlyReturns: [0.59, 5.37, -2.47, 1.65, -0.51, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "iShares MSCI Singapore ETF", ticker: "EWS", weight: 3.00, beta: 0.56, notional: 27774.03, shares: 1006, entryPrice: 27.75, currentPrice: 28.86, pnl: 1257.43, ytdReturn: 4.53, monthlyReturns: [2.17, 1.99, -1.01, 1.54, -0.21, 0, 0, 0, 0, 0, 0, 0] },
      { name: "iShares MSCI Switzerland ETF", ticker: "EWL", weight: 3.00, beta: 0.81, notional: 27774.03, shares: 485, entryPrice: 60.34, currentPrice: 61.28, pnl: 1929.16, ytdReturn: 6.95, monthlyReturns: [7.40, 5.75, -8.57, 2.99, 0.00, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Global X MSCI Norway ETF", ticker: "NORW", weight: 3.00, beta: 0.72, notional: 27774.03, shares: 769, entryPrice: 30.41, currentPrice: 38.12, pnl: 1521.65, ytdReturn: 5.48, monthlyReturns: [-9.80, 9.72, 5.62, 2.09, -1.17, 0, 0, 0, 0, 0, 0, 0] },
      { name: "iShares MSCI USA Min Vol Factor ETF", ticker: "USMV", weight: 3.00, beta: 0.70, notional: 27774.03, shares: 301, entryPrice: 93.65, currentPrice: 94.31, pnl: 632.53, ytdReturn: 2.28, monthlyReturns: [3.01, 2.97, -5.26, 2.06, -0.29, 0, 0, 0, 0, 0, 0, 0] },
      { name: "iShares MSCI EAFE Min Vol Factor ETF", ticker: "EFAV", weight: 3.00, beta: 0.53, notional: 27774.03, shares: 312, entryPrice: 86.66, currentPrice: 90.68, pnl: 511.56, ytdReturn: 1.84, monthlyReturns: [0.13, 6.40, -3.12, -0.44, -0.91, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "Global AI Value",
    totalWeight: 15.00,
    totalNotional: 138870.15,
    totalPnl: 37786.97,
    ytdReturn: 27.21,
    weightedBeta: 0.13,
    monthlyReturns: [0.12, 13.93, -8.88, 17.02, 4.75, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "WisdomTree Japan Hedged Equity ETF", ticker: "DXJ", weight: 3.75, beta: 0.41, notional: 34717.54, shares: 222, entryPrice: 144.99, currentPrice: 168.28, pnl: 2641.89, ytdReturn: 7.61, monthlyReturns: [-2.33, 11.03, -4.38, -0.46, 4.26, 0, 0, 0, 0, 0, 0, 0] },
      { name: "iShares MSCI South Korea ETF", ticker: "EWY", weight: 3.75, beta: 1.27, notional: 34717.54, shares: 289, entryPrice: 102.22, currentPrice: 176.89, pnl: 16463.27, ytdReturn: 47.42, monthlyReturns: [2.02, 23.66, -16.61, 28.35, 9.19, 0, 0, 0, 0, 0, 0, 0] },
      { name: "iShares MSCI Taiwan ETF", ticker: "EWT", weight: 3.75, beta: 1.01, notional: 34717.54, shares: 495, entryPrice: 64.77, currentPrice: 92.96, pnl: 11321.58, ytdReturn: 32.61, monthlyReturns: [-2.91, 11.18, -5.22, 25.45, 3.32, 0, 0, 0, 0, 0, 0, 0] },
      { name: "iShares MSCI EM ex China ETF", ticker: "EMXC", weight: 3.75, beta: 0.82, notional: 34717.54, shares: 451, entryPrice: 74.42, currentPrice: 93.30, pnl: 7360.23, ytdReturn: 21.20, monthlyReturns: [3.69, 9.85, -9.30, 14.76, 2.22, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    name: "US Short (Direct)",
    totalWeight: 0.00,
    totalNotional: 0,
    totalPnl: 0,
    ytdReturn: 0,
    weightedBeta: 0,
    monthlyReturns: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "Yelp Inc", ticker: "YELP", weight: 0, beta: 0.43, notional: 0, shares: 0, entryPrice: 30.20, currentPrice: 23.75, pnl: 0, ytdReturn: 21.36, monthlyReturns: [-10.63, 18.59, -13.01, -14.73, 17.82, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Asana Inc", ticker: "ASAN", weight: 0, beta: 1.09, notional: 0, shares: 0, entryPrice: 12.96, currentPrice: 6.11, pnl: 0, ytdReturn: 52.85, monthlyReturns: [-65.86, 30.73, 10.85, -10.43, 12.59, 0, 0, 0, 0, 0, 0, 0] },
      { name: "DocuSign Inc", ticker: "DOCU", weight: 0, beta: 0.95, notional: 0, shares: 0, entryPrice: 64.85, currentPrice: 45.77, pnl: 0, ytdReturn: 29.42, monthlyReturns: [-11.36, 14.22, -6.88, 0.44, 4.57, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Salesforce Inc", ticker: "CRM", weight: 0, beta: 1.26, notional: 0, shares: 0, entryPrice: 253.62, currentPrice: 173.77, pnl: 0, ytdReturn: 31.48, monthlyReturns: [-14.36, 8.24, 4.39, 1.30, 5.47, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Pegasystems Inc", ticker: "PEGA", weight: 0, beta: 1.08, notional: 0, shares: 0, entryPrice: 56.06, currentPrice: 34.39, pnl: 0, ytdReturn: 38.66, monthlyReturns: [-3.63, -0.09, 3.29, 14.40, 5.00, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
];

export const DELIB_SLEEVE_CLASSIFICATIONS: SleeveClassification[] = [
  { sleeve: "Long Global Metal Miners", category: "tactical", color: "#D4645A" },
  { sleeve: "US Core", category: "core", color: "#7BA4C7" },
  { sleeve: "Global Relative Value", category: "tactical", color: "#f59e0b" },
  { sleeve: "Short Crypto", category: "hedge", color: "#9333ea" },
  { sleeve: "Nearshoring", category: "tactical", color: "#f97316" },
  { sleeve: "Agricultural Commodities", category: "protective", color: "#84cc16" },
  { sleeve: "Energy Transition", category: "tactical", color: "#06b6d4" },
  { sleeve: "Global Safe Havens", category: "protective", color: "#B8C4CC" },
  { sleeve: "Global AI Value", category: "tactical", color: "#3b82f6" },
  { sleeve: "US Short (Direct)", category: "hedge", color: "#ef4444" },
];
