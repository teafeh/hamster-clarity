import { getAppointment } from "../shared/appointment/appointmentService.ts"
import { bookingConfirmationService } from "../shared/email/bookingConfirmationService.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {

    console.log("[STEP 1] Request received")
    
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
      const body = await req.json()
      
      console.log(body)
    

        const appointment =
            await getAppointment(body.appointmentId)
      
      console.log("[STEP 2] Appointment loaded")
console.log(appointment)

        console.log(
        "[EDGE APPOINTMENT]",
        appointment
        )
      
      if (!appointment.customer) {
  throw new Error("Customer relation not loaded")
}

      
      await bookingConfirmationService.send(
        appointment,
        appointment.customer
        )

        console.log("[STEP 3] Booking confirmation sent")

    return Response.json(
        {
            success: true,
            appointment,
        },
        {
            headers: corsHeaders,
        }
        )
  } catch (error) {
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