import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import TopBar  from '@/components/layout/TopBar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  // Gracefully close mobile sidebar drawer overlay immediately upon navigation
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

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
    </div>
  )
}