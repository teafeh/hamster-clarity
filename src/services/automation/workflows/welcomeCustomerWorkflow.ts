import type { Customer } from '../../customerService'

export const welcomeCustomerWorkflow = {
  async execute(
    customer: Customer
  ) {
    console.log(
      '[Workflow] Welcome',
      customer.id
    )

    // Premium feature later
  },
}