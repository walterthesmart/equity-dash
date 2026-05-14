import type { Sleeve, PortfolioSummary, SleeveClassification } from "@/lib/types";

// ═══════════════════════════════════════════════════════
// Q2 ACTUAL — Live Portfolio Data (from Google Sheet)
// Portfolio inception: March 26, 2026
// Capital Base: $925,801.61 | Live Value: $900,413.40
// ═══════════════════════════════════════════════════════

export const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const SLEEVES: Sleeve[] = [
  {
    name: "Long Precious Metals",
    totalWeight: 10.00,
    totalNotional: 92580.16,
    totalPnl: -3020.05,
    ytdReturn: -3.26,
    weightedBeta: 0.02,
    monthlyReturns: [0, 0, -1.33, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "SPDR Gold Trust", ticker: "GLD", weight: 10.00, beta: 0.20, notional: 92580.16, shares: 209, entryPrice: 443.32, currentPrice: 428.87, pnl: -3020.05, ytdReturn: -3.26, monthlyReturns: [0,0,-1.33,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    name: "Long Global Metal Miners",
    totalWeight: 10.00,
    totalNotional: 92580.16,
    totalPnl: -979.14,
    ytdReturn: -1.06,
    weightedBeta: 0.10,
    monthlyReturns: [0, 0, -3.20, -0.22, 0, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "VanEck Gold Miners ETF", ticker: "GDX", weight: 5.00, beta: 0.78, notional: 46290.08, shares: 462, entryPrice: 98.27, currentPrice: 94.48, pnl: -1750.98, ytdReturn: -3.78, monthlyReturns: [0,0,-3.20,0,0,0,0,0,0,0,0,0] },
      { name: "Global X Copper Miners ETF", ticker: "COPX", weight: 5.00, beta: 1.17, notional: 46290.08, shares: 536, entryPrice: 85.96, currentPrice: 87.40, pnl: 771.84, ytdReturn: 1.67, monthlyReturns: [0,0,-0.22,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    name: "US Core",
    totalWeight: 13.00,
    totalNotional: 120354.21,
    totalPnl: -2100.62,
    ytdReturn: -1.75,
    weightedBeta: 0.08,
    monthlyReturns: [0, 0, 0.75, -1.09, -0.18, -1.20, 1.57, 0, 0, 0, 0, 0],
    holdings: [
      { name: "Energy Select Sector SPDR ETF", ticker: "XLE", weight: 6.00, beta: 0.48, notional: 55548.10, shares: 1000, entryPrice: 61.20, currentPrice: 57.60, pnl: -3600.00, ytdReturn: -5.88, monthlyReturns: [0,0,0.75,0,0,0,0,0,0,0,0,0] },
      { name: "Materials Select Sector SPDR ETF", ticker: "XLB", weight: 1.00, beta: 0.99, notional: 9258.02, shares: 180, entryPrice: 49.39, currentPrice: 51.69, pnl: 413.56, ytdReturn: 4.65, monthlyReturns: [0,0,-1.09,0,0,0,0,0,0,0,0,0] },
      { name: "Utilities Select Sector SPDR ETF", ticker: "XLU", weight: 3.00, beta: 0.65, notional: 27774.05, shares: 602, entryPrice: 45.28, currentPrice: 45.06, pnl: -132.44, ytdReturn: -0.48, monthlyReturns: [0,0,-0.18,0,0,0,0,0,0,0,0,0] },
      { name: "Industrial Select Sector SPDR ETF", ticker: "XLI", weight: 1.00, beta: 1.04, notional: 9258.02, shares: 54, entryPrice: 164.42, currentPrice: 172.94, pnl: 460.08, ytdReturn: 5.18, monthlyReturns: [0,0,-1.20,0,0,0,0,0,0,0,0,0] },
      { name: "Consumer Staples Select Sector SPDR ETF", ticker: "XLP", weight: 2.00, beta: 0.52, notional: 18516.03, shares: 227, entryPrice: 81.34, currentPrice: 84.68, pnl: 758.18, ytdReturn: 4.09, monthlyReturns: [0,0,1.57,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    name: "Global Relative Value",
    totalWeight: 15.00,
    totalNotional: 138870.24,
    totalPnl: -201.02,
    ytdReturn: -0.14,
    weightedBeta: 0.04,
    monthlyReturns: [0, 0, -0.98, -1.43, -2.82, 11.39, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "iShares MSCI Brazil ETF", ticker: "EWZ", weight: 5.04, beta: 0.73, notional: 46689.21, shares: 1126, entryPrice: 41.36, currentPrice: 38.28, pnl: -3467.08, ytdReturn: -7.43, monthlyReturns: [0,0,-0.98,0,0,0,0,0,0,0,0,0] },
      { name: "iShares MSCI Chile ETF", ticker: "ECH", weight: 2.88, beta: 0.74, notional: 26679.55, shares: 0, entryPrice: 41.21, currentPrice: 40.61, pnl: -381.52, ytdReturn: -1.41, monthlyReturns: [0,0,-1.43,0,0,0,0,0,0,0,0,0] },
      { name: "iShares MSCI South Africa ETF", ticker: "EZA", weight: 2.88, beta: 0.85, notional: 26679.55, shares: 0, entryPrice: 71.74, currentPrice: 69.72, pnl: -774.25, ytdReturn: -2.82, monthlyReturns: [0,0,-2.82,0,0,0,0,0,0,0,0,0] },
      { name: "Direxion Daily EM Bear 3X", ticker: "EDZ", weight: 4.19, beta: -1.96, notional: 38821.93, shares: 0, entryPrice: 16.68, currentPrice: 18.58, pnl: 4421.82, ytdReturn: 11.39, monthlyReturns: [0,0,11.39,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    name: "Short Crypto",
    totalWeight: 2.00,
    totalNotional: 18516.03,
    totalPnl: 416.61,
    ytdReturn: 2.25,
    weightedBeta: -0.03,
    monthlyReturns: [0, 0, 2.25, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "ProShares Short Bitcoin 1X ETF", ticker: "BITI", weight: 2.00, beta: -1.37, notional: 18516.03, shares: 0, entryPrice: 21.31, currentPrice: 21.79, pnl: 416.61, ytdReturn: 2.25, monthlyReturns: [0,0,2.25,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    name: "Nearshoring",
    totalWeight: 10.00,
    totalNotional: 92580.16,
    totalPnl: -919.93,
    ytdReturn: -0.99,
    weightedBeta: 0.05,
    monthlyReturns: [0, 0, -0.62, -2.09, -1.28, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "iShares MSCI Mexico ETF", ticker: "EWW", weight: 6.00, beta: 0.85, notional: 55548.10, shares: 707, entryPrice: 80.14, currentPrice: 79.72, pnl: -296.94, ytdReturn: -0.52, monthlyReturns: [0,0,-0.62,0,0,0,0,0,0,0,0,0] },
      { name: "iShares MSCI India ETF", ticker: "INDA", weight: 2.00, beta: 0.47, notional: 18516.03, shares: 390, entryPrice: 48.40, currentPrice: 47.41, pnl: -386.99, ytdReturn: -2.05, monthlyReturns: [0,0,-2.09,0,0,0,0,0,0,0,0,0] },
      { name: "iShares MSCI Vietnam ETF", ticker: "VNM", weight: 2.00, beta: 0.94, notional: 18516.03, shares: 962, entryPrice: 19.48, currentPrice: 19.24, pnl: -236.00, ytdReturn: -1.26, monthlyReturns: [0,0,-1.28,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    name: "Global Safe Havens",
    totalWeight: 10.00,
    totalNotional: 92580.16,
    totalPnl: -404.24,
    ytdReturn: -0.44,
    weightedBeta: 0.07,
    monthlyReturns: [0, 0, -0.10, -0.42, 0, 0, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "iShares MSCI Singapore ETF", ticker: "EWS", weight: 5.00, beta: 0.56, notional: 46290.08, shares: 1589, entryPrice: 29.19, currentPrice: 28.88, pnl: -492.59, ytdReturn: -1.05, monthlyReturns: [0,0,-0.10,0,0,0,0,0,0,0,0,0] },
      { name: "iShares MSCI Switzerland ETF", ticker: "EWL", weight: 5.00, beta: 0.81, notional: 46290.08, shares: 755, entryPrice: 61.14, currentPrice: 61.26, pnl: 88.35, ytdReturn: 0.19, monthlyReturns: [0,0,-0.42,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    name: "Global AI Value",
    totalWeight: 10.00,
    totalNotional: 92580.16,
    totalPnl: -3037.94,
    ytdReturn: -3.28,
    weightedBeta: 0.07,
    monthlyReturns: [0, 0, 0.24, -9.43, -4.69, 5.90, 0, 0, 0, 0, 0, 0],
    holdings: [
      { name: "WisdomTree Japan Hedged Equity ETF", ticker: "DXJ", weight: 2.64, beta: 0.41, notional: 24470.39, shares: 148, entryPrice: 165.41, currentPrice: 168.67, pnl: 482.58, ytdReturn: 1.97, monthlyReturns: [0,0,0.24,0,0,0,0,0,0,0,0,0] },
      { name: "iShares MSCI South Korea ETF", ticker: "EWY", weight: 2.64, beta: 1.27, notional: 24470.39, shares: 168, entryPrice: 151.15, currentPrice: 174.67, pnl: 3951.36, ytdReturn: 15.56, monthlyReturns: [0,0,-9.43,0,0,0,0,0,0,0,0,0] },
      { name: "iShares MSCI Taiwan ETF", ticker: "EWT", weight: 2.64, beta: 1.01, notional: 24470.39, shares: 303, entryPrice: 81.35, currentPrice: 92.59, pnl: 3405.72, ytdReturn: 13.82, monthlyReturns: [0,0,-4.69,0,0,0,0,0,0,0,0,0] },
      { name: "ProShares UltraShort QQQ", ticker: "SQQQ", weight: 2.07, beta: -3.43, notional: 19168.98, shares: 311, entryPrice: 79.69, currentPrice: 44.71, pnl: -10877.60, ytdReturn: -43.89, monthlyReturns: [0,0,5.90,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    name: "US Short (Direct)",
    totalWeight: 20.00,
    totalNotional: 185160.32,
    totalPnl: -12077.59,
    ytdReturn: -6.52,
    weightedBeta: 0.23,
    monthlyReturns: [0, 0, 5.54, 2.68, -0.90, 1.95, -0.38, 1.92, 2.77, 2.52, 0.30, 1.56],
    holdings: [
      { name: "Yelp Inc Cl A", ticker: "YELP", weight: 1.82, beta: 0.43, notional: 16832.76, shares: 591, entryPrice: 28.43, currentPrice: 23.88, pnl: 2686.73, ytdReturn: 15.99, monthlyReturns: [0,0,5.54,0,0,0,0,0,0,0,0,0] },
      { name: "Asana Inc Cl A", ticker: "ASAN", weight: 1.82, beta: 1.09, notional: 16832.76, shares: 2720, entryPrice: 6.16, currentPrice: 6.17, pnl: -13.95, ytdReturn: -0.08, monthlyReturns: [0,0,2.68,0,0,0,0,0,0,0,0,0] },
      { name: "Docusign Inc", ticker: "DOCU", weight: 1.82, beta: 0.95, notional: 16832.76, shares: 370, entryPrice: 45.47, currentPrice: 45.90, pnl: -160.95, ytdReturn: -0.96, monthlyReturns: [0,0,-0.90,0,0,0,0,0,0,0,0,0] },
      { name: "Salesforce Inc", ticker: "CRM", weight: 1.82, beta: 1.26, notional: 16832.76, shares: 96, entryPrice: 175.49, currentPrice: 174.03, pnl: 139.97, ytdReturn: 0.83, monthlyReturns: [0,0,1.95,0,0,0,0,0,0,0,0,0] },
      { name: "Pegasystems Inc", ticker: "PEGA", weight: 1.82, beta: 1.08, notional: 16832.76, shares: 460, entryPrice: 36.52, currentPrice: 34.39, pnl: 977.85, ytdReturn: 5.82, monthlyReturns: [0,0,-0.38,0,0,0,0,0,0,0,0,0] },
      { name: "SPDR S&P Homebuilders ETF", ticker: "XHB", weight: 1.82, beta: 1.36, notional: 16832.76, shares: 155, entryPrice: 108.68, currentPrice: 99.64, pnl: 1401.05, ytdReturn: 8.32, monthlyReturns: [0,0,1.92,0,0,0,0,0,0,0,0,0] },
      { name: "ARK Next Generation Internet ETF", ticker: "ARKW", weight: 1.82, beta: 1.34, notional: 16832.76, shares: 121, entryPrice: 138.41, currentPrice: 144.70, pnl: -760.87, ytdReturn: -4.54, monthlyReturns: [0,0,2.77,0,0,0,0,0,0,0,0,0] },
      { name: "Monday.com Ltd", ticker: "MNDY", weight: 1.82, beta: 1.21, notional: 16832.76, shares: 258, entryPrice: 65.42, currentPrice: 74.97, pnl: -2454.11, ytdReturn: -14.60, monthlyReturns: [0,0,2.52,0,0,0,0,0,0,0,0,0] },
      { name: "Workday Inc Cl A", ticker: "WDAY", weight: 1.82, beta: 1.11, notional: 16832.76, shares: 144, entryPrice: 116.62, currentPrice: 121.05, pnl: -637.39, ytdReturn: -3.80, monthlyReturns: [0,0,0.30,0,0,0,0,0,0,0,0,0] },
      { name: "Atlassian Corp Cl A", ticker: "TEAM", weight: 1.82, beta: 0.99, notional: 16832.76, shares: 241, entryPrice: 69.75, currentPrice: 85.95, pnl: -3904.46, ytdReturn: -23.23, monthlyReturns: [0,0,1.56,0,0,0,0,0,0,0,0,0] },
      { name: "Datadog Inc Cl A", ticker: "DDOG", weight: 1.82, beta: 1.26, notional: 16832.76, shares: 132, entryPrice: 127.40, currentPrice: 198.24, pnl: -9351.46, ytdReturn: -55.61, monthlyReturns: [0,0,2.02,0,0,0,0,0,0,0,0,0] },
    ],
  },
];

export const PORTFOLIO_SUMMARY: PortfolioSummary = {
  inceptionDate: "March 26, 2026",
  totalValue: 925801.61,
  liveValue: 926552.84,
  unrealizedPnl: 751.23,
  dailyReturn: 0.77,
  ytdReturn: 0.08,
  benchmarkReturn: 14.97,
  spVolatility: 12.14,
  portfolioVolatility: null,
  totalBeta: 0.12,
  monthlyReturns: [0, 0, -0.32, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  cashValue: 521174.97,
  cashPercent: 56.25,
  investedCapital: 404626.64,
  totalRealizedPnl: -10362.95,
  winCount: 14,
  lossCount: 9,
  longExposure: 78,
  shortExposure: 22,
};

export const SLEEVE_CLASSIFICATIONS: SleeveClassification[] = [
  { sleeve: "Long Precious Metals",   category: "protective", color: "#22c55e" },
  { sleeve: "Long Global Metal Miners", category: "tactical",  color: "#C4A95A" },
  { sleeve: "US Core",                category: "core",       color: "#7BA4C7" },
  { sleeve: "Global Relative Value",  category: "tactical",   color: "#f97316" },
  { sleeve: "Short Crypto",           category: "hedge",      color: "#9333ea" },
  { sleeve: "Nearshoring",            category: "tactical",   color: "#06b6d4" },
  { sleeve: "Global Safe Havens",     category: "protective", color: "#10b981" },
  { sleeve: "Global AI Value",        category: "tactical",   color: "#eab308" },
  { sleeve: "US Short (Direct)",      category: "hedge",      color: "#D4645A" },
];
