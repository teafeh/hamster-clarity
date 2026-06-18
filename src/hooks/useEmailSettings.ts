import { useEffect, useState } from 'react'
import { useBusiness } from '@/hooks/useBusiness'
import {
  emailSettingsService,
  type EmailSettings,
} from '@/services/emailSettingsService'

export function useEmailSettings() {
  const { business } = useBusiness()

  const [settings, setSettings] =
    useState<EmailSettings | null>(null)

  const [loading, setLoading] =
    useState(true)

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
        await emailSettingsService.getSettingsByBusinessId(
          business.id
        )

      if (!data) {
  throw new Error(
    'Email settings were not initialized for this business.'
  )
}

      setSettings(data)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load email settings'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [business?.id])

  const updateSettings = async (
    updates: Partial<EmailSettings>
  ) => {
    if (!business?.id) return

    try {
      await emailSettingsService.updateSettings(
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
    updateSettings,
    reload: loadSettings,
  }
}