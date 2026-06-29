import { customerCreatedWorkflow } from "./workflows/customerCreatedWorkflow.ts";

import { handleOptions } from "../shared/http/options.ts";

import {
  ok,
  serverError,
} from "../shared/http/responses.ts";

import {
  validateCustomerCreatedRequest,
} from "./validation/requestSchema.ts";

Deno.serve(async (req: Request) => {
  const options = handleOptions(req);

  if (options) {
    return options;
  }

  try {
    console.log(
      "[STEP 1] Customer Created request received",
    );

    const body = await req.json();

    const { customerId } =
      validateCustomerCreatedRequest(body);

    console.log("[EDGE]", {
      customerId,
    });

    const result =
      await customerCreatedWorkflow.run(
        customerId,
      );

    console.log(
      "[STEP 2] Workflow completed",
    );

    return ok(result);
  } catch (error) {
    console.error(
      "[CUSTOMER CREATED]",
      error,
    );

    return serverError(error);
  }
});