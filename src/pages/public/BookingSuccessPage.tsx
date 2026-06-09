import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import HamsterLoader from '@/components/animation/HamsterLoader'
import BookingNotFoundPage from '../BookingNotFoundPage'
import { appointmentService } from '@/services/appointmentService'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function BookingSuccessPage() {
  const { appointmentId } = useParams()

  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAppointment = async () => {
      if (!appointmentId) {
        setLoading(false)
        return
      }

      try {
        const data = await appointmentService.getAppointmentById(
          appointmentId
        )

        setAppointment(data)
      } catch (error) {
        console.error('Failed to load appointment:', error)
        setAppointment(null)
      } finally {
        setLoading(false)
      }
    }

    loadAppointment()
  }, [appointmentId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
        <div className="flex flex-col items-center">
          <div className="scale-[2]">
            <HamsterLoader />
          </div>

          <h2 className="mt-2 text-xl font-semibold text-neutral-900">
            Preparing your confirmation
          </h2>

          <p className="text-sm text-neutral-500 animate-pulse">
            Please wait a moment...
          </p>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return <BookingNotFoundPage />
 
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="relative overflow-hidden w-full max-w-xl bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center">
          <div className="w-48 h-48 mx-auto mb-2">
            <DotLottieReact
              src="/animations/booked.lottie"
              autoplay
              loop={true}
            />
          </div>

          <p className="text-sm font-semibold tracking-widest uppercase text-orange-500 mb-2">
            Booking Confirmed
          </p>

          <h1 className="text-3xl font-bold text-neutral-900 mb-3">
            You're all set
          </h1>

          <p className="text-neutral-500 mb-8">
            Your appointment has been successfully scheduled.
          </p>
        </div>

        <div className="space-y-5 border rounded-2xl p-6 bg-neutral-50">
          <div>
            <p className="text-xs uppercase text-neutral-500">
              Appointment ID
            </p>

            <p className="font-medium break-all">
              {appointment.id}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-neutral-500">
              Status
            </p>

            <p className="font-medium capitalize">
              {appointment.status}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-neutral-500">
              Scheduled For
            </p>

            <p className="font-medium">
              {new Date(
                appointment.scheduled_at
              ).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="w-full inline-flex justify-center items-center rounded-xl bg-black px-6 py-3 text-white font-medium"
          >
            Return Home
          </Link>
        </div>

        {/* <div className="absolute inset-0 pointer-events-none opacity-70">
          <DotLottieReact
            src="/animations/confirmation.lottie"
            autoplay
            loop
          />
        </div> */}
      </div>
    </div>
  )
}