import { z } from "npm:zod";

const customerCreatedSchema = z.object({
  customerId: z.string().uuid(),
});

export function validateCustomerCreatedRequest(
  input: unknown,
) {
  return customerCreatedSchema.parse(input);
}