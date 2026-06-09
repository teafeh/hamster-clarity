import type { AppointmentWithRelations } from '@/services/appointmentService'

interface AppointmentDetailsModalProps {
  appointment: AppointmentWithRelations
  onClose: () => void
}

export default function AppointmentDetailsModal({
  appointment,
  onClose,
}: AppointmentDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="w-full max-w-lg rounded-xl border shadow-xl"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
        }}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2
            className="text-lg font-semibold"
            style={{ color: '#111111' }}
          >
            Appointment Details
          </h2>

          <button
            onClick={onClose}
            className="text-sm"
            style={{ color: '#6B7280' }}
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Detail
            label="Customer"
            value={
              appointment.customer
                ? `${appointment.customer.first_name} ${appointment.customer.last_name ?? ''}`
                : '—'
            }
          />

          <Detail
            label="Service"
            value={appointment.service?.name ?? '—'}
          />

          <Detail
            label="Price"
            value={
              appointment.service?.price
                ? `₦${appointment.service.price.toLocaleString()}`
                : '—'
            }
          />

          <Detail
            label="Status"
            value={appointment.status}
          />

          <Detail
            label="Customer Status"
            value={appointment.customer_status ?? '—'}
          />

          <Detail
            label="Assigned To"
            value={appointment.assigned_to ?? '—'}
          />

          <Detail
            label="Lead Source"
            value={appointment.lead_source ?? '—'}
          />

          <Detail
            label="Duration"
            value={
              appointment.duration_minutes
                ? `${appointment.duration_minutes} mins`
                : '—'
            }
          />

          <Detail
            label="Date"
            value={new Date(
              appointment.scheduled_at
            ).toLocaleString()}
          />

          <Detail
            label="Notes"
            value={appointment.notes ?? '—'}
          />
        </div>

        <div className="p-5 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md"
            style={{
              backgroundColor: '#111111',
              color: '#FAFAF8',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p
        className="text-xs uppercase mb-1"
        style={{ color: '#6B7280' }}
      >
        {label}
      </p>

      <p
        className="text-sm"
        style={{ color: '#111111' }}
      >
        {value}
      </p>
    </div>
  )
}