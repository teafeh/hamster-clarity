import { automationService } from '../../../supabase/functions/booking-created/services/automationService'

export async function initializeAutomation(
  businessId: string
) {
  const settings =
    await automationService.getSettingsByBusinessId(
      businessId
    )

  if (!settings) {
    await automationService.createDefaultSettings(
      businessId
    )
  }
}