import type { AppointmentWithRelations } from '../../appointmentService'
import type { Customer } from '../../customerService'



export const appointmentReminderWorkflow = {
    async execute(
    appointment: AppointmentWithRelations,
    customer: Customer
    ) {
        void customer
    console.log(
      '[Workflow] Reminder',
      appointment.id
    )

    // future scheduler
  },
}