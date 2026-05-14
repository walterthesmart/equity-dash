import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.get({
      spreadsheetId: '1Cdb7qLTSw3X1m9OfCyCqEC-iyv8Qq4hLBrVt7aqgmEM',
    });

    console.log(response.data.sheets.map(s => s.properties.title));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
run();
