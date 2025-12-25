# marriednext.com

Create and deploy your wedding website in minutes. Manage your guest list and collect reservations. Invite your spouse, wedding planner, or long lost uncle to help manage the website. All for free.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [Neon](https://neon.tech/) (PostgreSQL)
- **ORM:** [Drizzle](https://orm.drizzle.team/)
- **Auth:** [Clerk](https://clerk.com/)
- **Cache:** [Upstash Redis](https://upstash.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI:** [shadcn/ui](https://ui.shadcn.com/) + [Radix](https://www.radix-ui.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Hosting:** [Vercel](https://vercel.com/)
- **DNS:** [Porkbun](https://porkbun.com/)
- **Monitoring:** [Sentry](https://sentry.io/)
- **Monorepo:** [Turborepo](https://turborepo.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## Project Structure

```
marriednext.com/
├── apps/
│   └── webapp/              # Next.js application
├── packages/
│   ├── component-shelf/     # Shared React components & Storybook
│   ├── style-shelf/         # Global CSS & Tailwind configuration
│   ├── orm-shelf/           # Drizzle schema, migrations & types
│   └── label-shelf/         # i18n labels & theme text
└── docs/                    # Internal documentation
```

### Packages

| Package           | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `component-shelf` | Shared React components, theme templates, and Storybook       |
| `style-shelf`     | Global Tailwind CSS configuration and shared styles           |
| `orm-shelf`       | Drizzle ORM schema, database migrations, and type definitions |
| `label-shelf`     | Internationalization labels and theme-specific text content   |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+
- Turbo CLI (installed globally)

```bash
pnpm add turbo --global
```

### Setup

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd marriednext.com
pnpm install
```

2. Copy the example environment file:

```bash
pnpm run fork:env
```

3. Configure your environment variables in `apps/webapp/.env.local` (see [Environment Variables](#environment-variables))

4. Start the development server:

```bash
pnpm run dev
```

The webapp runs at [http://localhost:3000](http://localhost:3000)

### Running Specific Apps

```bash
# Webapp only
pnpm turbo dev --filter=webapp

# Storybook only
pnpm turbo dev --filter=component-shelf
```

## Environment Variables

Copy `example.env` to `apps/webapp/.env.local` and configure:

| Variable                            | Service | Description                  |
| ----------------------------------- | ------- | ---------------------------- |
| `DATABASE_URL`                      | Neon    | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk   | Public auth key              |
| `CLERK_SECRET_KEY`                  | Clerk   | Server-side auth key         |
| `CLERK_FRONTEND_API_URL`            | Clerk   | Frontend API endpoint        |
| `VERCEL_BEARER_TOKEN`               | Vercel  | API authentication           |
| `VERCEL_PROJECT_ID`                 | Vercel  | Project identifier           |
| `VERCEL_TEAM_ID`                    | Vercel  | Team identifier              |
| `BLOB_READ_WRITE_TOKEN`             | Vercel  | Blob storage access          |
| `PORKBUN_API_KEY`                   | Porkbun | DNS management key           |
| `PORKBUN_SECRET_KEY`                | Porkbun | DNS management secret        |
| `UPSTASH_REDIS_REST_URL`            | Upstash | Redis endpoint               |
| `UPSTASH_REDIS_REST_TOKEN`          | Upstash | Redis auth token             |

## Setting up Clerk

### Enable Name Capture

1. Go to the **Configure** tab in Clerk Dashboard
2. Select **User & authentication** → **User model**
3. Enable the **First and last name** switch

### Configure JWT Template

1. Go to **Configure** → **Sessions** → **Customize session token**
2. Add this template:

```json
{
  "metadata": {
    "onboardingComplete": "{{user.public_metadata.onboardingComplete}}",
    "weddingId": "{{user.public_metadata.weddingId}}",
    "role": "{{user.public_metadata.role}}"
  }
}
```

### Configure Domain Paths

1. Go to **Configure** → **Developers** → **Paths**
2. Set **Application Paths**:
   - **Home Url:** `marriednext.com/engaged`
3. Set **Component Paths**:
   - **Sign In:** `marriednext.com/sign-in` (on application domain)
   - **Sign Up:** `marriednext.com/register` (on application domain)
   - **Signed Out:** `marriednext.com/sign-in` (path on application domain)

![Clerk Domain Paths](https://4ctc36zdopsyz0ok.public.blob.vercel-storage.com/photos/marketing/ClerkDomainPaths.png)

## Documentation

Once the webapp is running locally, visit [http://localhost:3000/documentation](http://localhost:3000/documentation) for detailed technical documentation.

Additional internal docs:

- [`docs/onboarding.md`](docs/onboarding.md) - Onboarding flow & testing guide
- [`docs/github/branching.md`](docs/github/branching.md) - Git workflow

## Cron Jobs

Health checks run on all 3rd party services for telemetry. Errors are reported to Sentry.

## Troubleshooting

### Reset the Project

Clear all auto-generated assets:

```bash
pnpm run clean
pnpm install
```

### Clerk `form_param_unknown` Errors

Enable the **First and last name** switch in Clerk Dashboard. See [Setting up Clerk](#setting-up-clerk).

### Stuck on `/onboarding` Screen

Configure the JWT Template in Clerk. See [Configure JWT Template](#configure-jwt-template).

### Resetting a Test User

After submitting the onboarding form, records are created in multiple services. To fully reset:

1. Delete the user in Clerk Dashboard
2. Delete the Wedding record from Neon
3. Remove the subdomain from Vercel → Project → Domains
4. Delete the CNAME records from Porkbun
