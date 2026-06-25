import { automationSchedulerService } from "../shared/automation/automationSchedulerService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  console.log("[CRON] Started");

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    

    const automations =
      await automationSchedulerService.getPendingAutomations();
    
    console.log("[CRON] Found automations:", automations);
    
    for (const automation of automations) {
  console.log(
    `[CRON] Running ${automation.type} -> ${automation.entityId}`
  );

 switch (automation.type) {
  case "appointment-reminder": {
    const response = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/appointment-reminder`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get(
            "SUPABASE_SERVICE_ROLE_KEY"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: automation.entityId,
        }),
      }
    );

    const result = await response.json();

    console.log(result);

    break;
  }

  case "appointment-followup": {
    const response = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/appointment-followup`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get(
            "SUPABASE_SERVICE_ROLE_KEY"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: automation.entityId,
        }),
      }
    );

    const result = await response.json();

    console.log(result);

    break;
  }

  case "review-request": {
    const response = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/appointment-review`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get(
            "SUPABASE_SERVICE_ROLE_KEY"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: automation.entityId,
        }),
      }
    );

    const result = await response.json();

    console.log(result);

    break;
  }

  default:
    console.log(
      `[CRON] Unknown automation: ${automation.type}`
    );
}
}
    
  

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