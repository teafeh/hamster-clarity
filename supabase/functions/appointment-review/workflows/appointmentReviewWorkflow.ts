import {
  getAppointment,
  markReviewRequested,
} from "../../shared/appointment/appointmentService.ts";

import {
  EMAIL_TEMPLATE_TYPES,
} from "../../shared/constants/emailTemplateTypes.ts";

import { automationService } from "../../shared/automation/automationService.ts";

import { emailTemplateService } from "../../shared/email/emailTemplateService.ts";

import { emailSettingsService } from "../../shared/email/emailSettingsService.ts";

import { emailSenderService } from "../../shared/email/emailSenderService.ts";

import { templateVariableService } from "../../shared/utils/templateVariableService.ts";

export const appointmentReviewWorkflow = {
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

    if (!automation?.review_request_enabled) {
      console.log(
        "[REVIEW] Automation disabled"
      );
      return;
    }

    console.log("[STEP 4] Loading template");

    const template =
      await emailTemplateService.getTemplate(
        appointment.business.id,
        EMAIL_TEMPLATE_TYPES.REVIEW_REQUEST
      );

    if (!template) {
      throw new Error(
        "Review template not found."
      );
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
        reviewUrl:
          emailSettings?.review_url ??
          "",
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

    console.log("[STEP 5] Sending email");

    await emailSenderService.sendEmail({
      to: appointment.customer.email!,
      subject,
      html: body,
      senderName:
        emailSettings?.sender_name ??
        appointment.business.name,
      replyTo:
        emailSettings?.reply_to_email ??
        undefined,
    });

    console.log(
      "[STEP 6] Marking review requested"
    );

    await markReviewRequested(
      appointment.id
    );

    console.log(
      "[REVIEW] Review request sent."
    );
  },
};