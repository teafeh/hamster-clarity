import { createContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase }    from '@/lib/supabase'
import { authService } from '@/services/authService'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Profile {
  id:                   string
  onboarding_completed: boolean
  created_at:           string
}

interface AuthContextValue {
  user:           User | null
  session:        Session | null
  profile:        Profile | null
  loading:        boolean
  signUp:         (email: string, password: string) => Promise<void>
  signIn:         (email: string, password: string) => Promise<void>
  signOut:        () => Promise<void>
  refreshProfile: () => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // ─── Profile fetch ────────────────────────────────────────────────────────
  //
  // The 10-second timeout is load-bearing.
  //
  // On a browser refresh the Supabase database connection starts cold. Without
  // a deadline the underlying fetch can stall indefinitely at the TCP level —
  // no resolve, no reject, no error. The await never returns, the finally block
  // never runs, setLoading(false) is never called, and the app is stuck on the
  // loading screen forever.
  //
  // With the timeout, a stalled connection fails cleanly after 10 s:
  //   catch → setProfile(null) → function returns → finally → setLoading(false)
  //
  // setUser / setSession are set before this function is called, so a timeout
  // here only affects profile — it never clears the authenticated user.

  const fetchProfile = async (userId: string): Promise<void> => {
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timed out')), 10000)
      )

      const query = supabase
        .from('profiles')
        .select('id, onboarding_completed, created_at')
        .eq('id', userId)
        .single()

      const { data, error } = await Promise.race([query, timeout])

      if (error) {
        console.error('[AuthContext] Profile fetch error:', error.message)
        setProfile(null)
        return
      }

      setProfile(data)
    } catch (err) {
      console.error('[AuthContext] Profile fetch failed:', err)
      setProfile(null)
    }
  }

  // Exposed to consumers — called after onboarding completes.
  const refreshProfile = async (): Promise<void> => {
    if (!user) return
    await fetchProfile(user.id)
  }

  // ─── Auth state subscription ──────────────────────────────────────────────

  useEffect(() => {
    let mounted = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return

        // TOKEN_REFRESHED only rotates the JWT — identity and profile unchanged.
        // Update session silently with no loading screen and no profile refetch.
        if (event === 'TOKEN_REFRESHED') {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
          return
        }

        // All other events (INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, USER_UPDATED)
        // require full resolution. setLoading(true) here prevents ProtectedRoute
        // from making routing decisions on partially-resolved state.
        setLoading(true)

        try {
          // User and session are set immediately — before any async work.
          // A subsequent profile fetch failure cannot and must not clear an
          // authenticated user.
          setSession(currentSession)
          setUser(currentSession?.user ?? null)

          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id)
          } else {
            setProfile(null)
          }
        } catch (err) {
          console.error('[AuthContext] Auth state change error:', err)
          if (mounted) setProfile(null)
        } finally {
          // This is the single point where loading transitions to false.
          // Reached after every event — success, failure, or timeout.
          if (mounted) setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ─── Auth actions ─────────────────────────────────────────────────────────

  const signUp = async (email: string, password: string): Promise<void> => {
    await authService.signUp(email, password)
  }

  const signIn = async (email: string, password: string): Promise<void> => {
    await authService.signIn(email, password)
  }

  const signOut = async (): Promise<void> => {
    await authService.signOut()
    // onAuthStateChange SIGNED_OUT handles clearing user / session / profile.
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}