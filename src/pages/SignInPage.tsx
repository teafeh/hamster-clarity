import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

export default function SignInPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load fonts (mirrors SignUpPage — will deduplicate once a layout wrapper exists)
  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  setLoading(true)

  try {
    await signIn(email, password)

    // Redirect to dashboard after successful login
    navigate('/dashboard')
  } catch (err: unknown) {
    if (err instanceof Error) {
      const msg = err.message.toLowerCase()

      if (
        msg.includes('invalid login credentials') ||
        msg.includes('invalid email or password')
      ) {
        setError('Incorrect email or password. Please try again.')
      } else {
        setError(err.message)
      }
    } else {
      setError('Something went wrong. Please try again.')
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#FAFAF8' }}
    >
      {/* Left Panel — decorative, desktop only */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ backgroundColor: '#111111' }}
      >
        <div>
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: '#E07B39' }}
          >
            Operational Clarity
          </span>
        </div>

        <div>
          <h1
            className="text-5xl font-semibold leading-tight mb-6"
            style={{
              fontFamily: "'Fraunces', serif",
              color: '#FAFAF8',
            }}
          >
            Good to have
            <br />
            <em style={{ color: '#E07B39' }}>you back.</em>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#9CA3AF' }}>
            Your business data is waiting. Let's pick up where you left off.
          </p>
        </div>

        <div>
          <div
            className="w-8 h-px mb-4"
            style={{ backgroundColor: '#E07B39' }}
          />
          <p className="text-xs tracking-wide" style={{ color: '#6B7280' }}>
            Your session is encrypted and secure.
          </p>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile brand mark */}
          <div className="lg:hidden mb-10">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: '#E07B39' }}
            >
              Operational Clarity
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="text-2xl font-semibold mb-1"
              style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
            >
              Sign in
            </h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-md text-sm border"
              style={{
                backgroundColor: '#FEF2F2',
                borderColor: '#FECACA',
                color: '#B91C1C',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#374151' }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
                style={{
                  borderColor: '#D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E07B39')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#D1D5DB')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                  style={{ color: '#374151' }}
                >
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-xs underline underline-offset-2"
                  style={{ color: '#6B7280' }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
                style={{
                  borderColor: '#D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E07B39')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#D1D5DB')}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-2.5 px-4 rounded-md text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#111111',
                color: '#FAFAF8',
                opacity: loading || !email || !password ? 0.5 : 1,
                cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              }}
            >
              {loading && <Spinner />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center" style={{ color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium underline underline-offset-2"
              style={{ color: '#111111' }}
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
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
  )
}