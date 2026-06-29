import { appointmentFollowupWorkflow } from "./workflows/appointmentFollowupWorkflow.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateAppointmentFollowupRequest,
} from "./validation/requestSchema.ts";

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Appointment Follow-up request received"
    );

    const body = await req.json();

    const { appointmentId } =
      validateAppointmentFollowupRequest(
        body
      );

    console.log("[EDGE]", {
      appointmentId,
    });

    await appointmentFollowupWorkflow.run(
      appointmentId
    );

    console.log(
      "[STEP 2] Workflow completed"
    );

    return ok({
      success: true,
    });
  } catch (error) {
    console.error(
      "[APPOINTMENT FOLLOW-UP]",
      error
    );

    return serverError(error);
  }
});