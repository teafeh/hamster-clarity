import { useEffect, useState } from 'react'
import { useBusiness } from './useBusiness'

import {
  emailTemplateService,
  type EmailTemplate,
} from '@/services/emailTemplateService'

export function useEmailTemplates() {
  const { business } = useBusiness()

  const [templates, setTemplates] =
    useState<EmailTemplate[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const loadTemplates = async () => {
    if (!business?.id) {
      setTemplates([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      await emailTemplateService.ensureDefaultTemplates(
  business.id
);

const data =
  await emailTemplateService.getTemplatesByBusinessId(
    business.id
  );
        

      setTemplates(data)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load templates'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [business?.id])

  const updateTemplate = async (
    id: string,
    subject: string,
    body: string
  ) => {
    await emailTemplateService.updateTemplate(
      id,
      {
        subject,
        body,
      }
    )

    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id
          ? {
              ...template,
              subject,
              body,
            }
          : template
      )
    )
  }

  return {
    templates,
    loading,
    error,
    updateTemplate,
    reload: loadTemplates,
  }
}