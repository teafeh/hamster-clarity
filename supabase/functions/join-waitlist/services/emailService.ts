import { supabase } from "../../shared/lib/supabase.ts";

import { renderTemplate } from "../../shared/email/render.ts";
import { waitlistWelcomeTemplate } from "../../shared/email/templates/waitlistWelcome.ts";

export const emailService = {
  async sendWelcomeEmail({
  email,
  businessType,
  betaToken,
}: {
  email: string
  businessType: string
  betaToken: string
}) {
    const subject =
      "🎉 You're on the Flow by Hamster waitlist!";

    const html = renderTemplate(
      waitlistWelcomeTemplate({
        businessType,
      })
    );

    const { error } = await supabase.functions.invoke(
      "send-email",
      {
        body: {
          to: email,
          subject,
          html,
        },
      }
    );

    if (error) throw error;
  },
};
