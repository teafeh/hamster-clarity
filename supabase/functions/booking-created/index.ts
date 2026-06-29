import {
  getAppointment,
} from "../shared/appointment/appointmentService.ts";

import { bookingConfirmationService } from "../shared/email/bookingConfirmationService.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateBookingConfirmationRequest,
} from "./validation/requestSchema.ts";

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Booking Confirmation request received",
    );

    const body = await req.json();

    const { appointmentId } =
      validateBookingConfirmationRequest(body);

    console.log("[EDGE]", {
      appointmentId,
    });

    const appointment =
      await getAppointment(appointmentId);

    console.log(
      "[STEP 2] Appointment loaded",
    );

    if (!appointment.customer) {
      throw new Error(
        "Customer relation not loaded",
      );
    }

    await bookingConfirmationService.send(
      appointment,
      appointment.customer,
    );

    console.log(
      "[STEP 3] Booking confirmation sent",
    );

    return ok({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(
      "[BOOKING CONFIRMATION]",
      error,
    );

    return serverError(error);
  }
});