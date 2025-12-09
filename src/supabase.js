import { createClient } from '@supabase/supabase-js'

// The URL you provided
const supabaseUrl = 'https://hkxqqkhijqzsudhrxyfp.supabase.co'

// Access the key using the REACT_APP_ prefix
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)