import { useState, useEffect, useRef } from 'react'
import type { Customer }  from '@/services/customerService'
import type { Service }   from '@/services/serviceService'
import type {
  AppointmentWithRelations,
  AppointmentPayload,
} from '@/services/appointmentService'
// AVAILABILITY INTEGRATION
import { availabilityService } from '@/services/availabilityService'

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppointmentFormProps {
  appointment: AppointmentWithRelations | null
  customers:   Customer[]
  services:    Service[]
  submitting:  boolean
  error:       string | null
  onSuccess:   () => void
  onCancel:    () => void
  onCreate: (
    payload: AppointmentPayload
  ) => Promise<AppointmentWithRelations | null>
  onUpdate:    (appointmentId: string, payload: AppointmentPayload) => Promise<boolean>
  initialScheduledAt?: string // Optional pre-fill timestamp from calendar view grid cells
  // AVAILABILITY INTEGRATION
  businessId?: string
  onOpenCustomerDrawer: () => void
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  customerId: string
  serviceId: string
  date: string
  time: string
  durationMinutes: string
  notes: string

  customerStatus: string
  assignedTo: string
  leadSource: string
}

interface FieldErrors {
  customerId?:      string
  date?:            string
  time?:            string
  durationMinutes?: string
}

const EMPTY_FORM: FormState = {
  customerId: '',
  serviceId: '',
  date: '',
  time: '',
  durationMinutes: '',
  notes: '',

  customerStatus: 'new',
  assignedTo: '',
  leadSource: '',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract local YYYY-MM-DD and HH:MM from an ISO string or Date object.
 * Necessary because HTML inputs expect plain string formats.
 */
function parseScheduledAt(isoString: string | null): { date: string; time: string } {
  if (!isoString) return { date: '', time: '' }
  try {
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return { date: '', time: '' }

    const yyyy = d.getFullYear()
    const mm   = String(d.getMonth() + 1).padStart(2, '0')
    const dd   = String(d.getDate()).padStart(2, '0')
    const hh   = String(d.getHours()).padStart(2, '0')
    const min  = String(d.getMinutes()).padStart(2, '0')

    return {
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
    }
  } catch {
    return { date: '', time: '' }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppointmentForm({
  appointment,
  customers,
  services,
  submitting,
  error,
  onCancel,
  onCreate,
  onUpdate,
  onOpenCustomerDrawer,
  initialScheduledAt,
  // AVAILABILITY INTEGRATION
  businessId,
}: AppointmentFormProps) {
  const isEditMode = !!appointment
  const firstInputRef = useRef<HTMLSelectElement>(null)

  // ── State ───────────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomerName, setSelectedCustomerName] = useState('')


  const filteredCustomers = customers.filter((customer) => {
    const fullName =
      `${customer.first_name} ${customer.last_name || ''}`.toLowerCase()

    return fullName.includes(customerSearch.toLowerCase())
  })
  // AVAILABILITY INTEGRATION
  const [availabilitySubmitting, setAvailabilitySubmitting] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)

  // ── Sync form state when active appointment or calendar pre-fill changes ───
  useEffect(() => {
    if (appointment) {
      // Edit Mode
      const { date, time } = parseScheduledAt(appointment.scheduled_at)
      setForm({
  customerId: appointment.customer_id || '',
  serviceId: appointment.service_id || '',
  date,
  time,
  durationMinutes: appointment.duration_minutes?.toString() || '30',
  notes: appointment.notes || '',

  customerStatus: appointment.customer_status || 'new',
  assignedTo: appointment.assigned_to || '',
  leadSource: appointment.lead_source || '',
})
    } else if (initialScheduledAt) {
      // Create Mode with a cell clicked in a Calendar Grid view
      const { date, time } = parseScheduledAt(initialScheduledAt)
      setForm({
        ...EMPTY_FORM,
        date,
        time,
        durationMinutes: '30', // standard boilerplate default
      })
    } else {
      // Create Mode fresh
      setForm(EMPTY_FORM)
    }

    setFieldErrors({})
    // AVAILABILITY INTEGRATION
    setAvailabilityError(null)

    // Focus treatment for accessible controls mapping
    setTimeout(() => {
      firstInputRef.current?.focus()
    }, 50)
  }, [appointment, initialScheduledAt])

  // ── Auto-apply default duration when a service is chosen ───────────────────
  useEffect(() => {
    if (!isEditMode && form.serviceId) {
      const selectedService = services.find(s => s.id === form.serviceId)
      if (selectedService && selectedService.duration_minutes) {
        setForm(prev => ({
          ...prev,
          durationMinutes: selectedService.duration_minutes!.toString(),
        }))
      }
    }
  }, [form.serviceId, services, isEditMode])

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name === 'customerId') {
      setForm(prev => ({
        ...prev,
        customerId: value,
        customerStatus: value ? 'returning' : 'new',
      }))
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }))
    }

    // Flush inline validation layout highlights immediately upon modification
    if (name in fieldErrors) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // AVAILABILITY INTEGRATION
    if (submitting || availabilitySubmitting) return

    setFieldErrors({})
    // AVAILABILITY INTEGRATION
    setAvailabilityError(null)

    // Client-side synchronous boundaries verification passes
    const errors: FieldErrors = {}
    if (!form.customerId) errors.customerId = 'Please select a customer.'
    if (!form.date)       errors.date       = 'Please pick a date.'
    if (!form.time)       errors.time       = 'Please pick a time.'

    const duration = parseInt(form.durationMinutes, 10)
    if (isNaN(duration) || duration <= 0) {
      errors.durationMinutes = 'Please enter a valid duration.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    try {
      const combinedDateTimeStr = `${form.date}T${form.time}:00`
      const targetDate = new Date(combinedDateTimeStr)
      if (isNaN(targetDate.getTime())) {
        setFieldErrors({ date: 'Invalid calendar selection sequence.' })
        return
      }

      const scheduledAt = targetDate.toISOString()

      // AVAILABILITY INTEGRATION
      const activeBusinessId = appointment?.business_id || businessId || customers[0]?.business_id || ''
      if (!activeBusinessId) {
        setAvailabilityError('Could not verify business isolation parameter properties.')
        return
      }

      setAvailabilitySubmitting(true)

      const isSlotAvailable = await availabilityService.checkSlotAvailability(
        activeBusinessId,
        scheduledAt,
        duration,
        appointment?.id
      )
      console.log('APPOINTMENT ID:', appointment?.id)
      console.log('EXCLUDE ID:', appointment?.id)
      console.log('IS EDIT MODE:', isEditMode)

      setAvailabilitySubmitting(false)

      if (!isSlotAvailable) {
        setFieldErrors({
          time: 'This time slot is no longer available. Please choose another time.',
        })
        return
      }

      const payload: AppointmentPayload = {
  customer_id: form.customerId,
  service_id: form.serviceId,
  scheduled_at: scheduledAt,
  duration_minutes: duration,
  notes: form.notes.trim() || null,

  customer_status: form.customerStatus,
  assigned_to: form.assignedTo.trim() || null,
  lead_source: form.leadSource || null,
}

      console.log("PAYLOAD ", payload);
      

      if (isEditMode && appointment) {
        await onUpdate(appointment.id, payload)
      } else {
        await onCreate(payload)
      }
    } catch (err: any) {
      // AVAILABILITY INTEGRATION
      setAvailabilitySubmitting(false)
      setAvailabilityError(err?.message || 'An operational error occurred during slot analysis.')
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="p-6 rounded-lg border mb-6 animate-fadeIn"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      <h3
        className="text-base font-semibold mb-4"
        style={{ color: '#111111' }}
      >
        {isEditMode ? 'Edit Appointment' : 'Schedule New Appointment'}
      </h3>

      {/* AVAILABILITY INTEGRATION */}
      {(error || availabilityError) && (
        <div
          className="p-3 text-sm rounded-md mb-4 font-medium border"
          style={{
            backgroundColor: '#FEF2F2',
            borderColor:     '#FCA5A5',
            color:           '#991B1B',
          }}
        >
          {error || availabilityError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">


        {/* Customer Select Option */}
        <div>
          <input
            type="text"
            placeholder="Search customer..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="w-full px-3 py-2 mb-2 border rounded-md text-sm"
            style={{ borderColor: '#D1D5DB' }}
          />

          {form.customerId && (
            <button
              type="button"
              onClick={() => {
                setCustomerSearch('')
                setSelectedCustomerName('')

                setForm(prev => ({
                  ...prev,
                  customerId: '',
                }))
              }}
              className="mt-2 text-sm text-orange-500"
            >
              Change customer
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCustomerDrawer}
            className="mt-2 text-sm font-medium"
            style={{ color: '#E07B39' }}
          >
            + Create New Customer
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search customer..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />

            {customerSearch.trim() &&
              customerSearch !== selectedCustomerName && (
              <div
                className="
        absolute
        z-50
        mt-1
        w-full
        bg-white
        border
        rounded-md
        shadow-lg
        max-h-60
        overflow-y-auto
      "
              >
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => {
                        const fullName =
                          `${customer.first_name} ${customer.last_name || ''}`.trim()

                        setCustomerSearch(fullName)
                        setSelectedCustomerName(fullName)

                        setForm(prev => ({
                          ...prev,
                          customerId: customer.id,
                        }))
                      }}
                      className="
              w-full
              text-left
              px-3
              py-2
              hover:bg-gray-100
            "
                    >
                      {customer.first_name} {customer.last_name}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No customer found
                  </div>
                )}
              </div>
            )}
          </div>
          
          

          {fieldErrors.customerId && (
            <p className="text-xs font-medium mt-1 animate-slideDown" style={{ color: '#EF4444' }}>
              {fieldErrors.customerId}
            </p>
          )}
        </div>

        {/* Service Menu Options Dropdown */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: '#374151' }}
          >
            Service Offered
          </label>
          <select
            name="serviceId"
            value={form.serviceId}
            onChange={handleChange}
            // AVAILABILITY INTEGRATION
            disabled={submitting || availabilitySubmitting}
            className="w-full px-3 py-2 border rounded-md text-sm outline-none transition-all duration-150 focus:border-gray-400"
            style={{
              borderColor: '#D1D5DB',
              // AVAILABILITY INTEGRATION
              backgroundColor: (submitting || availabilitySubmitting) ? '#F9FAFB' : '#FFFFFF',
            }}
          >
            <option value="">-- No service / Walk-in --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (₦{s.price.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Grid Timeline Alignment Field Arrays Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: '#374151' }}
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              // AVAILABILITY INTEGRATION
              disabled={submitting || availabilitySubmitting}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none transition-all duration-150 focus:border-gray-400"
              style={{
                borderColor: fieldErrors.date ? '#EF4444' : '#D1D5DB',
                // AVAILABILITY INTEGRATION
                backgroundColor: (submitting || availabilitySubmitting) ? '#F9FAFB' : '#FFFFFF',
              }}
            />
            {fieldErrors.date && (
              <p className="text-xs font-medium mt-1 animate-slideDown" style={{ color: '#EF4444' }}>
                {fieldErrors.date}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: '#374151' }}
            >
              Start Time
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              // AVAILABILITY INTEGRATION
              disabled={submitting || availabilitySubmitting}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none transition-all duration-150 focus:border-gray-400"
              style={{
                borderColor: fieldErrors.time ? '#EF4444' : '#D1D5DB',
                // AVAILABILITY INTEGRATION
                backgroundColor: (submitting || availabilitySubmitting) ? '#F9FAFB' : '#FFFFFF',
              }}
            />
            {fieldErrors.time && (
              <p className="text-xs font-medium mt-1 animate-slideDown" style={{ color: '#EF4444' }}>
                {fieldErrors.time}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: '#374151' }}
            >
              Duration (mins)
            </label>
            <input
              type="number"
              name="durationMinutes"
              min="1"
              value={form.durationMinutes}
              onChange={handleChange}
              // AVAILABILITY INTEGRATION
              disabled={submitting || availabilitySubmitting}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none transition-all duration-150 focus:border-gray-400"
              style={{
                borderColor: fieldErrors.durationMinutes ? '#EF4444' : '#D1D5DB',
                // AVAILABILITY INTEGRATION
                backgroundColor: (submitting || availabilitySubmitting) ? '#F9FAFB' : '#FFFFFF',
              }}
            />
            {fieldErrors.durationMinutes && (
              <p className="text-xs font-medium mt-1 animate-slideDown" style={{ color: '#EF4444' }}>
                {fieldErrors.durationMinutes}
              </p>
            )}
          </div>
        </div>


        

        <div>
  <label
    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
    style={{ color: '#374151' }}
  >
    Assigned To
  </label>

  <input
    type="text"
    name="assignedTo"
    value={form.assignedTo}
    onChange={handleChange}
    placeholder="e.g. Sarah"
    className="w-full px-3 py-2 border rounded-md text-sm"
    style={{ borderColor: '#D1D5DB' }}
  />
</div>

        <div>
  <label
    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
    style={{ color: '#374151' }}
  >
    Lead Source
  </label>

  <select
    name="leadSource"
    value={form.leadSource}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-md text-sm"
    style={{ borderColor: '#D1D5DB' }}
  >
    <option value="">Select source</option>
    <option value="instagram">Instagram</option>
    <option value="tiktok">TikTok</option>
    <option value="referral">Referral</option>
    <option value="walk_in">Walk In</option>
    <option value="google">Google</option>
    <option value="facebook">Facebook</option>
    <option value="whatsapp">WhatsApp</option>
    <option value="other">Other</option>
  </select>
</div>

        {/* Custom Form Notes textarea */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: '#374151' }}
          >
            Internal Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            // AVAILABILITY INTEGRATION
            disabled={submitting || availabilitySubmitting}
            placeholder="Add any internal contextual comments or details regarding the visit..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none transition-all duration-150 resize-none focus:border-gray-400"
            style={{
              borderColor: '#D1D5DB',
              // AVAILABILITY INTEGRATION
              backgroundColor: (submitting || availabilitySubmitting) ? '#F9FAFB' : '#FFFFFF',
            }}
          />
        </div>

        {/* Form Action Controls buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            // AVAILABILITY INTEGRATION
            disabled={submitting || availabilitySubmitting || customers.length === 0}
            className="px-5 py-2.5 rounded-md text-sm font-semibold text-white transition-opacity flex items-center gap-2"
            style={{
              backgroundColor: '#E07B39',
              // AVAILABILITY INTEGRATION
              opacity:         (submitting || availabilitySubmitting || customers.length === 0) ? 0.5 : 1,
              cursor:          (submitting || availabilitySubmitting || customers.length === 0)
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            {/* AVAILABILITY INTEGRATION */}
            {(submitting || availabilitySubmitting) && <Spinner />}
            {/* AVAILABILITY INTEGRATION */}
            {(submitting || availabilitySubmitting)
              ? 'Saving…'
              : isEditMode ? 'Save changes' : 'Create appointment'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            // AVAILABILITY INTEGRATION
            disabled={submitting || availabilitySubmitting}
            className="px-5 py-2.5 rounded-md text-sm font-medium border transition-colors"
            style={{
              borderColor:     '#D1D5DB',
              color:           '#374151',
              backgroundColor: '#FFFFFF',
              // AVAILABILITY INTEGRATION
              opacity:         (submitting || availabilitySubmitting) ? 0.5 : 1,
              cursor:          (submitting || availabilitySubmitting) ? 'not-allowed' : 'pointer',
            }}
            // AVAILABILITY INTEGRATION
            onMouseEnter={(e) => { if (!submitting && !availabilitySubmitting) e.currentTarget.style.backgroundColor = '#F9FAFB' }}
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}