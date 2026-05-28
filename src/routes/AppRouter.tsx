import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/routes/ProtectedRoute'
import SignUpPage from '@/pages/SignUpPage'
import SignInPage from '@/pages/SignInPage'
import DashboardPage from '@/pages/DashboardPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}