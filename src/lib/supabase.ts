import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time or when env vars are missing, return a mock client
    // This prevents build errors during static generation
    console.warn('Supabase credentials not configured. Authentication will not work.')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Singleton instance for client-side
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (typeof window === 'undefined') {
    // Server-side: create a new instance each time
    return createClient()
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}
