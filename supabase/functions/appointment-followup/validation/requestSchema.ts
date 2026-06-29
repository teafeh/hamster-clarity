import { z } from "npm:zod";

const appointmentFollowupSchema =
  z.object({
    appointmentId: z.string().uuid(),
  });

export function validateAppointmentFollowupRequest(
  input: unknown,
) {
  return appointmentFollowupSchema.parse(
    input,
  );
}