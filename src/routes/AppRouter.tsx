import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute    from '@/routes/ProtectedRoute'
import DashboardLayout   from '@/components/layout/DashboardLayout'
import SignUpPage        from '@/pages/SignUpPage'
import SignInPage        from '@/pages/SignInPage'
import OnboardingPage    from '@/pages/OnboardingPage'
import DashboardHomePage from '@/pages/dashboard/DashboardHomePage'

// ─── Stubs — replaced when sprints are built ──────────────────────────────────

function ServicesStub() {
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto w-full">
      <p
        className="text-xs font-semibold tracking-widest uppercase mb-3"
        style={{ color: '#E07B39', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Sprint 2
      </p>
      <h2
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
      >
        Services
      </h2>
      <p className="text-sm" style={{ color: '#6B7280' }}>
        Service management is coming in the next sprint.
      </p>
    </div>
  )
}

function ComingSoonStub({ label }: { label: string }) {
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto w-full">
      <h2
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
      >
        {label}
      </h2>
      <p className="text-sm" style={{ color: '#6B7280' }}>
        This module is not yet available.
      </p>
    </div>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function AppRouter() {
  return (
      <Routes>

        {/* ── Public ───────────────────────────────────────────────────────── */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* ── Auth only — onboarding not required ──────────────────────────── */}
        <Route element={<ProtectedRoute requireOnboardingComplete={false} />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* ── Auth + onboarding complete ────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"              index element={<DashboardHomePage />} />
            <Route path="/dashboard/services"     element={<ServicesStub />} />
            <Route path="/dashboard/customers"    element={<ComingSoonStub label="Customers" />} />
            <Route path="/dashboard/appointments" element={<ComingSoonStub label="Appointments" />} />
          </Route>
        </Route>

        {/* ── Fallback ─────────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/signin" replace />} />

      </Routes>
   
  )
}