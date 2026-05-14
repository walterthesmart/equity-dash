import { google } from 'googleapis';

export async function getDeliberationData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1Cdb7qLTSw3X1m9OfCyCqEC-iyv8Qq4hLBrVt7aqgmEM',
      range: "'Q2 New Strategy'!A1:Z200",
    });

    const rows = response.data.values || [];
    
    const parsedHoldings = [];
    let currentSleeve = '';

    const clean = (val: string) => (val || '').trim().replace(/^"|"$/g, '').trim();
    const parseNumber = (val: string) => {
      const c = clean(val);
      if (!c || c === '#REF!' || c === '-') return 0;
      let s = c.replace(/\$/g, '').replace(/,/g, '').replace(/\s/g, '');
      if (s.startsWith('(') && s.endsWith(')')) s = '-' + s.slice(1, -1);
      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };
    const parsePct = (val: string) => {
      const c = clean(val);
      if (!c || c === '#REF!' || c === '#DIV/0!') return 0;
      const s = c.replace(/%/g, '').replace(/,/g, '').replace(/\s/g, '');
      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };

    for (const row of rows.slice(5)) {
      if (!row || row.length < 2) continue;
      
      const colB = clean(row[1]);
      const colC = clean(row[2]);
      
      if (!colB || colB === 'TOTAL' || colB === 'Total') continue;

      if (!colC) {
        // It's a sleeve header
        currentSleeve = colB;
        continue;
      }

      // If it's a holding, it must have a ticker (colC)
      if (row.length < 3) continue;

      // It's a holding
      const weight = parsePct(row[3]);
      const beta = parseNumber(row[4]);
      const entryPrice = parseNumber(row[7]);
      const currentPrice = parseNumber(row[8]);
      const ytdGain = parseNumber(row[9]);
      const ytdReturn = parsePct(row[10]);
      
      const monthlyReturns = [];
      for (let m = 11; m < 23; m++) {
        monthlyReturns.push(parsePct(row[m] || ''));
      }

      parsedHoldings.push({
        id: `${currentSleeve}-${colC}`,
        sleeve: currentSleeve,
        ticker: colC.toUpperCase().replace('BATS:', ''),
        name: colB,
        weight: weight,
        beta: beta,
        entryPrice: entryPrice,
        currentPrice: currentPrice,
        itdGain: ytdGain,
        itdReturn: ytdReturn,
        ytdReturn: ytdReturn,
        monthlyReturns: monthlyReturns,
      });
    }

    return parsedHoldings;
  } catch (error) {
    console.error('Failed to fetch Deliberation data', error);
    return null;
  }
}
