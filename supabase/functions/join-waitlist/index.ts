import { waitlistService } from "./services/waitlistService.ts";
import { emailService } from "./services/emailService.ts";
import {
  validateWaitlistRequest,
} from "./validation/waitlistSchema.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    console.log("[WAITLIST] Request received");

    const body = await req.json();

    const data =
      validateWaitlistRequest(body);

    console.log(
      "[WAITLIST] Payload validated"
    );

    const existing =
      await waitlistService.findByEmail(
        data.email
      );

    if (existing) {
      return Response.json(
        {
          success: false,
          message:
            "You're already on the waitlist.",
        },
        {
          headers: corsHeaders,
        }
      );
    }

    const entry =
      await waitlistService.join(data);

    console.log(
      "[WAITLIST] Added:",
      entry.email
    );

    try {
  await emailService.sendWelcomeEmail({
    email: data.email,
    businessType: data.business_type,
      });

      console.log("[WAITLIST] Welcome email sent.");
    } catch (err) {
      console.error(
        "[WAITLIST] Failed to send welcome email:",
        err
      );

      // Don't fail the request.
      // User is already on the waitlist.
    }

    console.log(
      "[WAITLIST] Welcome email sent."
    );

    return Response.json(
      {
        success: true,
        message:
          "Successfully joined the waitlist.",
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(
      "[WAITLIST]",
      error
    );

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});