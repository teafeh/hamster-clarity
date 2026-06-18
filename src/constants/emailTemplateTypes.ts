export const EMAIL_TEMPLATE_TYPES = {
  BOOKING_CONFIRMATION: 'booking_confirmation',

  WELCOME_CUSTOMER: 'welcome_customer',

  APPOINTMENT_REMINDER: 'appointment_reminder',

  FOLLOW_UP: 'follow_up',

  WIN_BACK: 'win_back',
} as const

export type EmailTemplateType =
  typeof EMAIL_TEMPLATE_TYPES[keyof typeof EMAIL_TEMPLATE_TYPES]