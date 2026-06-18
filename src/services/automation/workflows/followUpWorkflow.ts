import type { AppointmentWithRelations } from '../../appointmentService'
import type { Customer } from '../../customerService'

export const followUpWorkflow = {
  async execute(
    appointment: AppointmentWithRelations,
    customer: Customer
    ) {
        void customer
    console.log(
      '[Workflow] Follow-up',
      appointment.id
    )

    // coming soon
  },
}