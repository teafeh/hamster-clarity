import {
  getAppointment,
  markReminderSent,
} from "../shared/appointment/appointmentService.ts";
import { appointmentReminderService } from "../shared/email/appointmentReminderService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  console.log("[STEP 1] Appointment Reminder request received");

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    console.log("[EDGE]", body);

    if (!body.appointmentId) {
      throw new Error("appointmentId is required");
    }

    const appointment =
      await getAppointment(body.appointmentId);

    console.log("[STEP 2] Appointment loaded");

    if (!appointment.customer) {
      throw new Error(
        "Customer relation not loaded"
      );
    }

    await appointmentReminderService.send(
      appointment,
      appointment.customer
    );

      console.log("[STEP 3] Reminder sent");
      

       await markReminderSent(appointment.id);

        console.log(
        "[STEP 4] reminder_sent_at updated"
        );

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