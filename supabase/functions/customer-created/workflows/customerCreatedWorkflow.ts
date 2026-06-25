import { getCustomer } from "../../shared/customer/customerService.ts";
import { automationService } from "../../shared/automation/automationService.ts";
import { emailSettingsService } from "../../shared/email/emailSettingsService.ts";
import { emailTemplateService } from "../../shared/email/emailTemplateService.ts";
import { emailSenderService } from "../../shared/email/emailSenderService.ts";
import { EMAIL_TEMPLATE_TYPES } from "../../shared/constants/emailTemplateTypes.ts";
import { templateVariableService } from "../../shared/utils/templateVariableService.ts";

export const customerCreatedWorkflow = {
  async run(customerId: string) {
    console.log("[STEP 1] Loading customer");

    const customer = await getCustomer(customerId);

    if (!customer.email) {
      return {
        success: true,
        emailSent: false,
        reason: "customer_has_no_email",
      };
    }

    console.log("[STEP 2] Loading automation settings");

    const automation =
  await automationService.getSettingsByBusinessId(
    customer.business_id
  )

    if (!automation?.welcome_customer_enabled) {
      return {
        success: true,
        emailSent: false,
        reason: "automation_disabled",
      };
    }

    console.log("[STEP 3] Loading email settings");

    const emailSettings =
  await emailSettingsService.getSettingsByBusinessId(
    customer.business_id
  )

        console.log("[STEP 4] Loading welcome template");
        
        

   const template =
  await emailTemplateService.getTemplate(
    customer.business_id,
    EMAIL_TEMPLATE_TYPES.WELCOME_CUSTOMER
       )
        
        if (!template) {
        return {
            success: true,
            emailSent: false,
            reason: "template_not_found",
        };
        }   

        


 const variables =
  templateVariableService.build({
    business: customer.business,
    customer,
    senderName:
      emailSettings?.sender_name ??
      customer.business.name,
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

console.log({
  subject,
  variables,
});

await emailSenderService.sendEmail({
  to: customer.email,
  subject,
  html: body,

  senderName:
    emailSettings?.sender_name ??
    customer.business.name,

  replyTo:
    emailSettings?.reply_to_email ??
    undefined,
});

    return {
      success: true,
      emailSent: true,
    };
  },
};