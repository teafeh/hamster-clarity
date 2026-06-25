import { emailTemplateService } from "./emailTemplateService.ts";
import { emailSettingsService } from "./emailSettingsService.ts";
import { emailSenderService } from "./emailSenderService.ts";
import { templateVariableService } from "../utils/templateVariableService.ts";
import { EMAIL_TEMPLATE_TYPES } from "../constants/emailTemplateTypes.ts";
import { automationService } from "../automation/automationService.ts";

import type { AppointmentWithRelations } from "../../../../src/services/appointmentService.ts";
import type { Customer } from "../../../../src/services/customerService.ts";

export const appointmentReminderService = {
  async send(
    appointment: AppointmentWithRelations,
    customer: Customer
  ) {
    try {
      if (!customer.email) {
        console.log(
          "[REMINDER] Customer has no email."
        );
        return;
      }

      console.log(
        "[REMINDER] Checking automation..."
      );

      const automation =
        await automationService.getSettingsByBusinessId(
          appointment.business_id
        );

      if (
        !automation?.appointment_reminder_enabled
      ) {
        console.log(
          "[REMINDER] Automation disabled."
        );
        return;
      }

      console.log(
        "[REMINDER] Loading template..."
      );

      const templates =
        await emailTemplateService.getTemplatesByBusinessId(
          appointment.business_id
        );

      const template = templates.find(
        (t) =>
          t.template_type ===
          EMAIL_TEMPLATE_TYPES.APPOINTMENT_REMINDER
      );

      if (!template) {
        console.log(
          "[REMINDER] Template not found."
        );
        return;
      }

      const emailSettings =
        await emailSettingsService.getSettingsByBusinessId(
          appointment.business_id
        );

      const variables =
        templateVariableService.build({
          business: appointment.business as any,
          customer,
          appointment,
          service: appointment.service as any,

          senderName:
            emailSettings?.sender_name ??
            appointment.business?.name ??
            "Flow by Hamster",
        });

      const subject =
        templateVariableService.replace(
          template.subject,
          variables
        );

      const body =
        templateVariableService.replace(
          template.body,
          variables
        );

      await emailSenderService.sendEmail({
        to: customer.email,
        subject,
        html: body,

        senderName:
          emailSettings?.sender_name ??
          appointment.business?.name ??
          "Flow by Hamster",

        replyTo:
          emailSettings?.reply_to_email ??
          undefined,
      });

      console.log(
        "[REMINDER] Reminder sent."
      );
    } catch (error) {
      console.error(
        "[REMINDER]",
        error
      );
    }
  },
};