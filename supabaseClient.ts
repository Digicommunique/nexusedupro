
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndbwhvjwifbxqdyakhke.supabase.co';
const supabaseAnonKey = 'sb_publishable_iKXUBmegp7VoGoZAnXMCtw_-3BgOZMo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
