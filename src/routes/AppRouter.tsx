import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/routes/ProtectedRoute'
import PublicRoute from '@/routes/PublicRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import SignUpPage from '@/pages/SignUpPage'
import SignInPage from '@/pages/SignInPage'
import OnboardingPage from '@/pages/OnboardingPage'
import DashboardHomePage from '@/pages/dashboard/DashboardHomePage'
import ServicesPage from '@/pages/ServicesPage'
import CustomersPage from '@/pages/dashboard/CustomersPage'
import AppointmentsPage from '@/pages/dashboard/AppointmentsPage'
import PublicAppointmentPage from '@/pages/public/PublicAppointmentPage'
import BookingSuccessPage from '@/pages/public/BookingSuccessPage'
import PublicBookingPage from '@/pages/public/PublicBookingPage'
import NotFoundPage from '../pages/NotFoundPage'
import CRMPage from '@/pages/dashboard/CRMPage'
import SettingsPage from '@/pages/dashboard/SettingsPage'
import AutomationsPage from '@/pages/dashboard/AutomationsPage'

export default function AppRouter() {
  return (
    <Routes>

      {/* ── Root redirect ─────────────────────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── Public auth pages — inaccessible when a valid session exists ───── */}
      {/* PublicRoute redirects authenticated users to /dashboard instead of   */}
      {/* rendering sign-in or sign-up.                                        */}
      <Route element={<PublicRoute />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="/booking/:appointmentId"
          element={<PublicAppointmentPage />}
        />

        <Route
          path="/booking-success/:appointmentId"
          element={<BookingSuccessPage />}
        />

        <Route
          path="/book/:businessSlug"
          element={<PublicBookingPage />}
        />
      </Route>


      {/* ── Auth required — onboarding not yet complete ───────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/onboarding"
          element={<OnboardingPage />}
        />
      </Route>

      {/* ── Auth required — onboarding must be complete ───────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="automations" element={<AutomationsPage />} />
        </Route>
        
      </Route>

      {/* ── Catch-all ─────────────────────────────────────────────────────── */}
      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
  )
}