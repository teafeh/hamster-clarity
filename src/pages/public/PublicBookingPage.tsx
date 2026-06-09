import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { supabase } from '@/lib/supabase'

import HamsterLoader from '@/components/animation/HamsterLoader'
import BookingNotFoundPage from '../BookingNotFoundPage'
import BookingPage from './BookingPage'
import { serviceService, type Service } from '@/services/serviceService'
import { customerService } from '@/services/customerService'
import { appointmentService } from '@/services/appointmentService'



export default function PublicBookingPage() {
  const { businessSlug } = useParams()

  const [business, setBusiness] = useState<any>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (businessSlug) {
      loadBusiness()
    } else {
      setLoading(false)
    }
  }, [businessSlug])

  async function loadBusiness() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', businessSlug!)
        .single()

      if (error) {
        console.error(error)
        setBusiness(null)
        return
      }

      setBusiness(data)
      const businessServices =
        await serviceService.getServicesByBusiness(
          data.id
        )

      setServices(
        businessServices.filter(
          (service) => service.is_available
        )
      )
    } catch (err) {
      console.error(err)
      setBusiness(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async ({
    service,
    bookingDate,
    bookingTime,
    guestForm,
  }: {
    service: Service
    bookingDate: string
    bookingTime: string
    guestForm: {
      firstName: string
      lastName: string
      email: string
      phone: string
      notes: string
    }
  }): Promise<string | null> => {
    try {
      const customer =
        await customerService.createCustomer(
          business.id,
          business.user_id,
          {
            first_name: guestForm.firstName,
            last_name: guestForm.lastName || null,
            email: guestForm.email || null,
            phone: guestForm.phone || null,
            notes: guestForm.notes || null,
          }
        )

      const scheduledAt = new Date(
        `${bookingDate}T${bookingTime}`
      ).toISOString()

      const appointment =
        await appointmentService.createAppointment(
          business.id,
          business.user_id,
          {
            customer_id: customer.id,
            service_id: service.id,
            scheduled_at: scheduledAt,
            duration_minutes:
              service.duration_minutes,
            notes: guestForm.notes || null,

            customer_status: null,
            assigned_to: null,
            lead_source: 'public_booking',
          }
        )

      return appointment.id
    } catch (error) {
      console.error(error)
      return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
        <div className="flex flex-col items-center">
          <div className="scale-[2.2]">
            <HamsterLoader />
          </div>

          <h2 className="mt-2 text-lg font-medium text-[#111111]">
            Preparing your booking details
          </h2>

          <p className="text-sm text-gray-500 animate-pulse">
            Please wait a moment...
          </p>
        </div>
      </div>
    )
  }

  if (!business) {
    return <BookingNotFoundPage />
  }

    return (
    <BookingPage
      business={business}
      services={services}
      onCreateBooking={handleCreateBooking}
    />
  )
}