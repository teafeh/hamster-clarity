import { appointmentReviewWorkflow } from "./workflows/appointmentReviewWorkflow.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  console.log(
    "[STEP 1] Appointment Review request received"
  );

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { appointmentId } = await req.json();

    console.log("[EDGE]", {
      appointmentId,
    });

    await appointmentReviewWorkflow.run(
      appointmentId
    );

    console.log("[STEP 2] Workflow completed");

    return Response.json(
      {
        success: true,
      },
      {
        headers: corsHeaders,
      }
    );
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