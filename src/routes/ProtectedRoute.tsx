import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#FAFAF8' }}
    >
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          style={{ color: '#E07B39' }}
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span
          className="text-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#9CA3AF' }}
        >
          Loading…
        </span>
      </div>
    </div>
  )
}