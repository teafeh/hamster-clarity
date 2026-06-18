import { supabase } from '../lib/supabase.ts'
import type { Database } from '../types/database.types.ts'
import type { EmailTemplateType } from '../constants/emailTemplateTypes.ts'
import { EMAIL_TEMPLATE_TYPES,} from '../constants/emailTemplateTypes.ts'


export type EmailTemplate =
  Database['public']['Tables']['email_templates']['Row']

export type EmailTemplateUpdate =
  Database['public']['Tables']['email_templates']['Update'

]

export const emailTemplateService = {
  async getTemplatesByBusinessId(
  businessId: string
): Promise<EmailTemplate[]> {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at')

  console.log(
    '[EMAIL TEMPLATE] businessId:',
    businessId
  )

  console.log(
    '[EMAIL TEMPLATE] data:',
    data
  )

  console.log(
    '[EMAIL TEMPLATE] error:',
    error
  )

  if (error) throw error

  return data ?? []
},
  
  
    
    async getTemplate(
  businessId: string,
  templateType: EmailTemplateType
): Promise<EmailTemplate | null> {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('business_id', businessId)
    .eq('template_type', templateType)
    .maybeSingle()

  if (error) throw error

  return data
  },
    
    
    async createDefaultTemplates(
  businessId: string
): Promise<void> {
  const existing =
    await this.getTemplatesByBusinessId(
      businessId
    )

  const existingTypes =
    new Set(
      existing.map(
        template => template.template_type
      )
    )
      

  const templates = [
    {
      type: EMAIL_TEMPLATE_TYPES.BOOKING_CONFIRMATION,
      subject: 'Your appointment is confirmed 🎉',
      body: `
Hi {{customer_name}},

Your appointment with {{business_name}} has been confirmed.

Service:
{{service_name}}

Date:
{{appointment_date}}

Time:
{{appointment_time}}

We look forward to seeing you.

Thanks,

{{sender_name}}
      `.trim(),
    },

    {
      type: EMAIL_TEMPLATE_TYPES.WELCOME_CUSTOMER,
      subject: 'Welcome to {{business_name}}',
      body: `
Hi {{customer_name}},

Thank you for choosing {{business_name}}.

We look forward to serving you.

Best,

{{sender_name}}
      `.trim(),
    },

    {
      type: EMAIL_TEMPLATE_TYPES.APPOINTMENT_REMINDER,
      subject: 'Appointment Reminder ⏰',
      body: `
Hi {{customer_name}},

This is a reminder for your upcoming appointment.

Service:
{{service_name}}

Date:
{{appointment_date}}

Time:
{{appointment_time}}

See you soon!

{{sender_name}}
      `.trim(),
    },

    {
      type: EMAIL_TEMPLATE_TYPES.FOLLOW_UP,
      subject: 'How was your visit?',
      body: `
Hi {{customer_name}},

Thank you for visiting {{business_name}}.

We'd love your feedback.

{{sender_name}}
      `.trim(),
    },

    {
      type: EMAIL_TEMPLATE_TYPES.WIN_BACK,
      subject: 'We miss you ❤️',
      body: `
Hi {{customer_name}},

It's been a while since your last visit.

We'd love to welcome you back.

{{sender_name}}
      `.trim(),
    },
  ]

  const missingTemplates =
    templates.filter(
      template =>
        !existingTypes.has(template.type)
    )

  if (missingTemplates.length === 0) {
    return
  }

  const { error } = await supabase
    .from('email_templates')
    .insert(
      missingTemplates.map(template => ({
        business_id: businessId,
        template_type: template.type,
        subject: template.subject,
        body: template.body,
      }))
    )

  if (error) throw error
},
    
    

  async updateTemplate(
    id: string,
    updates: EmailTemplateUpdate
  ): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  },
}