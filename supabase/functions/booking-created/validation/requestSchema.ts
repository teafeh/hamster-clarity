import { z } from "npm:zod";

const bookingConfirmationSchema =
  z.object({
    appointmentId: z.string().uuid(),
  });

export function validateBookingConfirmationRequest(
  input: unknown,
) {
  return bookingConfirmationSchema.parse(
    input,
  );
}