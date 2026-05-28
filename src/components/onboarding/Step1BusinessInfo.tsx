import { useState, useEffect } from 'react'
import { useOnboarding } from '@/hooks/useOnboarding'

const BUSINESS_TYPES = [
  'Hair Salon',
  'Barbershop',
  'Massage Center',
  'Spa',
  'Beauty Clinic',
  'Medical Clinic',
  'Dentist',
  'Tutor',
  'Fitness Coach',
  'Photography Studio',
  'Tailor',
  'Fashion Designer',
  'Auto Workshop',
  'Cleaning Service',
  'Home Service',
] as const

interface FieldErrors {
  businessName?: string
  businessType?: string
}

export default function Step1BusinessInfo() {
const {submitStep1, isLoading, error,} = useOnboarding()
    
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Load fonts — matches auth pages
  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {}
    if (!businessName.trim() || businessName.trim().length < 2) {
      errors.businessName = 'Business name must be at least 2 characters.'
    }
    if (!businessType) {
      errors.businessType = 'Please select a business type.'
    }
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    await submitStep1({
  businessName: businessName.trim(),
  businessType,
})
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Step header */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: '#E07B39' }}
        >
          Step 1 of 3
        </p>
        <h2
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
        >
          Tell us about your business
        </h2>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          This helps us tailor the platform to how you operate.
        </p>
      </div>

      {/* Server error banner */}
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

        {/* Business Name */}
        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#374151' }}
          >
            Business name
          </label>
          <input
            id="businessName"
            type="text"
            autoComplete="organization"
            required
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value)
              if (fieldErrors.businessName) {
                setFieldErrors((prev) => ({ ...prev, businessName: undefined }))
              }
            }}
            placeholder="e.g. Luxe Hair Studio"
            className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
            style={{
              borderColor: fieldErrors.businessName ? '#FECACA' : '#D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#111111',
            }}
            onFocus={(e) => {
              if (!fieldErrors.businessName) {
                e.currentTarget.style.borderColor = '#E07B39'
              }
            }}
            onBlur={(e) => {
              if (!fieldErrors.businessName) {
                e.currentTarget.style.borderColor = '#D1D5DB'
              }
            }}
          />
          {fieldErrors.businessName && (
            <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
              {fieldErrors.businessName}
            </p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label
            htmlFor="businessType"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#374151' }}
          >
            Business type
          </label>
          <select
            id="businessType"
            required
            value={businessType}
            onChange={(e) => {
              setBusinessType(e.target.value)
              if (fieldErrors.businessType) {
                setFieldErrors((prev) => ({ ...prev, businessType: undefined }))
              }
            }}
            className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all appearance-none"
            style={{
              borderColor: fieldErrors.businessType ? '#FECACA' : '#D1D5DB',
              backgroundColor: '#FFFFFF',
              color: businessType ? '#111111' : '#9CA3AF',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '2.5rem',
            }}
            onFocus={(e) => {
              if (!fieldErrors.businessType) {
                e.currentTarget.style.borderColor = '#E07B39'
              }
            }}
            onBlur={(e) => {
              if (!fieldErrors.businessType) {
                e.currentTarget.style.borderColor = '#D1D5DB'
              }
            }}
          >
            <option value="" disabled>
              Select your business type
            </option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldErrors.businessType && (
            <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
              {fieldErrors.businessType}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-md text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#111111',
              color: '#FAFAF8',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Saving…' : 'Continue'}
          </button>
        </div>

      </form>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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