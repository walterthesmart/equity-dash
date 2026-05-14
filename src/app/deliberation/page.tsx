import { DeliberationPage } from '@/components/deliberation/DeliberationPage';
import { getDeliberationData } from '@/lib/serverSheets';

export default async function DeliberationRoute() {
  const initialData = await getDeliberationData();
  return <DeliberationPage initialRows={initialData || undefined} />;
}
