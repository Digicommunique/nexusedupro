
import { createClient } from '@supabase/supabase-js';

// Fallback to defaults if process.env is not defined or keys are missing
const supabaseUrl = process.env.SUPABASE_URL || 'https://ndbwhvjwifbxqdyakhke.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_iKXUBmegp7VoGoZAnXMCtw_-3BgOZMo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
