import { customerCreatedWorkflow } from "./workflows/customerCreatedWorkflow.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  console.log("[STEP 1] Customer Created request received");

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    console.log("[EDGE]", body);

    if (!body.customerId) {
      throw new Error("customerId is required");
    }

    const result = await customerCreatedWorkflow.run(
      body.customerId
    );

    console.log("[STEP 2] Workflow completed");

    return Response.json(result, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error(error);

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