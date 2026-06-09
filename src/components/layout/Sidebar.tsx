import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useBusiness } from '@/hooks/useBusiness'

interface SidebarProps {
  isOpen:  boolean
  onClose: () => void
}

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  label:   string
  to:      string
  enabled: boolean
  icon:    React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    label:   'Dashboard',
    to:      '/dashboard',
    enabled: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label:   'Services',
    to:      '/dashboard/services',
    enabled: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path strokeLinecap="round" d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    label:   'Customers',
    to:      '/dashboard/customers',
    enabled: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label:   'Appointments',
    to:      '/dashboard/appointments',
    enabled: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
        <path strokeLinecap="round" d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    label: 'CRM',
    to: '/dashboard/crm',
    enabled: true,
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5V4H2v16h5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 20v-4a3 3 0 013-3 3 3 0 013 3v4"
        />
        <circle cx="12" cy="8" r="3" />
      </svg>
    ),
  },

  {
    label: 'Settings',
    to: '/dashboard/settings',
    enabled: true,
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <circle cx="12" cy="12" r="3" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2
        2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65
        1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2
        2 0 01-2 2 2 2 0 01-2-2v-.09a1.65 1.65 0
        00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2
        2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65
        1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2
        2 0 01-2-2 2 2 0 012-2h.09a1.65 1.65 0
        001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2
        2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65
        1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2
        2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0
        001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2
        2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65
        1.65 0 00-.33 1.82V9c0 .66.39 1.26 1
        1.51H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65
        1.65 0 00-1.51 1z"
        />
      </svg>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { signOut } = useAuth()
  const { business } = useBusiness()
  const navigate = useNavigate()

  const isMobile = window.innerWidth < 1024


  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/signin')
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-20"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
  className="fixed top-0 left-0 z-30 h-full flex flex-col border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0"
  style={{
    width: '240px',
    backgroundColor: '#111111',
    borderColor: '#1F1F1F',
    transform:
      isMobile
        ? isOpen
          ? 'translateX(0)'
          : 'translateX(-100%)'
        : 'translateX(0)',
  }}
  data-sidebar
>
        {/* Header */}
        <div
          className={`border-b ${
            false
              ? 'px-3 pt-7 pb-6'
              : 'px-6 pt-7 pb-6'
          }`}
          style={{ borderColor: '#1F1F1F' }}
        >
          {false ? (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto text-xs font-bold"
              style={{
                backgroundColor: '#1A1A1A',
                color: '#E07B39',
              }}
            >
              OC
            </div>
          ) : (
            <>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: '#E07B39' }}
              >
                Operational Clarity
              </p>

              {business ? (
                <>
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      color: '#FAFAF8',
                    }}
                  >
                    {business.name}
                  </p>

                  <p
                    className="text-xs mt-0.5"
                    style={{ color: '#6B7280' }}
                  >
                    {business.business_type}
                  </p>
                </>
              ) : (
                <div className="space-y-1.5">
                  <div
                    className="h-3.5 w-32 rounded"
                    style={{ backgroundColor: '#1F1F1F' }}
                  />
                  <div
                    className="h-2.5 w-20 rounded"
                    style={{ backgroundColor: '#1F1F1F' }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) =>
            item.enabled ? (
              <EnabledNavItem
  key={item.label}
  item={item}
  onNavigate={onClose}
/>
            ) : (
              <DisabledNavItem
  key={item.label}
  item={item}
/>
            )
          )}
        </nav>

        {/* Sign Out */}
        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: '#1F1F1F' }}
        >
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors ${
              false
                ? 'justify-center'
                : 'gap-3'
            }`}
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1A1A1A'
              e.currentTarget.style.color = '#9CA3AF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#6B7280'
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            {!false && 'Sign out'}
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Nav item variants ────────────────────────────────────────────────────────

function EnabledNavItem({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: () => void
}){
  return (
    <NavLink
      to={item.to}
      end={item.to === '/dashboard'}
      onClick={onNavigate}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
      style={({ isActive }) => ({
        backgroundColor: isActive ? '#1A1A1A' : 'transparent',
        color: isActive ? '#FAFAF8' : '#9CA3AF',
        fontWeight: isActive ? 500 : 400,
      })}
    >
      {({ isActive }) => (
        <>
          <span style={{ color: isActive ? '#E07B39' : 'currentColor' }}>
            {item.icon}
          </span>

          {item.label}
        </>
      )}
    </NavLink>
  )
}

function DisabledNavItem({
  item,
}: {
  item: NavItem
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
      style={{ color: '#374151' }}
      title={`${item.label} — coming soon`}
    >
      <span>{item.icon}</span>

        <>
          <span className="flex-1">{item.label}</span>

          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: '#1A1A1A',
              color: '#4B5563',
            }}
          >
            Soon
          </span>
        </>
    </div>
  )
}