import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tbnlhhrjlzacjjoznwbb.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

