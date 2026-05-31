import { useState, useEffect } from 'react'
import type { Customer, CustomerPayload } from '@/services/customerService'

// ─── Props ────────────────────────────────────────────────────────────────────

interface CustomerFormProps {
  customer:   Customer | null             // null = create, Customer = edit
  submitting: boolean
  error:      string | null
  onSuccess:  () => void
  onCancel:   () => void
  onCreate:   (payload: CustomerPayload) => Promise<boolean>
  onUpdate:   (customerId: string, payload: CustomerPayload) => Promise<boolean>
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  firstName: string
  lastName:  string
  phone:     string
  email:     string
  notes:     string
}

interface FieldErrors {
  firstName?: string
  email?:     string
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName:  '',
  phone:     '',
  email:     '',
  notes:     '',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerForm({
  customer,
  submitting,
  error,
  onSuccess,
  onCancel,
  onCreate,
  onUpdate,
}: CustomerFormProps) {
  const [form,        setForm]        = useState<FormState>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const isEditMode = customer !== null

  // ─── Sync fields when mode or customer changes ──────────────────────────

  useEffect(() => {
    if (customer) {
      setForm({
        firstName: customer.first_name,
        lastName:  customer.last_name ?? '',
        phone:     customer.phone     ?? '',
        email:     customer.email     ?? '',
        notes:     customer.notes     ?? '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setFieldErrors({})
  }, [customer])

  // ─── Field helpers ───────────────────────────────────────────────────────

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    // Clear the field error for this key as soon as the user starts correcting it
    if (key in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  // ─── Validation ──────────────────────────────────────────────────────────

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {}

    if (!form.firstName.trim() || form.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters.'
    }

    if (
      form.email.trim() !== '' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      errors.email = 'Please enter a valid email address.'
    }

    return errors
  }

  // ─── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    const payload: CustomerPayload = {
      first_name: form.firstName.trim(),
      last_name:  form.lastName.trim()  || null,
      phone:      form.phone.trim()     || null,
      email:      form.email.trim()     || null,
      notes:      form.notes.trim()     || null,
    }

    const success = isEditMode && customer
      ? await onUpdate(customer.id, payload)
      : await onCreate(payload)

    if (success) onSuccess()
  }

  // ─── Input style helpers ─────────────────────────────────────────────────

  const inputStyle = (hasError: boolean) => ({
    borderColor:     hasError ? '#FECACA' : '#D1D5DB',
    backgroundColor: '#FFFFFF',
    color:           '#111111',
  })

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, hasError: boolean) => {
    if (!hasError) e.currentTarget.style.borderColor = '#E07B39'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, hasError: boolean) => {
    if (!hasError) e.currentTarget.style.borderColor = '#D1D5DB'
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      className="rounded-lg border p-6"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      {/* Hook error banner */}
      {error && (
        <div
          className="mb-5 px-4 py-3 rounded-md border text-sm"
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

        {/* ── First name + Last name ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* First name */}
          <div>
            <label
              htmlFor="cf-first-name"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#374151' }}
            >
              First name
            </label>
            <input
              id="cf-first-name"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              placeholder="e.g. Amara"
              className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
              style={inputStyle(!!fieldErrors.firstName)}
              onFocus={(e) => handleFocus(e, !!fieldErrors.firstName)}
              onBlur={(e)  => handleBlur(e,  !!fieldErrors.firstName)}
            />
            {fieldErrors.firstName && (
              <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          {/* Last name */}
          <div>
            <label
              htmlFor="cf-last-name"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#374151' }}
            >
              Last name{' '}
              <span className="font-normal" style={{ color: '#9CA3AF' }}>
                (optional)
              </span>
            </label>
            <input
              id="cf-last-name"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              placeholder="e.g. Okafor"
              className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
              style={inputStyle(false)}
              onFocus={(e) => handleFocus(e, false)}
              onBlur={(e)  => handleBlur(e,  false)}
            />
          </div>

        </div>

        {/* ── Phone + Email ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Phone */}
          <div>
            <label
              htmlFor="cf-phone"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#374151' }}
            >
              Phone{' '}
              <span className="font-normal" style={{ color: '#9CA3AF' }}>
                (optional)
              </span>
            </label>
            <input
              id="cf-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="e.g. 08012345678"
              className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
              style={inputStyle(false)}
              onFocus={(e) => handleFocus(e, false)}
              onBlur={(e)  => handleBlur(e,  false)}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="cf-email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#374151' }}
            >
              Email{' '}
              <span className="font-normal" style={{ color: '#9CA3AF' }}>
                (optional)
              </span>
            </label>
            <input
              id="cf-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="e.g. amara@email.com"
              className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
              style={inputStyle(!!fieldErrors.email)}
              onFocus={(e) => handleFocus(e, !!fieldErrors.email)}
              onBlur={(e)  => handleBlur(e,  !!fieldErrors.email)}
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
                {fieldErrors.email}
              </p>
            )}
          </div>

        </div>

        {/* ── Notes ───────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="cf-notes"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#374151' }}
          >
            Notes{' '}
            <span className="font-normal" style={{ color: '#9CA3AF' }}>
              (optional)
            </span>
          </label>
          <textarea
            id="cf-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            placeholder="Preferences, allergies, referral source…"
            className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none resize-none transition-all"
            style={inputStyle(false)}
            onFocus={(e) => handleFocus(e, false)}
            onBlur={(e)  => handleBlur(e,  false)}
          />
        </div>

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity flex items-center gap-2"
            style={{
              backgroundColor: '#111111',
              color:           '#FAFAF8',
              opacity:         submitting ? 0.5 : 1,
              cursor:          submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting && <Spinner />}
            {submitting
              ? 'Saving…'
              : isEditMode ? 'Save changes' : 'Add customer'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-5 py-2.5 rounded-md text-sm font-medium border transition-colors"
            style={{
              borderColor:     '#D1D5DB',
              color:           '#374151',
              backgroundColor: '#FFFFFF',
              opacity:         submitting ? 0.5 : 1,
              cursor:          submitting ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#F9FAFB' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
          >
            Cancel
          </button>
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
        className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}