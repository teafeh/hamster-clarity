import { useState, useEffect, useRef } from 'react'
import type { Customer }  from '@/services/customerService'
import type { Service }   from '@/services/serviceService'
import type {
  AppointmentWithRelations,
  AppointmentPayload,
} from '@/services/appointmentService'

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppointmentFormProps {
  appointment: AppointmentWithRelations | null
  customers:   Customer[]
  services:    Service[]
  submitting:  boolean
  error:       string | null
  onSuccess:   () => void
  onCancel:    () => void
  onCreate:    (payload: AppointmentPayload) => Promise<boolean>
  onUpdate:    (appointmentId: string, payload: AppointmentPayload) => Promise<boolean>
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  customerId:      string
  serviceId:       string
  date:            string  // 'YYYY-MM-DD' for <input type="date">
  time:            string  // 'HH:MM' for <input type="time">
  durationMinutes: string
  notes:           string
}

interface FieldErrors {
  customerId?:      string
  date?:            string
  time?:            string
  durationMinutes?: string
}

const EMPTY_FORM: FormState = {
  customerId:      '',
  serviceId:       '',
  date:            '',
  time:            '',
  durationMinutes: '',
  notes:           '',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract local date and time strings from a stored timestamptz.
 * new Date() converts UTC to the browser's local timezone, which is
 * the business's timezone for single-timezone deployments.
 */
function extractDateTime(scheduledAt: string): { date: string; time: string } {
  const d = new Date(scheduledAt)
  const date = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
  const time = [
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
  ].join(':')
  return { date, time }
}

/**
 * Combine local date and time strings into a UTC ISO timestamptz.
 * new Date(`${date}T${time}`) is parsed as local time and .toISOString()
 * converts to UTC — the inverse of extractDateTime.
 */
function combineDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString()
}

