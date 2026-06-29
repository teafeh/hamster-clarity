export interface WaitlistRequest {
  email: string
  business_type: string
  timezone: string
  source: string
}

export function validateWaitlistRequest(
  body: unknown
): WaitlistRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body')
  }

  const {
    email,
    business_type,
    timezone,
    source,
  } = body as Record<string, unknown>

  if (
    typeof email !== 'string' ||
    email.trim().length === 0
  ) {
    throw new Error('Email is required')
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    throw new Error('Invalid email address')
  }

  if (
    typeof business_type !== 'string' ||
    business_type.trim().length === 0
  ) {
    throw new Error('Business type is required')
  }

  if (
    typeof timezone !== 'string' ||
    timezone.trim().length === 0
  ) {
    throw new Error('Timezone is required')
  }

  if (
    typeof source !== 'string' ||
    source.trim().length === 0
  ) {
    throw new Error('Source is required')
  }

  return {
    email: email.trim().toLowerCase(),
    business_type: business_type.trim(),
    timezone: timezone.trim(),
    source: source.trim(),
  }
}