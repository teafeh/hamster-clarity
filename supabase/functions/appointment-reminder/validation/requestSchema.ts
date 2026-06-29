import { z } from "npm:zod";

const appointmentReminderSchema =
  z.object({
    appointmentId: z.string().uuid(),
  });

export function validateAppointmentReminderRequest(
  input: unknown,
) {
  return appointmentReminderSchema.parse(
    input,
  );
}