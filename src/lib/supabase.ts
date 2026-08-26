import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cuqzrphvqiaaprqvfzdz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_SqGX4F7Zv9lrkRHiesX5AQ_sBT2q1JC';
export const supabase = createClient(supabaseUrl, supabaseKey);
