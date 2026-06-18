import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import TourModal from '@/components/tour/TourModal'
import { useBusiness } from '@/hooks/useBusiness'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { business } = useBusiness()
  const { profile } = useAuth()
  const { pathname } = useLocation()
  const [showTour, setShowTour] =
    useState(false)

  // Gracefully close mobile sidebar drawer overlay immediately upon navigation
  useEffect(() => {
    setSidebarOpen(false)
    
  }, [pathname])

  useEffect(() => {
    if (!business || !profile) return

    // User must finish onboarding first
    if (!profile.onboarding_completed) {
      setShowTour(false)
      return
    }

    // Only then allow tour
    if (!business.tour_completed) {
      setShowTour(true)
    }
  }, [business, profile])


  const handleTourComplete = async () => {
    if (!business) return

    await supabase
      .from('businesses')
      .update({
        tour_completed: true,
      })
      .eq('id', business.id)

    setShowTour(false)
  }

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-[#FAFAF8]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      
      {/* Responsive Mobile/Desktop Navigational Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Presentation Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Isolated Scrollable Target Layout Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto focus:outline-none">
          {/* Sub-routes (e.g. DashboardHomePage, ServicesPage) render directly here */}
          <Outlet />
        </main>
      </div>

      <TourModal
        open={showTour}
        onClose={async () => {
          if (!business) return

          await supabase
            .from('businesses')
            .update({
              tour_completed: true,
            })
            .eq('id', business.id)

          setShowTour(false)
        }}
        onComplete={handleTourComplete}
      />
    </div>
  )
}