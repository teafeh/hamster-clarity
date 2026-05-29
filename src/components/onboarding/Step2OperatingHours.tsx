import { useState, useEffect } from 'react'
import type { OperatingHours, DayHours } from '@/services/onboardingService'

// ─── Config ───────────────────────────────────────────────────────────────────

type Day = keyof OperatingHours

const DAYS: { key: Day; label: string }[] = [
  { key: 'monday',    label: 'Monday'    },
  { key: 'tuesday',   label: 'Tuesday'   },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday',  label: 'Thursday'  },
  { key: 'friday',    label: 'Friday'    },
  { key: 'saturday',  label: 'Saturday'  },
  { key: 'sunday',    label: 'Sunday'    },
]

const DEFAULT_HOURS: OperatingHours = {
  monday:    { open: true,  start: '09:00', end: '17:00' },
  tuesday:   { open: true,  start: '09:00', end: '17:00' },
  wednesday: { open: true,  start: '09:00', end: '17:00' },
  thursday:  { open: true,  start: '09:00', end: '17:00' },
  friday:    { open: true,  start: '09:00', end: '17:00' },
  saturday:  { open: false, start: '09:00', end: '17:00' },
  sunday:    { open: false, start: '09:00', end: '17:00' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Step2OperatingHours ({  onboarding,
}: {
  onboarding: any
}) {
    const { submitStep2, isLoading, error } = onboarding

  const [hours, setHours] = useState<OperatingHours>(DEFAULT_HOURS)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Day, string>>>({})
  const [topError, setTopError] = useState<string | null>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const toggleDay = (day: Day) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], open: !prev[day].open },
    }))
    // Clear error for this day on any change
    setFieldErrors((prev) => ({ ...prev, [day]: undefined }))
    setTopError(null)
  }

  const updateTime = (day: Day, field: 'start' | 'end', value: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
    setFieldErrors((prev) => ({ ...prev, [day]: undefined }))
    setTopError(null)
  }

  // ─── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errors: Partial<Record<Day, string>> = {}

    const hasOpenDay = DAYS.some(({ key }) => hours[key].open)
    if (!hasOpenDay) {
      setTopError('At least one day must be open.')
      return false
    }

    for (const { key } of DAYS) {
      const day: DayHours = hours[key]
      if (!day.open) continue

      if (!day.start || !day.end) {
        errors[key] = 'Opening and closing times are required.'
        continue
      }
      if (day.end <= day.start) {
        errors[key] = 'Closing time must be after opening time.'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTopError(null)
    if (!validate()) return
    await submitStep2(hours)
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
          Step 2 of 3
        </p>
        <h2
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
        >
          When are you open?
        </h2>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Set your regular operating hours. You can adjust these later.
        </p>
      </div>

      {/* Top-level error banner (server or "no open day") */}
      {(error || topError) && (
        <div
          className="mb-6 px-4 py-3 rounded-md text-sm border"
          style={{
            backgroundColor: '#FEF2F2',
            borderColor: '#FECACA',
            color: '#B91C1C',
          }}
        >
          {error ?? topError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-2 mb-8">
          {DAYS.map(({ key, label }) => (
            <DayRow
              key={key}
              label={label}
              dayHours={hours[key]}
              error={fieldErrors[key]}
              onToggle={() => toggleDay(key)}
              onChangeStart={(v) => updateTime(key, 'start', v)}
              onChangeEnd={(v) => updateTime(key, 'end', v)}
            />
          ))}
        </div>

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
      </form>
    </div>
  )
}

// ─── Day Row ──────────────────────────────────────────────────────────────────

interface DayRowProps {
  label:          string
  dayHours:       DayHours
  error?:         string
  onToggle:       () => void
  onChangeStart:  (v: string) => void
  onChangeEnd:    (v: string) => void
}

function DayRow({
  label,
  dayHours,
  error,
  onToggle,
  onChangeStart,
  onChangeEnd,
}: DayRowProps) {
  const { open, start, end } = dayHours

  return (
    <div
      className="rounded-md border px-4 py-3 transition-colors"
      style={{
        borderColor:     error ? '#FECACA' : open ? '#E07B39' : '#E5E7EB',
        backgroundColor: open ? '#FFFFFF' : '#F9FAFB',
      }}
    >
      {/* Day name + toggle */}
      <div className="flex items-center justify-between gap-4">
        <span
          className="text-sm font-medium w-24 shrink-0"
          style={{ color: open ? '#111111' : '#9CA3AF' }}
        >
          {label}
        </span>

        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 ml-auto"
          aria-pressed={open}
        >
          {/* Toggle track */}
          <div
            className="relative w-9 h-5 rounded-full transition-colors"
            style={{ backgroundColor: open ? '#E07B39' : '#D1D5DB' }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
              style={{ transform: open ? 'translateX(18px)' : 'translateX(2px)' }}
            />
          </div>
          <span
            className="text-xs font-medium w-10 text-left"
            style={{ color: open ? '#E07B39' : '#9CA3AF' }}
          >
            {open ? 'Open' : 'Closed'}
          </span>
        </button>
      </div>

      {/* Time inputs — only visible when open */}
      {open && (
        <div className="mt-3 flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-0">
            <label
              className="block text-xs mb-1"
              style={{ color: '#6B7280' }}
            >
              Opens
            </label>
            <input
              type="time"
              value={start}
              onChange={(e) => onChangeStart(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm border outline-none transition-all"
              style={{
                borderColor: error ? '#FECACA' : '#D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#111111',
              }}
              onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#E07B39'
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#D1D5DB'
              }}
            />
          </div>

          <span
            className="text-sm pt-5 shrink-0"
            style={{ color: '#9CA3AF' }}
          >
            →
          </span>

          <div className="flex-1 min-w-0">
            <label
              className="block text-xs mb-1"
              style={{ color: '#6B7280' }}
            >
              Closes
            </label>
            <input
              type="time"
              value={end}
              onChange={(e) => onChangeEnd(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm border outline-none transition-all"
              style={{
                borderColor: error ? '#FECACA' : '#D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#111111',
              }}
              onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#E07B39'
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#D1D5DB'
              }}
            />
          </div>
        </div>
      )}

      {/* Inline day error */}
      {error && (
        <p className="mt-2 text-xs" style={{ color: '#B91C1C' }}>
          {error}
        </p>
      )}
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