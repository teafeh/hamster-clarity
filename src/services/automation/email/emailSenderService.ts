export type EmailPayload = {
    to: string
    subject: string
    html: string
    replyTo?: string
}

class EmailSenderService {
    async sendEmail(payload: EmailPayload) {
    try {
        const response = await fetch(
            'https://kfmmljsnwiftuuoxfmsg.supabase.co/functions/v1/send-email',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: payload.to,
                    subject: payload.subject,
                    html: payload.html,
                }),
            }
        )

        const data = await response.json()

        console.log('EMAIL RESPONSE', data)

        return data
    } catch (error) {
        console.error(error)

        return {
            success: false,
        }
    }
}

    async sendWelcomeCustomerEmail(
        email: string,
        subject: string,
        html: string
    ) {
        return this.sendEmail({
            to: email,
            subject,
            html,
        })
    }

    async sendAppointmentReminderEmail(
        email: string,
        subject: string,
        html: string
    ) {
        return this.sendEmail({
            to: email,
            subject,
            html,
        })
    }

    async sendFollowUpEmail(
        email: string,
        subject: string,
        html: string
    ) {
        return this.sendEmail({
            to: email,
            subject,
            html,
        })
    }

    async sendWinBackEmail(
        email: string,
        subject: string,
        html: string
    ) {
        return this.sendEmail({
            to: email,
            subject,
            html,
        })
    }
}

export const emailSenderService =
    new EmailSenderService()