import { bookingConfirmationService } from '../services/bookingConfirmationService'

import type { AppointmentWithRelations } from '../../../../src/services/appointmentService'
import type { Customer } from '../../../../src/services/customerService'

export const bookingConfirmationWorkflow = {
  async execute(
    appointment: AppointmentWithRelations,
    customer: Customer
  ) {
    await bookingConfirmationService.send(
      appointment,
      customer
    )
  },
}