import { env } from '#/lib/env'

type EmailRecipient = {
  email: string
  name?: string
}

type SendEmailInput = {
  to: EmailRecipient[]
  subject: string
  htmlContent: string
  textContent?: string
}

export async function sendBrevoEmail(input: SendEmailInput) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        email: env.MAIL_FROM,
        name: env.MAIL_FROM_NAME,
      },
      to: input.to,
      subject: input.subject,
      htmlContent: input.htmlContent,
      textContent: input.textContent,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Brevo email failed: ${response.status} ${message}`)
  }

  return response.json() as Promise<{ messageId?: string }>
}
