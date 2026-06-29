import { corsHeaders } from "./cors.ts";

export function ok(data: unknown) {
  return Response.json(data, {
    headers: corsHeaders,
  });
}

export function badRequest(error: string) {
  return Response.json(
    {
      success: false,
      error,
    },
    {
      status: 400,
      headers: corsHeaders,
    },
  );
}

export function serverError(error: unknown) {
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