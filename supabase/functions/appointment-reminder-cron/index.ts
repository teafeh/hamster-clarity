import { automationSchedulerService } from "../shared/automation/automationSchedulerService.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

async function invokeAutomation(
  functionName: string,
  appointmentId: string,
) {
  const response = await fetch(
    `${Deno.env.get("SUPABASE_URL")}/functions/v1/${functionName}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get(
          "SUPABASE_SERVICE_ROLE_KEY",
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId,
      }),
    },
  );

  const result = await response.text();

  console.log(
    `[CRON] ${functionName}`,
    response.status,
    result,
  );
}

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log("[CRON] Started");

    const automations =
      await automationSchedulerService.getPendingAutomations();

    console.log(
      "[CRON] Found automations:",
      automations,
    );

    for (const automation of automations) {
      console.log(
        `[CRON] Running ${automation.type} -> ${automation.entityId}`,
      );

      switch (automation.type) {
        case "appointment-reminder":
          await invokeAutomation(
            "appointment-reminder",
            automation.entityId,
          );
          break;

        case "appointment-followup":
          await invokeAutomation(
            "appointment-followup",
            automation.entityId,
          );
          break;

        case "review-request":
          await invokeAutomation(
            "appointment-review",
            automation.entityId,
          );
          break;

        default:
          console.log(
            `[CRON] Unknown automation: ${automation.type}`,
          );
      }
    }

    return ok({
      success: true,
    });
  } catch (error) {
    console.error(
      "[CRON]",
      error,
    );

    return serverError(error);
  }
});