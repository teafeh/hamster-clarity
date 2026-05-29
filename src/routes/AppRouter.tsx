import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute  from '@/routes/ProtectedRoute'
import SignUpPage      from '@/pages/SignUpPage'
import SignInPage      from '@/pages/SignInPage'
import OnboardingPage  from '@/pages/OnboardingPage'
import DashboardPage   from '@/pages/DashboardPage'

export default function AppRouter() {
  return (

      <Routes>

        {/* ── Public ─────────────────────────────────────────────────────── */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* ── Auth required — onboarding not yet complete ─────────────────── */}
        <Route element={<ProtectedRoute requireOnboardingComplete={false} />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* ── Auth required — onboarding must be complete ─────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* ── Fallback ────────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/signin" replace />} />

      </Routes>

  )
}