import type { Business } from '../../businessService'
import type { Customer } from '../../customerService'
import type {
  AppointmentWithRelations,
} from '../../appointmentService'
import type { Service } from '../../serviceService'

interface BuildVariablesOptions {
  business: Business
  customer: Customer
  appointment: AppointmentWithRelations
  service: Service
  senderName: string
}

export const templateVariableService = {
  build({
    business,
    customer,
    appointment,
    service,
    senderName,
  }: BuildVariablesOptions) {
    const date = new Date(
      appointment.scheduled_at
    )

    const appointmentDate =
      date.toLocaleDateString()

    const appointmentTime =
      date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })

    return {
      // Customer
      customer_name:
        customer.first_name,

      customer_first_name:
        customer.first_name,

      customer_last_name:
        customer.last_name ?? '',

      customer_email:
        customer.email ?? '',

      customer_phone:
        customer.phone ?? '',

      // Business
      business_name:
        business.name,

      business_type:
        business.business_type,

      // Service
      service_name:
        service.name,

      service_price:
        String(service.price),

      service_duration:
        String(
          service.duration_minutes ??
          appointment.duration_minutes ??
          ''
        ),

      // Appointment
      appointment_date:
        appointmentDate,

      appointment_time:
        appointmentTime,

      appointment_datetime:
        `${appointmentDate} ${appointmentTime}`,

      appointment_duration:
        `${appointment.duration_minutes ?? 0} mins`,

      // Email
      sender_name:
        senderName,
    }
  },

  replace(
    text: string,
    variables: Record<string, string>
  ) {
    let output = text

    Object.entries(variables).forEach(
      ([key, value]) => {
        output = output.replace(
          new RegExp(`{{${key}}}`, 'g'),
          value ?? ''
        )
      }
    )

    return output
  },
}