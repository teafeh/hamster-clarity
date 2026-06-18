import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)

const passwordsMatch =
  password === confirmPassword


  // Load distinctive fonts
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

    if (password.length < 8) {
      if (password !== confirmPassword) {
  setError('Passwords do not match.')
  return
}
      setError('Password must be at least 8 characters.')
      
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      setSuccess(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
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
            Flow by Hamster
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
            From chaos
            <br />
            <em style={{ color: '#E07B39' }}>to clarity.</em>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#9CA3AF' }}>
            Built for service businesses that are ready to stop firefighting
            and start operating with intention.
          </p>
        </div>

        <div>
          <div
            className="w-8 h-px mb-4"
            style={{ backgroundColor: '#E07B39' }}
          />
          <p className="text-xs tracking-wide" style={{ color: '#6B7280' }}>
            Free to start. No credit card required.
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

          {success ? (
            <SuccessState email={email} />
          ) : (
            <>
              <div className="mb-8">
                <h2
                  className="text-2xl font-semibold mb-1"
                  style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
                >
                  Create your account
                </h2>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Set up your business in under 5 minutes.
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
  <label
    htmlFor="password"
    className="block text-sm font-medium mb-1.5"
    style={{ color: '#374151' }}
  >
    Password
  </label>

  <div className="relative">
    <input
      id="password"
      type={showPassword ? 'text' : 'password'}
      autoComplete="new-password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Minimum 8 characters"
      className="w-full px-3.5 py-2.5 pr-12 rounded-md text-sm border outline-none transition-all"
      style={{
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        color: '#111111',
      }}
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    >
     {showPassword ? (
  <EyeOff size={18} />
) : (
  <Eye size={18} />
)}
    </button>
  </div>
                  </div>
                  
                  <div>
  <label
    htmlFor="confirmPassword"
    className="block text-sm font-medium mb-1.5"
    style={{ color: '#374151' }}
  >
    Confirm Password
  </label>

  <div className="relative">
    <input
      id="confirmPassword"
      type={showConfirmPassword ? 'text' : 'password'}
      autoComplete="new-password"
      required
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Re-enter password"
      className="w-full px-3.5 py-2.5 pr-12 rounded-md text-sm border outline-none transition-all"
      style={{
        borderColor:
          confirmPassword && !passwordsMatch ? '#EF4444' : '#D1D5DB',
        backgroundColor: '#FFFFFF',
        color: '#111111',
      }}
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    >
       {showConfirmPassword ? (
  <EyeOff size={18} />
) : (
  <Eye size={18} />
)}
    </button>
  </div>

  {confirmPassword && !passwordsMatch && (
    <p className="mt-1 text-sm text-red-500">
      Passwords do not match
    </p>
  )}

  {confirmPassword && passwordsMatch && (
    <p className="mt-1 text-sm text-green-600">
      Passwords match ✓
    </p>
  )}
</div>

                <button
                  type="submit"
                  disabled={
  loading ||
  !email ||
  !password ||
  !confirmPassword ||
  password !== confirmPassword
}
                  className="w-full py-2.5 px-4 rounded-md text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: '#111111',
                    color: '#FAFAF8',
                    opacity: loading || !email || !password ? 0.5 : 1,
                    cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading && <Spinner />}
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <p className="mt-6 text-sm text-center" style={{ color: '#6B7280' }}>
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="font-medium underline underline-offset-2"
                  style={{ color: '#111111' }}
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SuccessState({ email }: { email: string }) {
  return (
    <div className="text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ backgroundColor: '#F0FDF4' }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#16A34A"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
      >
        Check your inbox
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
        We sent a confirmation link to{' '}
        <span className="font-medium" style={{ color: '#111111' }}>
          {email}
        </span>
        . Click the link to activate your account.
      </p>
      <p className="text-xs mt-4" style={{ color: '#9CA3AF' }}>
        No email? Check your spam folder.
      </p>
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