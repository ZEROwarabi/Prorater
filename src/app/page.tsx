import { supabase } from '../lib/supabase';
import ClientPage from './ClientPage';

export const revalidate = 3600;

export default async function Page() {
  const { data, error } = await supabase.from('reviews').select('*').limit(10000);
  if (error) {
    console.error('Error fetching:', error);
    return <div>Error loading data.</div>;
  }
  return <ClientPage initialData={data || []} />;
}
