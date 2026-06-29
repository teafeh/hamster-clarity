import { betaService } from "./services/betaService.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateBetaRequest,
} from "./validation/requestSchema.ts";

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Beta Join request received",
    );

    const body = await req.json();

    const { token } =
      validateBetaRequest(body);

    console.log("[EDGE]", {
      token,
    });

    const result =
      await betaService.join(token);

    console.log(
      "[STEP 2]",
      result.alreadyJoined
        ? `Already joined: ${result.user.email}`
        : `Joined beta: ${result.user.email}`,
    );

    return ok({
      success: true,
      alreadyJoined: result.alreadyJoined,
      message: result.alreadyJoined
        ? "You're already a beta tester."
        : "Successfully joined beta program.",
    });
  } catch (error) {
    console.error(
      "[BETA]",
      error,
    );

    return serverError(error);
  }
});