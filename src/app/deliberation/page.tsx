import { DeliberationPage } from '@/components/deliberation/DeliberationPage';
import { getDeliberationData } from '@/lib/serverSheets';

export const revalidate = 0; // Disable Next.js caching to always fetch latest spreadsheet data

export default async function DeliberationRoute() {
  const initialData = await getDeliberationData();
  return <DeliberationPage initialRows={initialData || undefined} />;
}
