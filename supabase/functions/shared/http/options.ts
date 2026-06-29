import { corsHeaders } from "./cors.ts";

export function handleOptions(
  req: Request,
): Response | null {
  if (req.method !== "OPTIONS") {
    return null;
  }

  return new Response("ok", {
    headers: corsHeaders,
  });
}