import { useState, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldKey = 'name' | 'price' | 'duration'
type FieldErrors = Partial<Record<FieldKey, string>>

// ─── Component ────────────────────────────────────────────────────────────────

export default function Step3InitialService ({
  onboarding,
}: {
  onboarding: any
}) {
    const { submitStep3, isLoading, error } = onboarding
    
  const [name,     setName]     = useState('')
  const [price,    setPrice]    = useState('')
  const [duration, setDuration] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  // ─── Validation ─────────────────────────────────────────────────────────────

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {}

    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Service name must be at least 2 characters.'
    }

    const parsedPrice = parseFloat(price)
    if (price.trim() === '') {
      errors.price = 'Price is required.'
    } else if (isNaN(parsedPrice) || !isFinite(parsedPrice)) {
      errors.price = 'Enter a valid price.'
    } else if (parsedPrice < 0) {
      errors.price = 'Price cannot be negative.'
    }

    if (duration.trim() !== '') {
      const parsedDuration = parseInt(duration, 10)
      if (isNaN(parsedDuration) || !isFinite(parsedDuration)) {
        errors.duration = 'Enter a valid number of minutes.'
      } else if (parsedDuration <= 0) {
        errors.duration = 'Duration must be greater than zero.'
      } else if (!Number.isInteger(parsedDuration)) {
        errors.duration = 'Duration must be a whole number.'
      }
    }

    return errors
  }

  const clearFieldError = (field: FieldKey) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    await submitStep3({
      name:             name.trim(),
      price:            parseFloat(price),
      duration_minutes: duration.trim() !== '' ? parseInt(duration, 10) : null,
    })
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Step header */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: '#E07B39' }}
        >
          Step 3 of 3
        </p>
        <h2
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
        >
          Add your first service
        </h2>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          You can add more services after setup. Start with your most common one.
        </p>
      </div>

      {/* Server error banner */}
      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-md text-sm border"
          style={{
            backgroundColor: '#FEF2F2',
            borderColor:     '#FECACA',
            color:           '#B91C1C',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Service Name */}
        <div>
          <label
            htmlFor="serviceName"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#374151' }}
          >
            Service name
          </label>
          <input
            id="serviceName"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clearFieldError('name') }}
            placeholder="e.g. Haircut, Deep Tissue Massage"
            className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
            style={{
              borderColor:     fieldErrors.name ? '#FECACA' : '#D1D5DB',
              backgroundColor: '#FFFFFF',
              color:           '#111111',
            }}
            onFocus={(e) => { if (!fieldErrors.name) e.currentTarget.style.borderColor = '#E07B39' }}
            onBlur={(e)  => { if (!fieldErrors.name) e.currentTarget.style.borderColor = '#D1D5DB' }}
          />
          {fieldErrors.name && (
            <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Price + Duration — side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Price */}
          <div>
            <label
              htmlFor="servicePrice"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#374151' }}
            >
              Price
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none"
                style={{ color: '#9CA3AF' }}
              >
                ₦
              </span>
              <input
                id="servicePrice"
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => { setPrice(e.target.value); clearFieldError('price') }}
                placeholder="0.00"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
                style={{
                  borderColor:     fieldErrors.price ? '#FECACA' : '#D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color:           '#111111',
                }}
                onFocus={(e) => { if (!fieldErrors.price) e.currentTarget.style.borderColor = '#E07B39' }}
                onBlur={(e)  => { if (!fieldErrors.price) e.currentTarget.style.borderColor = '#D1D5DB' }}
              />
            </div>
            {fieldErrors.price && (
              <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
                {fieldErrors.price}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="serviceDuration"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#374151' }}
            >
              Duration{' '}
              <span className="font-normal" style={{ color: '#9CA3AF' }}>
                (optional)
              </span>
            </label>
            <div className="relative">
              <input
                id="serviceDuration"
                type="text"
                inputMode="numeric"
                value={duration}
                onChange={(e) => { setDuration(e.target.value); clearFieldError('duration') }}
                placeholder="e.g. 60"
                className="w-full pl-3.5 pr-14 py-2.5 rounded-md text-sm border outline-none transition-all"
                style={{
                  borderColor:     fieldErrors.duration ? '#FECACA' : '#D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color:           '#111111',
                }}
                onFocus={(e) => { if (!fieldErrors.duration) e.currentTarget.style.borderColor = '#E07B39' }}
                onBlur={(e)  => { if (!fieldErrors.duration) e.currentTarget.style.borderColor = '#D1D5DB' }}
              />
              <span
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs select-none"
                style={{ color: '#9CA3AF' }}
              >
                mins
              </span>
            </div>
            {fieldErrors.duration && (
              <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
                {fieldErrors.duration}
              </p>
            )}
          </div>

        </div>

        {/* Finish CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-md text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#111111',
              color:           '#FAFAF8',
              opacity:         isLoading ? 0.5 : 1,
              cursor:          isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Finishing setup…' : 'Finish setup'}
          </button>

          <p
            className="text-xs text-center mt-3"
            style={{ color: '#9CA3AF' }}
          >
            You can add, edit, and remove services from your dashboard.
          </p>
        </div>

      </form>
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

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