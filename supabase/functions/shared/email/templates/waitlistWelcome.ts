import type { EmailTemplate } from "../types.ts";

import { heading } from "../components/heading.ts";
import { paragraph } from "../components/paragraph.ts";
import { card } from "../components/card.ts";

export function waitlistWelcomeTemplate({
  businessType,
}: {
  businessType: string;
}): EmailTemplate {
  return {
    title: "Welcome to Flow by Hamster",

    subtitle:
      "You're officially on the waitlist.",

    content: [
      heading("Welcome 👋"),

      paragraph(
        "Thank you for joining the Flow waitlist."
      ),

      paragraph(
        `We're building Flow to help ${businessType} businesses automate bookings, reminders, follow-ups and customer communication without the usual headaches.`
      ),

      card({
        content:
          heading("✨ What to expect") +
          paragraph(
            "• Smart appointment reminders<br/>• Automated follow-ups<br/>• Review requests<br/>• AI-powered customer workflows"
          ),
      }),

      paragraph(
        "As one of our earliest users, you'll receive product updates, early access opportunities and exclusive beta invitations as we get closer to launch."
      ),
    ],

    cta: {
  label: "Join the Beta Tester Program",
  url: `${FLOW.website}/beta?token=${betaToken}`,
}
  };
}