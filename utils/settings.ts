import { supabase } from './supabase';

export async function getSetting(key: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Error fetching setting:', error);
    return null;
  }

  return data?.value;
}

export async function setSetting(key: string, value: any) {
  const { data, error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select();

  if (error) {
    console.error('Error setting value:', error);
    return false;
  }

  return true;
}
