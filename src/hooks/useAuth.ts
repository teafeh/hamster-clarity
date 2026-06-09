import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

/**
 * Global application authentication hook.
 * Provides a single source of truth for user credentials, active sessions, 
 * profile onboarding states, and core authentication state transitions.
 * * @throws {Error} If executed outside of a valid <AuthProvider> context tree.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}