import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(
  Deno.env.get("RESEND_API_KEY")
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const {
      to,
      subject,
      html,
    } = await req.json();

    const { data, error } =
      await resend.emails.send({
        from:
          "Flow by Hamster <onboarding@resend.dev>",
        to,
        subject,
        html,
      });
    
    console.log({
      to,
      subject,
      hasHtml: !!html,
      hasApiKey: !!Deno.env.get("RESEND_API_KEY"),
    });

    if (error) {
      return Response.json(
        { error },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    return Response.json(
      {
        success: true,
        data,
      },
      {
        headers: corsHeaders,
      }
    );
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
      },
    );
  }
});

