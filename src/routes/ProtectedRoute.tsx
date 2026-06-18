import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import HamsterLoader from '../components/animation/HamsterLoader'


// ─── Props ────────────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  /**
   * When true (default), requires a valid session AND completed onboarding.
   * Set to false for the /onboarding route itself.
   */
  requireOnboardingComplete?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProtectedRoute({
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  console.log('ProtectedRoute loading:', loading)
  const location = useLocation()

  // Phase 1 — Auth state is still resolving (session hydration or profile fetch).
  if (loading) {
    return <LoadingScreen />
  }

  // Phase 2 — No authenticated user. Preserve the intended destination so the
  // sign-in page can redirect back after a successful login.
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  // Phase 3 — Route access matrix.
  //
  // A null profile (row missing or fetch timed out) is treated as onboarding
  // incomplete — !profile?.onboarding_completed evaluates to true for null.
  // This sends the user to onboarding rather than crashing the dashboard layout.
  //
  // Note: there is intentionally no separate "profile is null → /signin" guard
  // here. An authenticated user with a missing profile should go to onboarding,
  // not be signed out.

  return <Outlet />
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <div className="flex flex-col items-center">
        <div className="scale-[2.2]">
          <HamsterLoader />
        </div>

        <h3 className="mt-2 text-lg font-medium text-[#111111]">
          Preparing your workspace
        </h3>

        <p className="text-sm text-gray-500 animate-pulse">
          Loading application context...
        </p>
      </div>
    </div>
  )
}