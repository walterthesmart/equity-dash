require('dotenv').config({ path: '.env' });
const { google } = require('googleapis');
const fs = require('fs');

async function run() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1hUaQedmDxSO_0Mxt7S8tBsv81J1bOCFn9R-cqCicjVY',
    range: "'Deliberation v1.1'!A1:Z100",
  });
  
  fs.writeFileSync('delib_dump.json', JSON.stringify(response.data.values, null, 2));
  console.log("Done");
}
run();
