import bcrypt from 'bcryptjs'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '#/lib/drizzle/client'
import * as schema from '#/lib/drizzle/schema'
import { env } from '#/lib/env'

export const auth = betterAuth({
  appName: env.APP_NAME,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    password: {
      hash: (password) => bcrypt.hash(password, 12),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        input: false,
        defaultValue: 'student',
      },
      isActive: {
        type: 'boolean',
        required: true,
        input: false,
        defaultValue: true,
      },
    },
  },
  session: {
    expiresIn: env.SESSION_MAX_AGE,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    cookiePrefix: env.SESSION_COOKIE_NAME,
  },
  plugins: [tanstackStartCookies()],
})

export type Auth = typeof auth
