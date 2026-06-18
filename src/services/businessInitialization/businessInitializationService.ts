import { initializeAutomation } from './initializeAutomation'
import { initializeEmailSettings } from './initializeEmailSettings'
import { initializeEmailTemplates } from './initializeEmailTemplates'
import type { Business } from '../businessService'
import type { User } from '@supabase/supabase-js'

export const businessInitializationService = {
  async initializeBusiness({
    business,
    user,
  }: {
    business: Business
    user: User
  }) {
    await initializeAutomation(
      business.id
    )

    if (!user.email) {
  throw new Error(
    'Authenticated user has no email.'
  )
}

await initializeEmailSettings(
  business,
  user.email
)

    await initializeEmailTemplates(
      business.id
    )
  },
}