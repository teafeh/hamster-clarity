import { waitlistService } from "./services/waitlistService.ts";
import { emailService } from "./services/emailService.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateWaitlistRequest,
} from "./validation/requestSchema.ts";

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Waitlist request received",
    );

    const body = await req.json();

    const data =
      validateWaitlistRequest(body);

    console.log(
      "[STEP 2] Request validated",
    );

    const existing =
      await waitlistService.findByEmail(
        data.email,
      );

    if (existing) {
      console.log(
        "[STEP 3] Already on waitlist",
      );

      return ok({
        success: true,
        alreadyJoined: true,
        message:
          "You're already on the waitlist.",
      });
    }

    const entry =
      await waitlistService.join(data);

    console.log(
      "[STEP 3] Added to waitlist:",
      entry.email,
    );

    try {
      await emailService.sendWelcomeEmail({
        email: data.email,
        businessType:
          data.business_type,
        betaToken:
          entry.beta_token,
      });

      console.log(
        "[STEP 4] Welcome email sent",
      );
    } catch (error) {
      console.error(
        "[WAITLIST EMAIL]",
        error,
      );

      // Don't fail the request.
      // The user has already been added to the waitlist.
    }

    return ok({
      success: true,
      alreadyJoined: false,
      message:
        "Successfully joined the waitlist.",
    });
  } catch (error) {
    console.error(
      "[WAITLIST]",
      error,
    );

    return serverError(error);
  }
});