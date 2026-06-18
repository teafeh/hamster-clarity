import type { Customer } from '../../customerService'

export const winBackWorkflow = {
  async execute(
    customer: Customer
  ) {
    console.log(
      '[Workflow] Win Back',
      customer.id
    )

    // future scheduler
  },
}