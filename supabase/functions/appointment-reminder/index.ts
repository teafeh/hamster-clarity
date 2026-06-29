import {
  getAppointment,
  markReminderSent,
} from "../shared/appointment/appointmentService.ts";

import { appointmentReminderService } from "../shared/email/appointmentReminderService.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateAppointmentReminderRequest,
} from "./validation/requestSchema.ts";

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Appointment Reminder request received"
    );

    const body = await req.json();

    const { appointmentId } =
      validateAppointmentReminderRequest(body);

    console.log("[EDGE]", {
      appointmentId,
    });

    const appointment =
      await getAppointment(appointmentId);

    console.log(
      "[STEP 2] Appointment loaded"
    );

    if (!appointment.customer) {
      throw new Error(
        "Customer relation not loaded"
      );
    }

    await appointmentReminderService.send(
      appointment,
      appointment.customer
    );

    console.log(
      "[STEP 3] Reminder sent"
    );

    await markReminderSent(
      appointment.id
    );

    console.log(
      "[STEP 4] reminder_sent_at updated"
    );

    return ok({
      success: true,
    });
  } catch (error) {
    console.error(
      "[APPOINTMENT REMINDER]",
      error
    );

    return serverError(error);
  }
});