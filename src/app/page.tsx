import { getPortfolioData } from '@/lib/sheets';
import { Q2ActualDashboard } from './Q2ActualDashboard';

export const revalidate = 300; // ISR: re-fetch every 5 minutes

export default async function Q2ActualPage() {
  const data = await getPortfolioData();

  return (
    <Q2ActualDashboard
      summary={data.summary}
      sleeves={data.sleeves}
      classifications={data.classifications}
      lastUpdated={data.lastUpdated}
    />
  );
}
