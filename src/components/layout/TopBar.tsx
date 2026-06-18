import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useBusiness } from '@/hooks/useBusiness'
import { useBusinesses } from '@/hooks/useBusinesses'
import { businessService } from '@/services/businessService'

interface TopBarProps {
  onMenuClick: () => void
}



const PAGE_TITLES: Record<string, string> = {
  '/dashboard':              'Dashboard',
  '/dashboard/services':     'Services',
  '/dashboard/customers':    'Customers',
  '/dashboard/appointments': 'Appointments',
  '/dashboard/settings': 'Settings',
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { business } = useBusiness()
  const { businesses, refetch } = useBusinesses()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showBusinessDrawer, setShowBusinessDrawer] =
    useState(false)

  const [showCreateBusinessDrawer, setShowCreateBusinessDrawer] =
    useState(false)
  
  const [creatingBusiness, setCreatingBusiness] =
    useState(false)

    

  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')

  const handleCreateBusiness = async () => {

    setCreatingBusiness(true)
    if (!user?.id) return

    if (!businessName.trim()) {
      alert('Business name is required')
      return
    }

    try {
      const newBusiness =
        await businessService.createBusiness(user, {
          name: businessName,
          businessType: businessType || 'General',
        })

      localStorage.setItem(
        'activeBusinessId',
        newBusiness.id
      )

      await refetch()

      setBusinessName('')
      setBusinessType('')

      setShowCreateBusinessDrawer(false)
    } catch (error) {
      console.error(error)
      alert('Failed to create business')
    }
    finally {
      setCreatingBusiness(false)
    }
  }
  

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
      <div className="relative">
        <button
          onClick={() => setShowUserMenu((prev) => !prev)}
          className="flex items-center gap-2"
        >
          <div
            className="
      flex
      items-center
      justify-center
      w-8
      h-8
      rounded-full
      text-xs
      font-semibold
    "
            style={{
              backgroundColor: '#E07B39',
              color: '#FFFFFF',
            }}
          >
            {userInitial}
          </div>

          <svg
            width="12"
            height="12"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`transition-transform ${showUserMenu ? 'rotate-180' : ''
              }`}
          >
            <path d="M5 7l5 5 5-5" />
          </svg>
        </button>

        {showUserMenu && (
          <div
            className="
        absolute
        right-0
        mt-2
        w-64
        bg-white
        border
        rounded-xl
        shadow-xl
        z-50
        overflow-hidden
      "
          >
            <div className="px-4 py-3 border-b">
              <p className="text-xs text-gray-500">
                Signed in as
              </p>

              <p className="text-sm font-medium truncate">
                {user?.email}
              </p>

              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500">
                  Active Business
                </p>

                <p className="text-sm font-medium">
                  {business?.name ?? 'No Business'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowUserMenu(false)
                navigate('/dashboard/settings')
              }}
              className="
              w-full
              text-left
              px-4
              py-3
              hover:bg-gray-50
              flex
              items-center
              gap-3
            "
            >
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

              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setShowBusinessDrawer(true)
              }}
              className="
    w-full
    text-left
    px-4
    py-3
    hover:bg-gray-50
    flex
    items-center
    gap-3
  "
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
                  d="M3 21h18"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 21V7l7-4 7 4v14"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01"
                />
              </svg>

              <span>Switch Business</span>
            </button>
          </div>
        )}
      </div>

      {showBusinessDrawer && (
        <>
          <div
            className="
        fixed
        inset-0
        bg-black/20
        backdrop-blur-sm
        z-[60]
      "
            onClick={() => setShowBusinessDrawer(false)}
          />

          <div
            className="
        fixed
        top-0
        right-0
        h-screen
        w-full
        max-w-md
        bg-white
        z-[70]
        shadow-2xl
        overflow-y-auto
      "
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2
                  className="text-2xl font-semibold"
                  style={{
                    fontFamily: "'Fraunces', serif",
                  }}
                >
                  Your Businesses
                </h2>

                <button
                  onClick={() => setShowBusinessDrawer(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4">
              {businesses.map((business) => (
                <button
                  key={business.id}
                  onClick={() => {
                    localStorage.setItem(
                      'activeBusinessId',
                      business.id
                    )

                    window.location.reload()
                  }}
                  className="
              w-full
              text-left
              border
              rounded-xl
              p-4
              mb-3
            "
                >
                  <div className="font-medium">
                    {business.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {business.business_type}
                  </div>
                </button>
              ))}

              <button
                onClick={() => {
                  setShowBusinessDrawer(false)
                  setShowCreateBusinessDrawer(true)
                }}
                className="
            mt-4
            w-full
            border
            border-dashed
            rounded-xl
            py-3
            text-sm
            font-medium
          "
              >
                + Create Business
              </button>
            </div>
          </div>
        </>
      )}


      {showCreateBusinessDrawer && (
        <>
          <div
            className="
        fixed
        inset-0
        bg-black/20
        backdrop-blur-sm
        z-[60]
      "
            onClick={() => setShowCreateBusinessDrawer(false)}
          />

          <div
            className="
        fixed
        top-0
        right-0
        h-screen
        w-full
        max-w-md
        bg-white
        z-[70]
        shadow-2xl
        overflow-y-auto
      "
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2
                  className="text-2xl font-semibold"
                  style={{
                    fontFamily: "'Fraunces', serif",
                  }}
                >
                  Create Business
                </h2>

                <button
                  onClick={() =>
                    setShowCreateBusinessDrawer(false)
                  }
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Name
                </label>

                <input
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(e.target.value)
                  }
                  placeholder="IBCity Paws"
                  className="
              w-full
              border
              rounded-lg
              px-3
              py-2
            "
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Type
                </label>

                <input
                  value={businessType}
                  onChange={(e) =>
                    setBusinessType(e.target.value)
                  }
                  placeholder="Pet Sourcer"
                  className="
              w-full
              border
              rounded-lg
              px-3
              py-2
            "
                />
              </div>

              <button
                disabled={creatingBusiness}
                onClick={handleCreateBusiness}
                className="
            w-full
            py-3
            rounded-xl
            text-white
            font-medium
          "
                style={{
                  backgroundColor: '#E07B39',
                }}
              >
                {creatingBusiness
                  ? 'Creating...'
                  : 'Create Business'}
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  )
}