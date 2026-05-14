import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json(); // e.g., { range: 'Deliberation!A1', values: [['Ticker', 'Weight'], ['AAPL', 5]] }

    // 1. Authenticate using the Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Write the data to the sheet
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: '1Cdb7qLTSw3X1m9OfCyCqEC-iyv8Qq4hLBrVt7aqgmEM', // New Sankore T-01 Sheet ID
      range: body.range,
      valueInputOption: 'USER_ENTERED', // Formats numbers/dates correctly
      requestBody: {
        values: body.values,
      },
    });

    return NextResponse.json({ success: true, updatedCells: response.data.updatedCells });
  } catch (error: any) {
    console.error('Failed to update sheet:', error.message);
    return NextResponse.json({ error: 'Failed to update sheet', details: error.message }, { status: 500 });
  }
}
