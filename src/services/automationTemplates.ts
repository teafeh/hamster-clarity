import { AutomationEvent } from './automationEvents'

export type AutomationTemplateDefinition = {
  event: AutomationEvent
  subject: string
  body: string
}

export const DEFAULT_AUTOMATION_TEMPLATES: AutomationTemplateDefinition[] = [
  {
    event: AutomationEvent.BOOKING_CREATED,

    subject:
      '🎉 Your appointment is confirmed',

    body: `
Hi {{customer_name}},

Your booking has been confirmed.

━━━━━━━━━━━━━━

Business

{{business_name}}

Service

{{service_name}}

Date

{{appointment_date}}

Time

{{appointment_time}}

━━━━━━━━━━━━━━

If you have any questions, simply reply to this email.

We look forward to seeing you.

Best,

{{sender_name}}
`.trim(),
  },

  {
    event: AutomationEvent.APPOINTMENT_REMINDER,

    subject:
      'Reminder: Your appointment is tomorrow',

    body: `
Hi {{customer_name}},

Just a reminder about your appointment tomorrow.

We look forward to seeing you.

{{sender_name}}
`.trim(),
  },

  {
    event: AutomationEvent.APPOINTMENT_COMPLETED,

    subject:
      'How was your visit?',

    body: `
Hi {{customer_name}},

Thank you for visiting us.

We would love to hear your feedback.

{{sender_name}}
`.trim(),
  },

  {
    event: AutomationEvent.CUSTOMER_INACTIVE,

    subject:
      'We miss you ❤️',

    body: `
Hi {{customer_name}},

It has been a while since your last visit.

We'd love to see you again.

{{sender_name}}
`.trim(),
  },
]