import { emailTemplateService } from '../emailTemplateService'

export async function initializeEmailTemplates(
  businessId: string
) {
  await emailTemplateService.createDefaultTemplates(
    businessId
  )
}