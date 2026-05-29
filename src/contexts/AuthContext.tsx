import { createContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
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

  // ─── Profile fetch ──────────────────────────────────────────────────────────

  const fetchProfile = async (userId: string): Promise<void> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, onboarding_completed, created_at')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Failed to fetch profile:', error.message)
      setProfile(null)
      return
    }

    setProfile(data)
  }

  // Exposed to consumers — called after onboarding completes
  const refreshProfile = async (): Promise<void> => {
    if (!user) return
    await fetchProfile(user.id)
  }

  // ─── Session hydration ──────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true

    const hydrate = async () => {
      const session = await authService.getSession()

      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      }

      setLoading(false)
    }

    hydrate()

    // Keep auth state in sync across tabs and token refreshes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ─── Auth actions ───────────────────────────────────────────────────────────

  const signUp = async (email: string, password: string): Promise<void> => {
    await authService.signUp(email, password)
  }

  const signIn = async (email: string, password: string): Promise<void> => {
    await authService.signIn(email, password)
  }

  const signOut = async (): Promise<void> => {
    await authService.signOut()
    setProfile(null)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}