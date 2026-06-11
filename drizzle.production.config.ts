import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.production', override: true })
config()

if (process.env.APP_ENV !== 'production') {
  throw new Error(
    `Refusing to push production schema because APP_ENV is "${process.env.APP_ENV ?? 'unset'}". Set APP_ENV=production in .env.production.`,
  )
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for production Drizzle Kit')
}

export default defineConfig({
  schema: './src/lib/drizzle/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