function formatCustomerName(customer: Customer): string {
  return customer.last_name
    ? `${customer.first_name} ${customer.last_name}`
    : customer.first_name
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppointmentForm({
  appointment,
  customers,
  services,
  submitting,
  error,
  onSuccess,
  onCancel,
  onCreate,
  onUpdate,
}: AppointmentFormProps) {
  const [form,        setForm]        = useState<FormState>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const isEditMode = appointment !== null

  /**
   * Tracks the last serviceId that triggered a duration auto-fill.
   * Set to the appointment's service_id on initialisation so the
   * auto-fill effect skips the initial population and only fires
   * when the user actively changes the service selection.
   */
  const lastAutoFilledServiceId = useRef<string>('')

  // ─── Initialise form when appointment changes ─────────────────────────────

  useEffect(() => {
    if (appointment) {
      const { date, time } = extractDateTime(appointment.scheduled_at)
      const sid = appointment.service_id ?? ''
      // Mark this service as already seen so the auto-fill effect skips it
      lastAutoFilledServiceId.current = sid
      setForm({
        customerId:      appointment.customer_id,
        serviceId:       sid,
        date,
        time,
        durationMinutes: appointment.duration_minutes != null
          ? String(appointment.duration_minutes)
          : '',
        notes: appointment.notes ?? '',
      })
    } else {
      lastAutoFilledServiceId.current = ''
      setForm(EMPTY_FORM)
    }
    setFieldErrors({})
  }, [appointment])

  // ─── Auto-fill duration when service selection changes ────────────────────

  useEffect(() => {
    // Skip if this is the service value we set during initialisation
    if (form.serviceId === lastAutoFilledServiceId.current) return
    lastAutoFilledServiceId.current = form.serviceId

    if (!form.serviceId) {
      setForm((prev) => ({ ...prev, durationMinutes: '' }))
      return
    }

    const selected = services.find((s) => s.id === form.serviceId)
    if (selected?.duration_minutes != null) {
      setForm((prev) => ({
        ...prev,
        durationMinutes: String(selected.duration_minutes),
      }))
    } else {
      setForm((prev) => ({ ...prev, durationMinutes: '' }))
    }
  }, [form.serviceId, services])

  // ─── Field helpers ────────────────────────────────────────────────────────

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {}

    if (!form.customerId) {
      errors.customerId = 'Please select a customer.'
    }
    if (!form.date) {
      errors.date = 'Please select a date.'
    }
    if (!form.time) {
      errors.time = 'Please select a time.'
    }
    if (form.durationMinutes.trim() !== '') {
      const parsed = parseInt(form.durationMinutes, 10)
      if (isNaN(parsed) || parsed <= 0) {
        errors.durationMinutes = 'Duration must be a positive whole number.'
      }
    }

    return errors
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    const payload: AppointmentPayload = {
      customer_id:      form.customerId,
      service_id: form.serviceId,
      scheduled_at:     combineDateTime(form.date, form.time),
      duration_minutes: form.durationMinutes.trim() !== ''
        ? parseInt(form.durationMinutes, 10)
        : null,
      notes: form.notes.trim() || null,
    }

    const success = isEditMode && appointment
      ? await onUpdate(appointment.id, payload)
      : await onCreate(payload)

    if (success) onSuccess()
  }

  // ─── Shared input styles ──────────────────────────────────────────────────

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    borderColor:     hasError ? '#FECACA' : '#D1D5DB',
    backgroundColor: '#FFFFFF',
    color:           '#111111',
  })

  const onFocusStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    hasError: boolean
  ) => { if (!hasError) e.currentTarget.style.borderColor = '#E07B39' }

  const onBlurStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    hasError: boolean
  ) => { if (!hasError) e.currentTarget.style.borderColor = '#D1D5DB' }

  // ─── Render ───────────────────────────────────────────────────────────────

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

        {/* ── Customer ────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="af-customer"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#374151' }}
          >
            Customer
          </label>
          <select
            id="af-customer"
            value={form.customerId}
            onChange={(e) => setField('customerId', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none appearance-none transition-all"
            style={{
              ...inputStyle(!!fieldErrors.customerId),
              color:           form.customerId ? '#111111' : '#9CA3AF',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat:   'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight:       '2.5rem',
            }}
            onFocus={(e) => onFocusStyle(e, !!fieldErrors.customerId)}
            onBlur={(e)  => onBlurStyle(e,  !!fieldErrors.customerId)}
          >
            <option value="" disabled>
              {customers.length === 0
                ? 'No customers found — add a customer first'
                : 'Select a customer'}
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {formatCustomerName(c)}
                {c.phone ? ` — ${c.phone}` : ''}
              </option>
            ))}
          </select>
          {fieldErrors.customerId && (
            <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
              {fieldErrors.customerId}
            </p>
          )}
        </div>

        {/* ── Service ─────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="af-service"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#374151' }}
          >
            Service{' '}
            <span className="font-normal" style={{ color: '#9CA3AF' }}>
              (optional)
            </span>
          </label>
          <select
            id="af-service"
            value={form.serviceId}
            onChange={(e) => setField('serviceId', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none appearance-none transition-all"
            style={{
              ...inputStyle(false),
              color:           '#111111',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat:   'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight:       '2.5rem',
            }}
            onFocus={(e) => onFocusStyle(e, false)}
            onBlur={(e)  => onBlurStyle(e,  false)}
          >
            <option value="">No service / Walk-in</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — ₦{s.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* ── Date + Time ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Date */}
          <div>
            <label
              htmlFor="af-date"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#374151' }}
            >
              Date
            </label>
            <input
              id="af-date"
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
              style={inputStyle(!!fieldErrors.date)}
              onFocus={(e) => onFocusStyle(e, !!fieldErrors.date)}
              onBlur={(e)  => onBlurStyle(e,  !!fieldErrors.date)}
            />
            {fieldErrors.date && (
              <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
                {fieldErrors.date}
              </p>
            )}
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor="af-time"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#374151' }}
            >
              Time
            </label>
            <input
              id="af-time"
              type="time"
              value={form.time}
              onChange={(e) => setField('time', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none transition-all"
              style={inputStyle(!!fieldErrors.time)}
              onFocus={(e) => onFocusStyle(e, !!fieldErrors.time)}
              onBlur={(e)  => onBlurStyle(e,  !!fieldErrors.time)}
            />
            {fieldErrors.time && (
              <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
                {fieldErrors.time}
              </p>
            )}
          </div>

        </div>

        {/* ── Duration ────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="af-duration"
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
              id="af-duration"
              type="text"
              inputMode="numeric"
              value={form.durationMinutes}
              onChange={(e) => setField('durationMinutes', e.target.value)}
              placeholder="e.g. 60"
              className="w-full pl-3.5 pr-14 py-2.5 rounded-md text-sm border outline-none transition-all"
              style={inputStyle(!!fieldErrors.durationMinutes)}
              onFocus={(e) => onFocusStyle(e, !!fieldErrors.durationMinutes)}
              onBlur={(e)  => onBlurStyle(e,  !!fieldErrors.durationMinutes)}
            />
            <span
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs select-none"
              style={{ color: '#9CA3AF' }}
            >
              mins
            </span>
          </div>
          {form.serviceId && form.durationMinutes && !fieldErrors.durationMinutes && (
            <p className="mt-1 text-xs" style={{ color: '#9CA3AF' }}>
              Auto-filled from selected service. Edit to override.
            </p>
          )}
          {fieldErrors.durationMinutes && (
            <p className="mt-1.5 text-xs" style={{ color: '#B91C1C' }}>
              {fieldErrors.durationMinutes}
            </p>
          )}
        </div>

        {/* ── Notes ───────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="af-notes"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#374151' }}
          >
            Notes{' '}
            <span className="font-normal" style={{ color: '#9CA3AF' }}>
              (optional)
            </span>
          </label>
          <textarea
            id="af-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            placeholder="Any notes for this appointment…"
            className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none resize-none transition-all"
            style={inputStyle(false)}
            onFocus={(e) => onFocusStyle(e, false)}
            onBlur={(e)  => onBlurStyle(e,  false)}
          />
        </div>

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting || customers.length === 0}
            className="px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity flex items-center gap-2"
            style={{
              backgroundColor: '#111111',
              color:           '#FAFAF8',
              opacity:         submitting || customers.length === 0 ? 0.5 : 1,
              cursor:          submitting || customers.length === 0
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            {submitting && <Spinner />}
            {submitting
              ? 'Saving…'
              : isEditMode ? 'Save changes' : 'Create appointment'}
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