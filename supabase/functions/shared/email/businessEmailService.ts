import { emailSenderService } from "./emailSenderService.ts";
import { renderBusinessEmail } from "./renderBusinessEmail.ts";
import { templateVariableService } from "../utils/templateVariableService.ts";
import { templateContextService } from "../utils/templateContextService.ts";

export const businessEmailService = {
  async sendTemplate({
    to,
    template,
    appointment,
    emailSettings,
  }: {
    to: string;
    template: {
      subject: string;
      body: string;
    };
    appointment: any;
    emailSettings: any;
  }) {
    const senderName =
      emailSettings?.sender_name ??
      appointment.business.name;

    const variables =
templateContextService.build({
    appointment,
    senderName,
});

    const subject =
      templateVariableService.replace(
        template.subject,
        variables
      );

    const content =
      templateVariableService.replace(
        template.body,
        variables
      );

    const html = renderBusinessEmail({
      businessName: appointment.business.name,
      senderName,
      content,
    });

    return emailSenderService.sendEmail({
      to,
      subject,
      html,
      senderName,
      replyTo:
        emailSettings?.reply_to_email ??
        undefined,
    });
  },
};