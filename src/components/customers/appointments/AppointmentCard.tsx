import type {
  AppointmentWithRelations,
  AppointmentStatus,
} from '@/services/appointmentService'

// ─── Status config ────────────────────────────────────────────────────────────

interface StatusConfig {
  label:           string
  backgroundColor: string
  color:           string
}

const STATUS_CONFIG: Record<AppointmentStatus, StatusConfig> = {
  scheduled: {
    label:           'Scheduled',
    backgroundColor: '#EFF6FF',
    color:           '#1D4ED8',
  },
  completed: {
    label:           'Completed',
    backgroundColor: '#F0FDF4',
    color:           '#15803D',
  },
  cancelled: {
    label:           'Cancelled',
    backgroundColor: '#F3F4F6',
    color:           '#6B7280',
  },
  no_show: {
    label:           'No Show',
    backgroundColor: '#FFF7ED',
    color:           '#C2410C',
  },
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppointmentCardProps {
  appointment:      AppointmentWithRelations
  submitting:       boolean
  confirmingCancel: boolean
  onEdit:           () => void
  onMarkComplete:   () => void
  onMarkNoShow:     () => void
  onReschedule:     () => void
  onCancelStart:    () => void
  onCancelConfirm:  () => void
  onCancelCancel: () => void
  onViewDetails: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppointmentCard({
  appointment,
  submitting,
  confirmingCancel,
  onEdit,
  onMarkComplete,
  onMarkNoShow,
  onReschedule,
  onCancelStart,
  onCancelConfirm,
  onCancelCancel,
  onViewDetails,
}: AppointmentCardProps) {
  const { status } = appointment
  const isCancelled = status === 'cancelled'
  const isCompleted = status === 'completed'
  const hasActions  = !isCompleted

  const customerName = appointment.customer
    ? formatName(appointment.customer.first_name, appointment.customer.last_name)
    : 'Unknown customer'

  return (
    <div
      className="rounded-lg border transition-colors"
      style={{
        backgroundColor: isCancelled ? '#FAFAFA' : '#FFFFFF',
        borderColor:     confirmingCancel ? '#FECACA' : '#E5E7EB',
      }}
    >
      {/* ── Header: date/time + status badge ─────────────────────────── */}
      <div
        className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b"
        style={{ borderColor: '#F3F4F6' }}
      >
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: isCancelled ? '#9CA3AF' : '#111111' }}
          >
            {formatDate(appointment.scheduled_at)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            {formatTime(appointment.scheduled_at)}
            {appointment.duration_minutes != null && (
              <span style={{ color: '#9CA3AF' }}>
                {' '}· {appointment.duration_minutes} min
              </span>
            )}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* ── Body: customer, service, notes ───────────────────────────── */}
      <div className="px-5 py-3">
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: isCancelled ? '#9CA3AF' : '#111111' }}
        >
          {customerName}
        </p>

        {appointment.service && (
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            {appointment.service.name}
            <span style={{ color: '#D1D5DB' }}> · </span>
            <span style={{ color: '#9CA3AF' }}>
              ₦{appointment.service.price.toLocaleString()}
            </span>
          </p>
        )}

        {!appointment.service && (
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
            No service selected
          </p>
        )}

        <div className="mt-2 space-y-1">
  {appointment.customer_status && (
    <p className="text-xs" style={{ color: '#6B7280' }}>
      Customer: <strong>{appointment.customer_status}</strong>
    </p>
  )}

  {appointment.assigned_to && (
    <p className="text-xs" style={{ color: '#6B7280' }}>
      Assigned: <strong>{appointment.assigned_to}</strong>
    </p>
  )}

  {appointment.lead_source && (
    <p className="text-xs" style={{ color: '#6B7280' }}>
      Lead Source: <strong>{appointment.lead_source}</strong>
    </p>
  )}
