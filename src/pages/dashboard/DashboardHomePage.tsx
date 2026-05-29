import { Link } from 'react-router-dom'
import { useBusiness } from '@/hooks/useBusiness'

// ─── Feature card config ──────────────────────────────────────────────────────

interface FeatureCard {
  label:       string
  description: string
  to:          string
  enabled:     boolean
  icon:        React.ReactNode
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    label:       'Services',
    description: 'Create and manage the services your business offers.',
    to:          '/dashboard/services',
    enabled:     true,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path strokeLinecap="round" d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    label:       'Customers',
    description: 'Build and maintain your customer relationships.',
    to:          '/dashboard/customers',
    enabled:     false,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label:       'Appointments',
    description: 'Schedule, track, and manage client appointments.',
    to:          '/dashboard/appointments',
    enabled:     false,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
        <path strokeLinecap="round" d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardHomePage() {
  const { business, loading } = useBusiness()

  const greeting = getGreeting()

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto w-full">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#E07B39' }}>
          {greeting}
        </p>

        {loading ? (
          <div className="h-8 w-56 rounded" style={{ backgroundColor: '#E5E7EB' }} />
        ) : (
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
          >
            {business?.name ?? 'Your Dashboard'}
          </h2>
        )}

        {!loading && business && (
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            {business.business_type}
          </p>
        )}
      </div>

      {/* Feature cards */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#9CA3AF' }}>
          Modules
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_CARDS.map((card) =>
            card.enabled ? (
              <EnabledCard key={card.label} card={card} />
            ) : (
              <DisabledCard key={card.label} card={card} />
            )
          )}
        </div>
      </div>

    </div>
  )
}

// ─── Card variants ────────────────────────────────────────────────────────────

function EnabledCard({ card }: { card: FeatureCard }) {
  return (
    <Link
      to={card.to}
      className="group flex flex-col gap-3 p-5 rounded-lg border transition-all"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = '#E07B39'
        el.style.boxShadow = '0 1px 6px rgba(224,123,57,0.12)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = '#E5E7EB'
        el.style.boxShadow = 'none'
      }}
    >
      <span style={{ color: '#E07B39' }}>{card.icon}</span>
      <div>
        <p className="text-sm font-semibold mb-0.5" style={{ color: '#111111' }}>
          {card.label}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
          {card.description}
        </p>
      </div>
      <span className="text-xs font-medium mt-auto" style={{ color: '#E07B39' }}>
        Open →
      </span>
    </Link>
  )
}

function DisabledCard({ card }: { card: FeatureCard }) {
  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-lg border"
      style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}
    >
      <span style={{ color: '#D1D5DB' }}>{card.icon}</span>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold" style={{ color: '#9CA3AF' }}>
            {card.label}
          </p>
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }}
          >
            Soon
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
          {card.description}
        </p>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}