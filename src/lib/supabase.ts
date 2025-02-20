import { createClient } from '@supabase/supabase-js';
import { FaHome } from 'react-icons/fa';
import { GiWaffleIron } from 'react-icons/gi';
import { BsSearch, BsPlus } from 'react-icons/bs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});

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