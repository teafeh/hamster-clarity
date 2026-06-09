import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  appointmentService,
  type AppointmentWithRelations,
} from '@/services/appointmentService'
import HamsterLoader from '../../components/animation/HamsterLoader'
import ErrorState from '@/components/common/ErrorState'


export default function PublicAppointmentPage() {
  const { appointmentId } = useParams()

  const [appointment, setAppointment] =
    useState<AppointmentWithRelations | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!appointmentId) return

      try {
        const data =
          await appointmentService.getAppointmentById(
            appointmentId
          )

        setAppointment(data)
      } catch {
        setError('Appointment not found.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [appointmentId])

 if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <HamsterLoader />

      <div className="text-center">
        <p
          className="text-sm font-medium"
          style={{ color: '#111111' }}
        >
          Preparing your booking details
        </p>

        <p
          className="text-xs mt-1"
          style={{ color: '#9CA3AF' }}
        >
          Please wait a moment...
        </p>
      </div>
    </div>
  )
}
if (error || !appointment) {
  return (
    <ErrorState
      title="Appointment Not Found"
      description="This booking link is invalid, expired, or no longer available."
      buttonText="Book New Appointment"
      buttonLink="/booking"
    />
  )
}


  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: '#FAFAF8' }}
    >
      <div
        className="w-full max-w-xl rounded-2xl border bg-white p-8"
        style={{ borderColor: '#E5E7EB' }}
      >
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: '#E07B39' }}
        >
          Appointment Confirmation
        </p>

        <h1
          className="text-3xl font-semibold mb-6"
          style={{
            fontFamily: "'Fraunces', serif",
          }}
        >
          {appointment.customer?.first_name}{' '}
          {appointment.customer?.last_name}
        </h1>

        <div className="space-y-4 text-sm">
          <Row
            label="Service"
            value={appointment.service?.name ?? '-'}
          />

          <Row
            label="Price"
            value={`₦${appointment.service?.price ?? 0}`}
          />

          <Row
            label="Status"
            value={appointment.status}
          />

          

          <Row
            label="Duration"
            value={`${appointment.duration_minutes ?? 0} mins`}
          />

          <Row
            label="Date"
            value={new Date(
              appointment.scheduled_at
            ).toLocaleString()}
          />
        </div>
      </div>
    </div>
  )
}

function Row({
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

      <p className="font-medium">{value}</p>
    </div>
  )
}