import { useEffect, useState } from 'react'
import { useBusiness } from '@/hooks/useBusiness'
import {
  automationService,
  type AutomationSettings,
} from '@/services/automationService'


export type AutomationBooleanKey =
  | 'flow_assistant_enabled'
  | 'welcome_customer_enabled'
  | 'appointment_reminder_enabled'
  | 'follow_up_enabled'
  | 'win_back_enabled'


  const WORKFLOW_KEYS: AutomationBooleanKey[] = [
  'welcome_customer_enabled',
  'appointment_reminder_enabled',
  'follow_up_enabled',
  'win_back_enabled',
]


export function useAutomationSettings() {
  const { business } = useBusiness()

  const [settings, setSettings] =
    useState<AutomationSettings | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const loadSettings = async () => {
    if (!business?.id) {
      setSettings(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      let data =
        await automationService.getSettingsByBusinessId(
          business.id
        )

      if (!data) {
        data =
          await automationService.createDefaultSettings(
            business.id
          )
      }

      setSettings(data)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load automation settings'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  setSettings(null)
  setLoading(true)

  loadSettings()
}, [business?.id])

    const updateSetting = async (
  key: AutomationBooleanKey,
  value: boolean
) => {
  if (!business?.id || !settings) return

  try {
    let updates: Record<string, boolean> = {
      [key]: value,
    }

    // Flow Assistant ON/OFF
    if (key === 'flow_assistant_enabled') {
      WORKFLOW_KEYS.forEach((workflowKey) => {
        updates[workflowKey] = value
      })
    }

    // Individual workflow ON/OFF
    if (WORKFLOW_KEYS.includes(key)) {
      const nextSettings = {
        ...settings,
        [key]: value,
      }

      const anyWorkflowEnabled =
        WORKFLOW_KEYS.some(
          (workflowKey) =>
            nextSettings[workflowKey]
        )

      updates.flow_assistant_enabled =
        anyWorkflowEnabled
    }

    await automationService.updateSettings(
      business.id,
      updates
    )

    setSettings((prev) =>
      prev
        ? {
            ...prev,
            ...updates,
          }
        : prev
    )
  } catch (err) {
    console.error(err)
  }
}

  return {
    settings,
    loading,
    error,
    updateSetting,
    reload: loadSettings,
  }
}