
import { createClient } from '@supabase/supabase-js';

// These variables are injected via vite.config.ts from the Vercel environment
const supabaseUrl = process.env.SUPABASE_URL || 'https://ndbwhvjwifbxqdyakhke.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_iKXUBmegp7VoGoZAnXMCtw_-3BgOZMo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
