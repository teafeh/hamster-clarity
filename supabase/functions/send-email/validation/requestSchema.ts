import { z } from "npm:zod";

const sendEmailSchema = z.object({
  to: z.union([
    z.string().email(),
    z.array(z.string().email()),
  ]),

  subject: z.string().min(1),

  html: z.string().min(1),

  senderName: z.string().optional(),

  replyTo: z.string().email().optional(),
});

export function validateSendEmailRequest(
  input: unknown,
) {
  return sendEmailSchema.parse(input);
}