# UnlimitedPsychoTest

UnlimitedPsychoTest is a Phase 1 MVP for an invitation-first psychometric test platform. It is built with TanStack Start and includes a branded app shell, Better Auth authentication, Super Admin user management, and the first playable mock test: Odd Number Counting.

## Features

- Invitation-only authentication with Better Auth
- Super Admin user management
- Email invitation flow through Brevo
- Role-aware dashboard and admin navigation
- Odd Number Counting section preview, timer selection, attempt flow, autosave, scoring, and results
- Basic student attempt history
- Drizzle ORM schema for users, auth tables, invitations, audit events, sections, attempts, and answers

## Tech Stack

- [TanStack Start](https://tanstack.com/start) + React 19
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Better Auth](https://www.better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + Neon PostgreSQL
- [Tailwind CSS v4](https://tailwindcss.com/)
- Radix UI primitives with shadcn-style local components
- [Brevo](https://www.brevo.com/) transactional email
- Zod, Vitest, TypeScript

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.development
```

Fill in the required values in `.env.development`, especially:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `BREVO_API_KEY`
- `MAIL_FROM`
- `SUPER_ADMIN_EMAIL`
- `SUPER_ADMIN_NAME`

Apply the database schema:

```bash
npm run db:push
```

Seed the Super Admin account:

```bash
npm run seed:super-admin
```

Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Scripts

```bash
npm run dev                # Start local development server
npm run generate-routes    # Regenerate TanStack Router route tree
npm run build              # Build for production
npm run preview            # Preview production build
npm run typecheck          # Run TypeScript checks
npm test                   # Run Vitest tests
npm run db:generate        # Generate Drizzle migrations
npm run db:push            # Push schema to the database
npm run db:studio          # Open Drizzle Studio
npm run seed:super-admin   # Create/update the Super Admin account
npm run seed:super-admin:prod -- <password> # Create/update Super Admin in production
```

## Project Structure

```txt
src/
├── app/                 # App-level providers
├── routes/              # TanStack Router route files
├── views/               # Page UI and feature containers
├── server/
│   ├── functions/       # TanStack server functions / controller layer
│   ├── services/        # Business rules and orchestration
│   └── repositories/    # Drizzle database access
├── queries/             # TanStack Query hooks and keys
├── components/          # Shared UI and layout components
├── hooks/               # Reusable React hooks
├── types/               # Shared TypeScript types
├── schemas/             # Zod schemas
├── lib/                 # Auth, env, utilities, Drizzle infrastructure
├── integrations/        # External service integrations
├── configs/             # App and feature configuration
├── data/                # Static domain data
└── utils/               # Domain utilities
```

Server code follows this direction:

```txt
routes/views -> queries -> server/functions -> server/services -> server/repositories -> lib/drizzle
```

Routes should stay thin. Page UI belongs in `src/views`, server business logic belongs in `src/server/services`, and Drizzle queries belong in `src/server/repositories`.

## Authentication Flow

Phase 1 uses invitation-first authentication:

1. A Super Admin logs in.
2. The Super Admin invites a user by name, email, and role.
3. The app creates a pending user and a single-use invitation token.
4. Brevo sends the setup-password link.
5. The invited user creates a password and verifies the account.
6. The user signs in and can access student test flows.

Public self-registration is intentionally not part of Phase 1.

## Test Module

The first section is Odd Number Counting:

- 30 questions per attempt
- Each question has 25 to 30 digits
- Digits range from 1 to 9
- The answer is the count of odd digits (`1`, `3`, `5`, `7`, `9`)
- Timer options range from 5 to 10 minutes
- Attempts support autosave, manual submit, auto-submit, scoring, results, and history

## Environment Variables

Use `.env.example` as the source of truth for required environment variables. Do not commit `.env`, `.env.development`, production secrets, database URLs, Better Auth secrets, or Brevo API keys.

## Validation

Before opening a pull request or deploying, run:

```bash
npm run typecheck
npm test
npm run build
```

## Deployment Notes

The project is designed for deployment on platforms that can run TanStack Start with a PostgreSQL database. Configure the production environment with:

- Neon PostgreSQL `DATABASE_URL`
- Better Auth secret and base URL
- Brevo transactional email credentials
- App URL and auth redirect paths

After deploying, run the database schema command for the target environment and seed the Super Admin account through a trusted server-side environment.

For production seeding, ensure `.env.production` points to the production database and has `APP_ENV=production`, then run:

```bash
npm run seed:super-admin:prod -- <strong-password>
```
