import { useState, useEffect } from 'react'

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

export default function Step1BusinessInfo({
  onboarding,
}: {
  onboarding: any
    }) {
    const { submitStep1, isLoading, error } = onboarding

  const [businessName, setBusinessName] = useState('')
const [businessType, setBusinessType] = useState('')
const [searchTerm, setSearchTerm] = useState('')
const [showSuggestions, setShowSuggestions] = useState(false)
const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

const filteredTypes = BUSINESS_TYPES.filter((type) =>
  type.toLowerCase().includes(searchTerm.toLowerCase())
)

const exactMatch = BUSINESS_TYPES.some(
  (type) => type.toLowerCase() === searchTerm.toLowerCase()
)

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

  if (!businessType.trim()) {
    errors.businessType =
      'Please select or enter a business type.'
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
  businessType: businessType.trim(),
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

  <div className="relative">
    <input
      id="businessType"
      type="text"
      value={searchTerm}
      placeholder="Search or enter your business type"
      className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
      style={{
        borderColor: fieldErrors.businessType
          ? '#FECACA'
          : '#D1D5DB',
        backgroundColor: '#FFFFFF',
        color: '#111111',
      }}
      onChange={(e) => {
        setSearchTerm(e.target.value)
        setBusinessType(e.target.value)
        setShowSuggestions(true)

        if (fieldErrors.businessType) {
          setFieldErrors((prev) => ({
            ...prev,
            businessType: undefined,
          }))
        }
      }}
      onFocus={() => setShowSuggestions(true)}
      onBlur={() => {
        setTimeout(() => setShowSuggestions(false), 150)
      }}
    />

    {showSuggestions && searchTerm && (
      <div
        className="absolute z-20 mt-1 w-full rounded-md border shadow-lg overflow-hidden"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
        }}
      >
        {filteredTypes.map((type) => (
          <button
            key={type}
            type="button"
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => {
              setBusinessType(type)
              setSearchTerm(type)
              setShowSuggestions(false)
            }}
          >
            {type}
          </button>
        ))}

        {!exactMatch && searchTerm.trim() && (
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-sm border-t"
            style={{ color: '#E07B39' }}
            onClick={() => {
              setBusinessType(searchTerm.trim())
              setShowSuggestions(false)
            }}
          >
            Create "{searchTerm}"
          </button>
        )}
      </div>
    )}
  </div>

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