</div>

        {appointment.notes && (
          <p
            className="text-xs mt-1.5 truncate"
            style={{ color: '#9CA3AF' }}
            title={appointment.notes}
          >
            {appointment.notes}
          </p>
        )}
      </div>

      {/* ── Actions ──────────────────────────────────────────────────── */}
      {hasActions && (
        <div
          className="px-5 pb-4 pt-2 border-t"
          style={{ borderColor: '#F3F4F6' }}
        >
          {confirmingCancel ? (
            <CancelConfirmation
              submitting={submitting}
              onConfirm={onCancelConfirm}
              onCancel={onCancelCancel}
            />
          ) : (
            <ActionRow
  appointmentId={appointment.id}
  status={status}
  submitting={submitting}
  onEdit={onEdit}
  onMarkComplete={onMarkComplete}
  onMarkNoShow={onMarkNoShow}
  onReschedule={onReschedule}
                onCancelStart={onCancelStart}
                onViewDetails={onViewDetails}
  
/>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0"
      style={{
        backgroundColor: config.backgroundColor,
        color:           config.color,
      }}
    >
      {config.label}
    </span>
  )
}

// ─── Action row ───────────────────────────────────────────────────────────────

interface ActionRowProps {
  appointmentId: string
  status: AppointmentStatus
  submitting: boolean
  onEdit: () => void
  onViewDetails: () => void
  onMarkComplete: () => void
  onMarkNoShow: () => void
  onReschedule: () => void
  onCancelStart: () => void
}

function ActionRow({
  appointmentId,
  status,
  submitting,
  onEdit,
  onViewDetails,
  onMarkComplete,
  onMarkNoShow,
  onReschedule,
  onCancelStart,
}: ActionRowProps){
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {status === 'scheduled' && (
        <>
          <ActionButton
  label="Edit"
  variant="neutral"
  disabled={submitting}
  onClick={onEdit}
/>

<ActionButton
  label="Details"
  variant="neutral"
  disabled={submitting}
  onClick={onViewDetails}
/>
          <ActionButton
  label="Share"
  variant="neutral"
  disabled={submitting}
  onClick={() => {
    navigator.clipboard.writeText(
  `${window.location.origin}/booking/${appointmentId}`
)

    alert('Booking link copied')
  }}
/>
          <ActionButton
            label="Complete"
            variant="success"
            disabled={submitting}
            onClick={onMarkComplete}
          />
          <ActionButton
            label="No Show"
            variant="warning"
            disabled={submitting}
            onClick={onMarkNoShow}
          />
          <ActionButton
            label="Cancel"
            variant="danger"
            disabled={submitting}
            onClick={onCancelStart}
          />
        </>
      )}

      {(status === 'cancelled' || status === 'no_show') && (
        <ActionButton
          label="Reschedule"
          variant="neutral"
          disabled={submitting}
          onClick={onReschedule}
        />
      )}
    </div>
  )
}

// ─── Cancel confirmation ──────────────────────────────────────────────────────

interface CancelConfirmationProps {
  submitting: boolean
  onConfirm:  () => void
  onCancel:   () => void
}

function CancelConfirmation({
  submitting,
  onConfirm,
  onCancel,
}: CancelConfirmationProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs" style={{ color: '#B91C1C' }}>
        Cancel this appointment?
      </span>

      <button
        onClick={onConfirm}
        disabled={submitting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-opacity"
        style={{
          backgroundColor: '#B91C1C',
          color:           '#FFFFFF',
          opacity:         submitting ? 0.5 : 1,
          cursor:          submitting ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting && <MiniSpinner />}
        {submitting ? 'Cancelling…' : 'Yes, cancel'}
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
        Keep
      </button>
    </div>
  )
}

// ─── Generic action button ────────────────────────────────────────────────────

type ButtonVariant = 'neutral' | 'success' | 'warning' | 'danger'

interface ButtonConfig {
  borderColor:        string
  color:              string
  backgroundColor:    string
  hoverBg:            string
}

const BUTTON_CONFIG: Record<ButtonVariant, ButtonConfig> = {
  neutral: {
    borderColor:     '#D1D5DB',
    color:           '#374151',
    backgroundColor: '#FFFFFF',
    hoverBg:         '#F9FAFB',
  },
  success: {
    borderColor:     '#BBF7D0',
    color:           '#15803D',
    backgroundColor: '#FFFFFF',
    hoverBg:         '#F0FDF4',
  },
  warning: {
    borderColor:     '#FED7AA',
    color:           '#C2410C',
    backgroundColor: '#FFFFFF',
    hoverBg:         '#FFF7ED',
  },
  danger: {
    borderColor:     '#FECACA',
    color:           '#B91C1C',
    backgroundColor: '#FFFFFF',
    hoverBg:         '#FEF2F2',
  },
}

interface ActionButtonProps {
  label:    string
  variant:  ButtonVariant
  disabled: boolean
  onClick:  () => void
}

function ActionButton({ label, variant, disabled, onClick }: ActionButtonProps) {
  const config = BUTTON_CONFIG[variant]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
      style={{
        borderColor:     config.borderColor,
        color:           config.color,
        backgroundColor: config.backgroundColor,
        opacity:         disabled ? 0.5 : 1,
        cursor:          disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = config.hoverBg }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = config.backgroundColor }}
    >
      {label}
    </button>
  )
}

// ─── Mini spinner ─────────────────────────────────────────────────────────────

function MiniSpinner() {
  return (
    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatName(firstName: string, lastName: string | null): string {
  return lastName ? `${firstName} ${lastName}` : firstName
}

function formatDate(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleDateString('en-GB', {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
    year:    'numeric',
  })
}

function formatTime(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleTimeString('en-GB', {
    hour:   '2-digit',
    minute: '2-digit',
  })
}