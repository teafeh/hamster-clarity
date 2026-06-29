import { z } from "npm:zod";

import {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../../shared/constants/payment.ts";

const completeAppointmentSchema = z.object({
  appointmentId: z.string().uuid(),

  paymentStatus: z.enum([
    PAYMENT_STATUS.PAID,
    PAYMENT_STATUS.PENDING,
    PAYMENT_STATUS.PARTIAL,
  ]),

  paymentMethod: z
    .enum([
      PAYMENT_METHOD.CASH,
      PAYMENT_METHOD.TRANSFER,
      PAYMENT_METHOD.CARD,
      PAYMENT_METHOD.ONLINE,
      PAYMENT_METHOD.OTHER,
    ])
    .nullable(),
});

export function validateCompleteAppointmentRequest(
  input: unknown,
) {
  return completeAppointmentSchema.parse(input);
}