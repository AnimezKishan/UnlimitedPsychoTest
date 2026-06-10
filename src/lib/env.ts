import { z } from 'zod'

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true')

const envSchema = z.object({
  APP_NAME: z.string().min(1),
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  BREVO_API_KEY: z.string().min(1),
  MAIL_FROM: z.string().email(),
  MAIL_FROM_NAME: z.string().min(1),
  AUTH_LOGIN_URL: z.string().min(1),
  AUTH_SETUP_PASSWORD_URL: z.string().min(1),
  AUTH_RESET_PASSWORD_URL: z.string().min(1),
  SESSION_COOKIE_NAME: z.string().min(1),
  SESSION_MAX_AGE: z.coerce.number().int().positive(),
  ENABLE_FULL_PAPER: booleanString,
  ENABLE_AI: booleanString,
  ENABLE_ANALYTICS: booleanString,
  ENABLE_PAYMENTS: booleanString,
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_NAME: z.string().min(1),
  STORAGE_PROVIDER: z.enum(['local', 's3']),
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>
