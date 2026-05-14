/**
 * Sankore T-01 — Google Sheets CSV Parser
 * Replaces the Python FastAPI server.py — same logic, TypeScript.
 */
import type { SleeveCategory } from '@/lib/types';

const SPREADSHEET_ID = '1KTHRVEl04dsWyQIRgizrh1NQJfVX6oyW';
const SHEET_Q2_ACTUAL = 'Q2 Actual';
const SHEET_Q2_HEDGED = 'Q2 Version Hedged';
const CSV_URL_ACTUAL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_Q2_ACTUAL)}`;
const CSV_URL_HEDGED = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_Q2_HEDGED)}`;

// ── CSV parsing ──

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(current);
      current = '';
      if (row.length > 0) rows.push(row);
      row = [];
    } else {
      current += ch;
    }
  }
  row.push(current);
  if (row.some(c => c !== '')) rows.push(row);
  return rows;
}

function clean(val: string): string {
  return val.trim().replace(/^"|"$/g, '').trim();
}

function parseNumber(val: string): number | null {
  const c = clean(val);
  if (!c || c === '#REF!' || c === '-') return null;
  let s = c.replace(/\$/g, '').replace(/,/g, '').replace(/\s/g, '');
  if (s.startsWith('(') && s.endsWith(')')) s = '-' + s.slice(1, -1);
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function parsePct(val: string): number | null {
  const c = clean(val);
  if (!c || c === '#REF!') return null;
  const s = c.replace(/%/g, '').replace(/,/g, '').replace(/\s/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

// ── Fetch sheet ──

async function fetchSheet(url: string): Promise<string[][]> {
  const resp = await fetch(url, { next: { revalidate: 300 } });
  if (!resp.ok) throw new Error(`Sheet fetch failed: ${resp.status}`);
  const text = await resp.text();
  return parseCSV(text);
}

// ── Sleeve classification map ──

const CLASSIFICATIONS_MAP: Record<string, { category: SleeveCategory; color: string }> = {
  'Long Precious Metals':     { category: 'protective', color: '#22c55e' },
  'Long Global Metal Miners': { category: 'tactical',   color: '#C4A95A' },
  'US Core':                  { category: 'core',       color: '#7BA4C7' },
  'Global Relative Value':    { category: 'tactical',   color: '#f97316' },
  'Short Crypto':             { category: 'hedge',      color: '#9333ea' },
  'Nearshoring':              { category: 'tactical',   color: '#06b6d4' },
  'Global Safe Havens':       { category: 'protective', color: '#10b981' },
  'Global AI Value':          { category: 'tactical',   color: '#eab308' },
  'US Short (Direct)':        { category: 'hedge',      color: '#D4645A' },
};

// ── Parse monthly returns from Q2 Version Hedged ──

function parseMonthlyReturns(rows: string[][]) {
  const sleeveMonthly: Record<string, number[]> = {};
  const holdingMonthly: Record<string, number[]> = {};
  let portfolioMonthly: number[] = new Array(12).fill(0);
  let currentSleeve: string | null = null;

  for (const row of rows.slice(4)) {
    if (row.length < 10) continue;
    const colB = clean(row[1]);
    const colC = clean(row[2]);
    const colD = row[3] || '';
    if (!colB || colB === 'Securities') continue;

    // Parse months 1-12 from columns 11-22
    const monthly: number[] = [];
    for (let m = 11; m < Math.min(23, row.length); m++) {
      monthly.push(parsePct(row[m]) ?? 0);
    }
    while (monthly.length < 12) monthly.push(0);

    const isHeader = colC === '' && parsePct(colD) === null && colB !== 'TOTAL' && colB !== 'Total';
    if (isHeader) { currentSleeve = colB; continue; }
    if (colB === 'TOTAL' && currentSleeve) {
      sleeveMonthly[currentSleeve] = monthly;
      currentSleeve = null;
      continue;
    }
    if (colB === 'Total') { portfolioMonthly = monthly; continue; }
    if (colC) holdingMonthly[colC.toUpperCase().replace('BATS:', '')] = monthly;
  }

  return { sleeveMonthly, holdingMonthly, portfolioMonthly };
}

// ── Parse Q2 Actual sheet ──

function parseActualSheet(rows: string[][]) {
  const spVolatility = parsePct(rows[0]?.[2] || '');
  const portfolioVolatility = parsePct(rows[1]?.[2] || '');
  const dailyReturn = parsePct(rows[2]?.[2] || '');
  const itdReturn = parsePct(rows[3]?.[2] || '');
  const benchmarkReturn = parsePct(rows[4]?.[2] || '');
  const totalBetaRaw = parseNumber(rows[5]?.[2] || '');

  const headerRow = rows[6] || [];
  const dateStr = clean(headerRow[0] || '');
  const capitalBase = parseNumber(headerRow[5] || '');

  interface Holding {
    name: string; ticker: string; weight: number; beta: number;
    notional: number; shares: number; entryPrice: number; currentPrice: number;
    pnl: number; ytdReturn: number; monthlyReturns: number[];
    dailyReturn: number; realizedPnl: number; liveValue: number;
    currentWeight: number; weightDeviation: number; rebalanceAmount: number;
    tradeDirection: string;
  }
  interface Sleeve {
    name: string; totalWeight: number; totalNotional: number; totalPnl: number;
    ytdReturn: number; weightedBeta: number; monthlyReturns: number[]; holdings: Holding[];
  }

  const sleeves: Sleeve[] = [];
  let currentSleeve: string | null = null;
  let currentHoldings: Holding[] = [];

  // Cash & portfolio-level data
  let cashValue = 0;
  let cashPercent = 0;
  let totalRealizedPnl = 0;
  let investedCapital = 0;
  let portfolioLiveValue = 0;
  let winCount = 0;
  let lossCount = 0;

  for (const row of rows.slice(8)) {
    if (row.length < 10) continue;
    const colB = clean(row[1]);
    const colC = clean(row[2]);
    const colD = row[3] || '';
    const colE = row[4] || '';
    const colF = row[5] || '';
    const colG = row[6] || '';
    const colH = row[7] || '';
    const colI = row[8] || '';
    const colJ = row[9] || '';
    const colK = row[10] || '';
    const colL = row[11] || '';
    const colM = row[12] || '';
    const colN = row[13] || '';
    const colO = row[14] || '';
    const colP = row[15] || '';
    const colQ = row[16] || '';
    const colR = row[17] || '';
    const colS = row[18] || '';
    const colT = row[19] || '';

    if (!colB) continue;
    if (colB === 'Securities') continue;

    // ── Cash row ──
    if (colB === 'Cash') {
      cashValue = parseNumber(colG) ?? parseNumber(colO) ?? 0;
      cashPercent = parsePct(colP) ?? 0;
      continue;
    }

    // ── Total (portfolio summary) row ──
    if (colB === 'Total') {
      portfolioLiveValue = parseNumber(colO) ?? 0;
      // Check row after Total for invested capital
      continue;
    }

    const isHeader = colC === '' && parsePct(colD) === null && colB !== 'TOTAL';
    if (isHeader) { currentSleeve = colB; currentHoldings = []; continue; }

    if (colB === 'TOTAL' && currentSleeve) {
      const totalPnl = parseNumber(colK) ?? parseNumber(colN) ?? 0;
      const totalNotional = parseNumber(colF) ?? 0;
      const sleeveLiveValue = parseNumber(colO) ?? 0;
      sleeves.push({
        name: currentSleeve,
        totalWeight: parsePct(colD) ?? 0,
        totalNotional,
        totalPnl,
        ytdReturn: totalNotional > 0 && totalPnl !== 0 ? Math.round((totalPnl / totalNotional) * 10000) / 100 : 0,
        weightedBeta: parseNumber(colE) ?? 0,
        monthlyReturns: new Array(12).fill(0),
        holdings: [...currentHoldings],
      });
      currentSleeve = null;
      currentHoldings = [];
      continue;
    }

    // ── Individual holding row ──
    const holdingPnl = parseNumber(colK) ?? 0;
    const holdingRealizedPnl = parseNumber(colM) ?? 0;
    const holdingLiveValue = parseNumber(colO) ?? 0;
    const holdingDailyReturn = parsePct(colJ) ?? 0;

    totalRealizedPnl += holdingRealizedPnl;
    if (holdingPnl > 0) winCount++;
    else if (holdingPnl < 0) lossCount++;

    currentHoldings.push({
      name: colB,
      ticker: colC.toUpperCase().replace('BATS:', ''),
      weight: parsePct(colD) ?? 0,
      beta: parseNumber(colE) ?? 0,
      notional: parseNumber(colF) ?? 0,
      shares: Math.round(parseNumber(colG) ?? 0),
      entryPrice: parseNumber(colH) ?? 0,
      currentPrice: parseNumber(colI) ?? 0,
      pnl: holdingPnl,
      ytdReturn: parsePct(colL) ?? 0,
      monthlyReturns: new Array(12).fill(0),
      dailyReturn: holdingDailyReturn,
      realizedPnl: holdingRealizedPnl,
      liveValue: holdingLiveValue,
      currentWeight: parsePct(colP) ?? 0,
      weightDeviation: parsePct(colQ) ?? 0,
      rebalanceAmount: parseNumber(colS) ?? 0,
      tradeDirection: clean(colT) || '',
    });
  }

  // Try to parse invested capital from row after Total
  for (let i = 8; i < rows.length; i++) {
    const r = rows[i];
    if (r.length >= 6 && clean(r[1]) === '' && clean(r[2]) === '') {
      const possibleInvested = parseNumber(r[5] || '');
      if (possibleInvested && possibleInvested > 100000 && possibleInvested < 1000000) {
        investedCapital = possibleInvested;
        break;
      }
    }
  }

  const totalPnl = sleeves.reduce((s, sl) => s + sl.totalPnl, 0);
  const totalBeta = sleeves.reduce((s, sl) => s + sl.weightedBeta, 0);
  const cap = capitalBase ?? 925801.61;

  // Compute long/short exposure
  const longExposure = sleeves.filter(s => s.weightedBeta > 0).reduce((s, sl) => s + sl.totalWeight, 0);
  const shortExposure = sleeves.filter(s => s.weightedBeta < 0).reduce((s, sl) => s + sl.totalWeight, 0);

  return {
    summary: {
      inceptionDate: 'March 26, 2026',
      totalValue: cap,
      liveValue: portfolioLiveValue || (cap + totalPnl),
      unrealizedPnl: totalPnl,
      dailyReturn: dailyReturn ?? 0,
      ytdReturn: itdReturn ?? 0,
      itdReturn: itdReturn ?? 0,
      mtdReturn: 0,
      benchmarkReturn: benchmarkReturn ?? 14.43,
      spVolatility: spVolatility ?? 12.14,
      portfolioVolatility,
      totalBeta: Math.round((totalBetaRaw ?? totalBeta) * 100) / 100,
      monthlyReturns: new Array(12).fill(0),
      // Enhanced fields
      cashValue,
      cashPercent,
      investedCapital: investedCapital || (cap - cashValue),
      totalRealizedPnl,
      winCount,
      lossCount,
      longExposure,
      shortExposure,
    },
    sleeves,
    classifications: sleeves.map(s => ({
      sleeve: s.name,
      ...(CLASSIFICATIONS_MAP[s.name] || { category: 'tactical' as SleeveCategory, color: '#888' }),
    })),
    lastUpdated: dateStr,
  };
}

// ── Public function ──

export async function getPortfolioData() {
  const [actualRows, hedgedRows] = await Promise.all([
    fetchSheet(CSV_URL_ACTUAL),
    fetchSheet(CSV_URL_HEDGED),
  ]);

  const data = parseActualSheet(actualRows);
  const monthly = parseMonthlyReturns(hedgedRows);

  // Merge monthly returns
  for (const sleeve of data.sleeves) {
    if (monthly.sleeveMonthly[sleeve.name]) {
      sleeve.monthlyReturns = monthly.sleeveMonthly[sleeve.name];
    }
    for (const h of sleeve.holdings) {
      if (monthly.holdingMonthly[h.ticker]) {
        h.monthlyReturns = monthly.holdingMonthly[h.ticker];
      }
    }
  }
  data.summary.monthlyReturns = monthly.portfolioMonthly;

  // ── Fix sleeves with missing monthly returns ──
  // For sleeves like "Global Relative Value" that don't exist in the
  // hedged sheet, compute sleeve-level monthly returns from individual
  // holdings that DO have monthly data.
  for (const sleeve of data.sleeves) {
    const hasSleeveMonthly = sleeve.monthlyReturns.some(v => v !== 0);
    if (!hasSleeveMonthly) {
      const holdingsWithData = sleeve.holdings.filter(h => h.monthlyReturns.some(v => v !== 0));
      if (holdingsWithData.length > 0) {
        const totalHoldingWeight = holdingsWithData.reduce((s, h) => s + h.weight, 0);
        if (totalHoldingWeight > 0) {
          for (let m = 0; m < 12; m++) {
            sleeve.monthlyReturns[m] = holdingsWithData.reduce(
              (s, h) => s + (h.weight / totalHoldingWeight) * h.monthlyReturns[m], 0
            );
            // Round to 2 decimal places
            sleeve.monthlyReturns[m] = Math.round(sleeve.monthlyReturns[m] * 100) / 100;
          }
        }
      }
    }
  }

  const currentMonthIdx = new Date().getMonth();
  data.summary.mtdReturn = data.summary.monthlyReturns[currentMonthIdx] || 0;

  return data;
}
