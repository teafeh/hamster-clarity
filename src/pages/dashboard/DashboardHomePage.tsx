import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBusiness } from '@/hooks/useBusiness'
import { useCustomers } from '@/hooks/useCustomers'
import { useServices } from '@/hooks/useServices'
import { useAppointments } from '@/hooks/useAppointments'
import { useAuth } from '@/hooks/useAuth'
import SetupPromptModal from '@/components/onboarding/SetupPromptModal'


// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardHomePage() {
  const { profile } = useAuth()
  const { business, loading: businessLoading } = useBusiness()
  const { customers, loading: customersLoading } = useCustomers()
  const { services, loading: servicesLoading } = useServices()
  const { appointments, loading: appointmentsLoading } = useAppointments()

  const isGlobalLoading = businessLoading || customersLoading || servicesLoading || appointmentsLoading
  const greeting = getGreeting()



  const [showSetupPrompt, setShowSetupPrompt] =
    useState(false)

  useEffect(() => {
    if (!profile) return

    setShowSetupPrompt(
      !profile.onboarding_completed
    )
  }, [profile])

  // ─── Memoized Metric Analytics ──────────────────────────────────────────────

  const stats = useMemo(() => {
    const now = new Date()
    
    const upcoming = appointments.filter((appt) => {
      if (appt.status === 'cancelled' || appt.status === 'no_show') return false
      if (!appt.scheduled_at) return false
      return new Date(appt.scheduled_at) >= now
    })

    // Sort upcoming appointments ascending (closest first)
    const sortedUpcoming = [...upcoming].sort(
      (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    )

    // Sort recent customers descending (newest first)
    const sortedCustomers = [...customers].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )

    return {
      totalCustomers: customers.length,
      totalServices: services.length,
      totalAppointments: appointments.length,
      upcomingCount: upcoming.length,
      upcomingList: sortedUpcoming.slice(0, 3),
      recentCustomers: sortedCustomers.slice(0, 3),
    }
  }, [customers, services, appointments])

  // ─── Render Helpers ─────────────────────────────────────────────────────────

  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return ''
    }
  }

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return ''
    }
  }

  // ─── Render: Loading State ──────────────────────────────────────────────────

  if (isGlobalLoading) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto w-full space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-64 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl border border-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200" />
          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200" />
        </div>
      </div>
    )
  }


  console.log(
    'Dashboard Profile:',
    profile
  )
  // ─── Render: Complete Dashboard Dashboard ───────────────────────────────────

  return (

    
    
    <div className="px-6 py-8 max-w-5xl mx-auto w-full space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SetupPromptModal
        open={showSetupPrompt}
        onClose={() => setShowSetupPrompt(false)}
      />
      
      {/* ── Header Row ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#E07B39' }}>
          {greeting}
        </p>
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}>
          {business?.name ?? 'Your Dashboard'}
        </h2>
      </div>
      
      
      

      {/* ── Quick Stats Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Customers */}
        <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Customers</span>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">{stats.totalCustomers}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Registered profile records</p>
          </div>
        </div>

        {/* Total Services */}
        <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Services</span>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 3h6m-6 9h6m-6 4h4" />
            </svg>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">{stats.totalServices}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Active menu offers</p>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Bookings</span>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">{stats.totalAppointments}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Historical aggregate total</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming</span>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900" style={{ color: stats.upcomingCount > 0 ? '#E07B39' : '#111111' }}>
              {stats.upcomingCount}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Imminent pending tasks</p>
          </div>
        </div>

      </div>

      {/* ── Splitted Workspace Sections ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Column Left: Upcoming Appointments */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Upcoming Appointments</h4>
              <Link to="/dashboard/appointments" className="text-xs font-semibold transition-colors hover:opacity-80" style={{ color: '#E07B39' }}>
                View Calendar →
              </Link>
            </div>

            {stats.upcomingList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <svg className="w-8 h-8 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-medium">No pending appointments scheduled</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.upcomingList.map((appt) => (
                  <div key={appt.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="truncate">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {appt.customer ? `${appt.customer.first_name} ${appt.customer.last_name ?? ''}`.trim() : 'Guest Client'}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {appt.service?.name ?? 'General Walk-in'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-900">{formatDate(appt.scheduled_at)}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{formatTime(appt.scheduled_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column Right: Recent Customers */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent Customers</h4>
              <Link to="/dashboard/customers" className="text-xs font-semibold transition-colors hover:opacity-80" style={{ color: '#E07B39' }}>
                Manage All →
              </Link>
            </div>

            {stats.recentCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <svg className="w-8 h-8 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-xs font-medium">No registered customers yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.recentCustomers.map((cust) => (
                  <div key={cust.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="truncate">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {`${cust.first_name} ${cust.last_name ?? ''}`.trim()}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {cust.email || cust.phone || 'No contact details'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        Joined {formatDate(cust.created_at || '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  
  )
  
}

// ─── Timeline Context Greeter ──────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}