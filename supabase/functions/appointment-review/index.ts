import { appointmentReviewWorkflow } from "./workflows/appointmentReviewWorkflow.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateAppointmentReviewRequest,
} from "./validation/requestSchema.ts";

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Appointment Review request received",
    );

    const body = await req.json();

    const { appointmentId } =
      validateAppointmentReviewRequest(body);

    console.log("[EDGE]", {
      appointmentId,
    });

    await appointmentReviewWorkflow.run(
      appointmentId,
    );

    console.log(
      "[STEP 2] Workflow completed",
    );

    return ok({
      success: true,
    });
  } catch (error) {
    console.error(
      "[APPOINTMENT REVIEW]",
      error,
    );

    return serverError(error);
  }
});