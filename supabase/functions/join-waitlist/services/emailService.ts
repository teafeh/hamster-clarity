import { supabase } from "../lib/supabase.ts";

export const emailService = {
  async sendWelcomeEmail({
    email,
    businessType,
  }: {
    email: string;
    businessType: string;
  }) {
    const subject =
      "🎉 You're on the Flow by Hamster waitlist!";

    const html = `
      <h2>Welcome to Flow by Hamster 🐹</h2>

      <p>You're officially on the waitlist.</p>

      <p>
        We'll let you know as soon as we launch for
        <strong>${businessType}</strong>.
      </p>

      <br />

      <p>
        Until then, we're building something that helps
        service businesses spend less time chasing bookings
        and more time serving customers.
      </p>

      <br />

      <p>— The Flow Team</p>
    `;

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