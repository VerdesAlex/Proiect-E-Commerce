import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://agnlsyoztkgxgpnljlhy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbmxzeW96dGtneGdwbmxqbGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTUxMTksImV4cCI6MjA4ODU3MTExOX0.KdRE0-NjGT9w1KJnmUbETQPym4csNHdr16xlhdTM8Es'

export const supabase = createClient(supabaseUrl, supabaseKey)