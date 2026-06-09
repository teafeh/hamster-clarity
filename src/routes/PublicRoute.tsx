import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import HamsterLoader from '@/components/animation/HamsterLoader'

export default function PublicRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center">
          <div className="scale-[2.2]">
            <HamsterLoader />
          </div>

          <h3 className="mt-2 text-lg font-medium text-[#111111]">
            Checking your session
          </h3>

          <p className="text-sm text-gray-500 animate-pulse">
            Just a moment...
          </p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}