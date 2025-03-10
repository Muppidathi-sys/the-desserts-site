import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .single();
    
    if (error) throw error;
    console.log('Supabase connection successful:', data);
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
}; 