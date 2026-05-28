import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// ── Environment validation ────────────────────────────────────────────────────
// Fail loudly at startup — a missing env var causes subtle runtime errors
// that are hard to trace. Better to crash immediately with a clear message.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error(
    '[Clarity] Missing VITE_SUPABASE_URL.\n' +
    'Copy .env.example → .env.local and fill in your Supabase project URL.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    '[Clarity] Missing VITE_SUPABASE_ANON_KEY.\n' +
    'Copy .env.example → .env.local and fill in your Supabase anon key.'
  )
}

// ── Client singleton ──────────────────────────────────────────────────────────
// One instance for the entire app. Import this everywhere — never call
// createClient() directly in components or hooks.
//
// Typed with the Database generic so all .from() calls are fully type-safe.

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage so users stay signed in after refresh.
    persistSession: true,
    // Automatically refresh the JWT before it expires.
    autoRefreshToken: true,
    // Detect session from URL hash after email confirmation redirect.
    detectSessionInUrl: true,
  },
})
