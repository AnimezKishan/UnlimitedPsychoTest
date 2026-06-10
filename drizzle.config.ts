import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.development' })
config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for Drizzle Kit')
}

export default defineConfig({
  schema: './src/lib/drizzle/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
