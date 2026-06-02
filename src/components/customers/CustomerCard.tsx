import type { Customer } from '@/services/customerService'

// ─── Props ────────────────────────────────────────────────────────────────────

interface CustomerCardProps {
  customer:          Customer
  submitting:        boolean
  confirmingArchive: boolean
  onEdit:            () => void
  onArchive:         () => void
  onArchiveConfirm:  () => void
  onArchiveCancel:   () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerCard({
  customer,
  submitting,
  confirmingArchive,
  onEdit,
  onArchive,
  onArchiveConfirm,
  onArchiveCancel,
}: CustomerCardProps) {
  return (
    <div
      className="rounded-lg border p-4 sm:p-5 transition-all"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor:     confirmingArchive ? '#FDE68A' : '#E5E7EB',
      }}
    >
      <div className="flex items-start gap-4">

        {/* ── Initials avatar ─────────────────────────────────────────── */}
        <InitialsAvatar
          firstName={customer.first_name}
          lastName={customer.last_name}
        />

        {/* ── Customer info ────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-snug"
            style={{ color: '#111111' }}
          >
            {formatName(customer.first_name, customer.last_name)}
          </p>

          <div className="mt-1 space-y-0.5">
            {customer.phone && (
              <div className="flex items-center gap-1.5">
                <PhoneIcon />
                <span className="text-xs" style={{ color: '#6B7280' }}>
                  {customer.phone}
                </span>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-1.5 min-w-0">
                <EmailIcon />
                <span
                  className="text-xs truncate"
                  style={{ color: '#6B7280' }}
                  title={customer.email}
                >
                  {customer.email}
                </span>
              </div>
            )}
            {customer.notes && (
              <p
                className="text-xs truncate pt-0.5"
                style={{ color: '#9CA3AF' }}
                title={customer.notes}
              >
                {customer.notes}
              </p>
            )}
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="shrink-0 self-start">
          {confirmingArchive ? (
            <ArchiveConfirmation
              submitting={submitting}
              onConfirm={onArchiveConfirm}
              onCancel={onArchiveCancel}
            />
          ) : (
            <CardActions
              submitting={submitting}
              onEdit={onEdit}
              onArchive={onArchive}
            />
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CardActionsProps {
  submitting: boolean
  onEdit:     () => void
  onArchive:  () => void
}

function CardActions({ submitting, onEdit, onArchive }: CardActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        disabled={submitting}
        className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
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
        Edit
      </button>

      <button
        onClick={onArchive}
        disabled={submitting}
        className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
        style={{
          borderColor:     '#FDE68A',
          color:           '#B45309',
          backgroundColor: '#FFFFFF',
          opacity:         submitting ? 0.5 : 1,
          cursor:          submitting ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#FFFBEB' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
      >
        Archive
      </button>
    </div>
  )
}

interface ArchiveConfirmationProps {
  submitting: boolean
  onConfirm:  () => void
  onCancel:   () => void
}

function ArchiveConfirmation({ submitting, onConfirm, onCancel }: ArchiveConfirmationProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      <span className="text-xs w-full text-right sm:w-auto" style={{ color: '#B45309' }}>
        Archive this customer?
      </span>

      <button
        onClick={onConfirm}
        disabled={submitting}
        className="px-3 py-1.5 rounded text-xs font-semibold transition-opacity flex items-center gap-1.5"
        style={{
          backgroundColor: '#B45309',
          color:           '#FFFFFF',
          opacity:         submitting ? 0.5 : 1,
          cursor:          submitting ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting && <MiniSpinner />}
        {submitting ? 'Archiving…' : 'Yes, archive'}
      </button>

      <button
        onClick={onCancel}
        disabled={submitting}
        className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
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
  )
}

// ─── Initials avatar ──────────────────────────────────────────────────────────

interface InitialsAvatarProps {
  firstName: string
  lastName:  string | null
}

function InitialsAvatar({ firstName, lastName }: InitialsAvatarProps) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 select-none"
      style={{
        backgroundColor: getInitialsBg(firstName),
        color:           '#FFFFFF',
      }}
      aria-hidden="true"
    >
      {getInitials(firstName, lastName)}
    </div>
  )
}

// ─── Inline icons ─────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg
      width="11" height="11"
      fill="none" viewBox="0 0 24 24"
      stroke="#9CA3AF" strokeWidth={2}
      className="shrink-0"
    >
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg
      width="11" height="11"
      fill="none" viewBox="0 0 24 24"
      stroke="#9CA3AF" strokeWidth={2}
      className="shrink-0"
    >
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function MiniSpinner() {
  return (
    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatName(firstName: string, lastName: string | null): string {
  return lastName ? `${firstName} ${lastName}` : firstName
}

function getInitials(firstName: string, lastName: string | null): string {
  const first = firstName.charAt(0).toUpperCase()
  const last  = lastName ? lastName.charAt(0).toUpperCase() : ''
  return `${first}${last}`
}

/** Deterministic background colour derived from the first character of the name. */
function getInitialsBg(name: string): string {
  const palette = [
    '#E07B39', // brand amber
    '#0D9488', // teal
    '#7C3AED', // violet
    '#0284C7', // sky
    '#16A34A', // green
    '#DC2626', // red
    '#9333EA', // purple
    '#D97706', // amber-600
  ]
  return palette[name.charCodeAt(0) % palette.length]
}