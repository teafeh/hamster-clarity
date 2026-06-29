import { z } from "npm:zod";

const schema = z.object({
  token: z.string().uuid(),
});

export function validateBetaRequest(body: unknown) {
  return schema.parse(body);
}