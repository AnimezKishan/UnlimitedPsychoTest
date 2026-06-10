import { config } from 'dotenv'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'

config({ path: '.env.production' })
config()

async function main() {
  const password = process.argv[2] ?? process.env.SUPER_ADMIN_PASSWORD

  if (!password || password.length < 8) {
    throw new Error(
      'Production seed requires a password argument or SUPER_ADMIN_PASSWORD with at least 8 characters.',
    )
  }

  const { db } = await import('../src/lib/drizzle/client')
  const { accounts, users } = await import('../src/lib/drizzle/schema')
  const { env } = await import('../src/lib/env')

  if (env.APP_ENV !== 'production') {
    throw new Error(
      `Refusing to seed production super admin because APP_ENV is "${env.APP_ENV}". Set APP_ENV=production in .env.production.`,
    )
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, env.SUPER_ADMIN_EMAIL.toLowerCase()),
  })

  const passwordHash = await bcrypt.hash(password, 12)

  const [superAdmin] = existingUser
    ? await db
        .update(users)
        .set({
          name: env.SUPER_ADMIN_NAME,
          role: 'super_admin',
          isActive: true,
          emailVerified: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning()
    : await db
        .insert(users)
        .values({
          name: env.SUPER_ADMIN_NAME,
          email: env.SUPER_ADMIN_EMAIL.toLowerCase(),
          role: 'super_admin',
          isActive: true,
          emailVerified: true,
        })
        .returning()

  await db
    .insert(accounts)
    .values({
      id: nanoid(),
      userId: superAdmin.id,
      accountId: superAdmin.id,
      providerId: 'credential',
      password: passwordHash,
    })
    .onConflictDoUpdate({
      target: [accounts.providerId, accounts.accountId],
      set: {
        password: passwordHash,
        updatedAt: new Date(),
      },
    })

  console.log(`Production super admin ready: ${superAdmin.email}`)
  console.log(`Login: ${env.AUTH_LOGIN_URL}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
