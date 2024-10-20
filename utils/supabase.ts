import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xhumokhyxvcskflijhoo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodW1va2h5eHZjc2tmbGlqaG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MzAxODAsImV4cCI6MjA0NTAwNjE4MH0.BLNZoSncu7Wk-7NQnGi74bVa0gt_cMRM_9ROB99ocZk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
