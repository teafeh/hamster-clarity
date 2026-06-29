import { Resend } from "npm:resend@4.0.0";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateSendEmailRequest,
} from "./validation/requestSchema.ts";

const resend = new Resend(
  Deno.env.get("RESEND_API_KEY"),
);

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Send Email request received",
    );

    const body = await req.json();

    const {
      to,
      subject,
      html,
      senderName,
      replyTo,
    } = validateSendEmailRequest(body);

    console.log("[EMAIL]", {
      to,
      subject,
      hasHtml: !!html,
    });

    const { data, error } =
      await resend.emails.send({
        from: `${
          senderName ?? "Flow"
        } <hello@useflow.cc>`,

        to,

        subject,

        html,

        replyTo,
      });

    if (error) {
      throw error;
    }

    console.log(
      "[STEP 2] Email sent",
      {
        id: data?.id,
      },
    );

    return ok({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "[SEND EMAIL]",
      error,
    );

    return serverError(error);
  }
});