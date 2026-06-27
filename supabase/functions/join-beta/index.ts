import { betaService } from "./services/betaService.ts";
import { validateBetaRequest } from "./validation/betaSchema.ts";

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
    const body = await req.json();

    const data = validateBetaRequest(body);

    const entry = await betaService.join(data.token);

    console.log(
      "[BETA] User joined beta:",
      entry.email,
    );

    return Response.json(
      {
        success: true,
        message: "Successfully joined beta program.",
      },
      {
        headers: corsHeaders,
      },
    );
  } catch (err) {
    console.error("[BETA]", err);

    return Response.json(
      {
        success: false,
        error: err instanceof Error
          ? err.message
          : "Unexpected error",
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    );
  }
});