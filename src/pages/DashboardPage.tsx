import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ backgroundColor: '#FAFAF8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#E07B39' }}>
          Operational Clarity
        </p>
        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#111111' }}>
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Signed in as <span style={{ color: '#111111' }}>{user?.email}</span>
        </p>
      </div>

      <button
        onClick={handleSignOut}
        className="px-5 py-2 rounded-md text-sm font-medium border transition-colors"
        style={{
          borderColor: '#D1D5DB',
          color: '#374151',
          backgroundColor: '#FFFFFF',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
      >
        Sign out
      </button>

      <p className="text-xs" style={{ color: '#D1D5DB' }}>
        Placeholder — sprint dashboard coming soon.
      </p>
    </div>
  )
}