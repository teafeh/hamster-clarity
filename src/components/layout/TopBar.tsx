import { useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface TopBarProps {
  onMenuClick: () => void
}



const PAGE_TITLES: Record<string, string> = {
  '/dashboard':              'Dashboard',
  '/dashboard/services':     'Services',
  '/dashboard/customers':    'Customers',
  '/dashboard/appointments': 'Appointments',
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth()
  const { pathname } = useLocation()

  const userInitial =
  user?.email?.charAt(0).toUpperCase() ?? '?'

  const title = PAGE_TITLES[pathname] ?? 'Dashboard'

  return (
    <header
      className="flex items-center justify-between px-5 py-3.5 border-b shrink-0"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor:     '#E5E7EB',
        height:          '56px',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md transition-colors"
          aria-label="Open navigation"
          style={{ color: '#6B7280' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1
          className="text-sm font-semibold"
          style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
        >
          {title}
        </h1>
      </div>

      {/* User email */}
      {/* User avatar */}
<div
  className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold"
  style={{
    backgroundColor: '#E07B39',
    color: '#FFFFFF',
  }}
  title={user?.email}
>
  {userInitial}
</div>
    </header>
  )
}