import { z } from "npm:zod";

const appointmentReviewSchema =
  z.object({
    appointmentId: z.string().uuid(),
  });

export function validateAppointmentReviewRequest(
  input: unknown,
) {
  return appointmentReviewSchema.parse(
    input,
  );
}