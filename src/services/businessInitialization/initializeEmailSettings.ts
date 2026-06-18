import type { Business } from '../businessService'
import { emailSettingsService } from '../emailSettingsService'

export async function initializeEmailSettings(
  business: Business,
  ownerEmail: string
) {
  const settings =
    await emailSettingsService.getSettingsByBusinessId(
      business.id
    )

  if (!settings) {
    await emailSettingsService.createDefaultSettings(
      business.id,
      business.name,
      ownerEmail
    )
  }
}