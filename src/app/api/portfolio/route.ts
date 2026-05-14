import { getPortfolioData } from '@/lib/sheets';

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function GET() {
  try {
    const data = await getPortfolioData();
    return Response.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message, sleeves: [], summary: {}, classifications: [] }, { status: 500 });
  }
}
