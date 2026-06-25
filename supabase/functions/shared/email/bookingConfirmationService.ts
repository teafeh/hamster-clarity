import { emailTemplateService } from './emailTemplateService.ts'
import { emailSettingsService } from './emailSettingsService.ts'
import { emailSenderService } from './emailSenderService.ts'
import { templateVariableService } from '../utils/templateVariableService.ts'
import { EMAIL_TEMPLATE_TYPES } from '../constants/emailTemplateTypes.ts'

import type { AppointmentWithRelations } from '../../../../src/services/appointmentService.ts'
import type { Customer } from '../../../../src/services/customerService.ts'

export const bookingConfirmationService = {
  async send(
    appointment: AppointmentWithRelations,
    customer: Customer
  ) {
    try {
      if (!customer.email) {
        console.log(
          '[BOOKING] Customer has no email.'
        )
        return
      }

      const templates =
        await emailTemplateService.getTemplatesByBusinessId(
          appointment.business_id
        )
      
      console.log(
      '[BOOKING] Appointment business:',
      appointment.business_id
    )

    console.log(
      '[BOOKING] Templates:',
      templates
    )

    console.log(
      '[BOOKING] Expected:',
      EMAIL_TEMPLATE_TYPES.BOOKING_CONFIRMATION
    )

      const template = templates.find(
        t => t.template_type === EMAIL_TEMPLATE_TYPES.BOOKING_CONFIRMATION
      )

      if (!template) {
        console.log(
          '[BOOKING] Booking template not found.'
        )
        return
      }

      const emailSettings =
        await emailSettingsService.getSettingsByBusinessId(
          appointment.business_id
        )

      const variables =
        templateVariableService.build({
          business: {
            id: appointment.business!.id,
            name: appointment.business!.name,
          } as any,

          customer,

          appointment,

          service: {
            id: appointment.service!.id,
            name: appointment.service!.name,
            price: appointment.service!.price,
          } as any,

          senderName:
            emailSettings?.sender_name ??
            appointment.business?.name ??
            'Flow by Hamster',
        })

      const subject =
        templateVariableService.replace(
          template.subject,
          variables
        )

      const body =
        templateVariableService.replace(
          template.body,
          variables
        )

      await emailSenderService.sendEmail({
  to: customer.email,
  subject,
  html: body,

  senderName:
    emailSettings?.sender_name ??
    appointment.business?.name ??
    "UseFlow",

  replyTo:
    emailSettings?.reply_to_email ??
    undefined,
})

      console.log(
        '[BOOKING] Confirmation email sent.'
      )
    } catch (error) {
      console.error(
        '[BOOKING]',
        error
      )
    }
  },
}