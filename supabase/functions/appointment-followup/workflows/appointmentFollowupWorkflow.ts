import {
  getAppointment,
  markFollowupSent,
} from "../../shared/appointment/appointmentService.ts";
import {
  EMAIL_TEMPLATE_TYPES,
} from "../../shared/constants/emailTemplateTypes.ts";
import { automationService } from "../../shared/automation/automationService.ts";
import { emailTemplateService } from "../../shared/email/emailTemplateService.ts";
import { emailSettingsService } from "../../shared/email/emailSettingsService.ts";
import { templateVariableService } from "../../shared/utils/templateVariableService.ts";
import { businessEmailService } from "../../shared/email/businessEmailService.ts";

export const appointmentFollowupWorkflow = {
  async run(appointmentId: string) {
    console.log("[STEP 1] Loading appointment");

    const appointment =
      await getAppointment(appointmentId);

    console.log("[STEP 2] Appointment loaded");

    console.log("[STEP 3] Checking automation");

    const automation =
  await automationService.getSettingsByBusinessId(
    appointment.business.id
  );

    if (!automation?.follow_up_enabled) {
      console.log(
        "[FOLLOWUP] Automation disabled"
      );
      return;
    }

    console.log("[STEP 4] Loading template");

    const template =
  await emailTemplateService.getTemplate(
    appointment.business.id,
    EMAIL_TEMPLATE_TYPES.FOLLOW_UP
  );

if (!template) {
  throw new Error("Follow-up email template not found.");
}

    const emailSettings =
  await emailSettingsService.getSettingsByBusinessId(
    appointment.business.id
  );

    const variables =
  templateVariableService.build({
    business: appointment.business,
    customer: appointment.customer,
    appointment,
    service: appointment.service,
    senderName:
      emailSettings?.sender_name ??
      appointment.business.name,
  });


    console.log("[STEP 5] Sending email");

    
await businessEmailService.sendTemplate({
  to: appointment.customer.email!,
  template,
  appointment,
  emailSettings,
});

    console.log("[STEP 6] Marking follow-up sent");

    await markFollowupSent(appointment.id);

    console.log(
      "[FOLLOWUP] Follow-up sent."
    );
  },
};