import { appointmentCompletionService } from "./services/appointmentCompletionService.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateCompleteAppointmentRequest,
} from "./validation/requestSchema.ts";

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Complete Appointment request received",
    );

    const body = await req.json();

    const {
      appointmentId,
      paymentStatus,
      paymentMethod,
    } = validateCompleteAppointmentRequest(body);

    console.log("[EDGE]", {
      appointmentId,
      paymentStatus,
      paymentMethod,
    });

    const appointment =
      await appointmentCompletionService.completeAppointment(
        appointmentId,
        paymentStatus,
        paymentMethod,
      );

    console.log(
      "[STEP 2] Appointment completed",
    );

    return ok({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(
      "[COMPLETE APPOINTMENT]",
      error,
    );

    return serverError(error);
  }
});