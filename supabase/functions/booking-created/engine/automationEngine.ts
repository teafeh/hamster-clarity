import { automationService } from '../../shared/automation/automationService'
import { bookingConfirmationWorkflow } from '../workflows/bookingConfirmationWorkflow'
import type { Business } from '../../businessService'
import type { AppointmentWithRelations } from '../../appointmentService'
import type { Service } from '../../serviceService'
import type { Customer } from '../../customerService'

export const automationEngine = {
  async handleBookingCreated({
    business,
    customer,
    appointment,
    service,
  }: {
    business: Business
    customer: Customer
    appointment: AppointmentWithRelations
    service: Service
    }) {
    void service
    try {
      if (!customer.email) {
        console.log(
          '[AUTOMATION] Customer has no email.'
        )
        return
      }

      const settings =
      await automationService.getSettingsByBusinessId(
        business.id
      )

    // Always send booking confirmation
    await bookingConfirmationWorkflow.execute(
      appointment,
      customer
    )

    if (!settings?.flow_assistant_enabled) {
      console.log(
        '[AUTOMATION] Flow Assistant disabled.'
      )
      return
    }


      console.log(
        '[AUTOMATION] Booking workflow completed.'
      )
    } catch (error) {
      console.error(
        '[AUTOMATION] Booking workflow failed.',
        error
      )
    }
  },

  async handleCustomerCreated({
  business,
  customer,
}: {
  business: Business
  customer: Customer
    }) {
    void customer
  try {
    console.log(
      '[AUTOMATION] Customer workflow started.'
    )

    const settings =
      await automationService.getSettingsByBusinessId(
        business.id
      )

    if (!settings?.flow_assistant_enabled) {
      console.log(
        '[AUTOMATION] Flow Assistant disabled.'
      )
      return
    }

    // Reserved for future:
    // await welcomeCustomerWorkflow.execute(customer)

    console.log(
      '[AUTOMATION] Customer workflow completed.'
    )
  } catch (error) {
    console.error(
      '[AUTOMATION] Customer workflow failed.',
      error
    )
  }
},
}