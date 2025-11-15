## marriednext.com

Create and deploy your wedding website in minutes. Manage your guest list and collect reservations. Invite your spouse, wedding planner or long lost uncle to help manage the website. All for free!

**Whats in this repo?**

This repository contains the full source code for marriednext.com, as well as the tenants of marriednext.com.

## Tests

```bash
pnpm run test # vitest test suites
pnpm run test-storybook # storybook interaction & a11y tests
```

## Development

To run the application locally, you'll need the environment variables below properly configured. After that it's a simple matter of running the dev server via pnpm.

```bash
# run dev server
pnpm run dev
```

Once the app is running locally, there's alot of technical documentation in the /documentation route. e.g. http://localhost:3000/documentation or https://marriednext.com/documentation (sorry its not in markdown, there isn't really a need for these to be living documents so i just had AI convert them into markup that looks nice instead of going through the hassle of configuring a markdown parser)

### Running Storybook Locally

if you are looking to run Storybook (/stories) then you'll want to run the storybook command. This will launch a separate server with the interactive Storybook UI.

```bash
# run storybook
pnpm run storybook
```

Enviroment variable required for a good time (no errors)

- DATABASE_URL (I use postgres)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (Clerk Auth)
- CLERK_SECRET_KEY
- NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
- NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/
- VERCEL_BEARER_TOKEN (Vercel for Custom Domains)
- VERCEL_PROJECT_ID
- VERCEL_TEAM_ID
- BLOB_READ_WRITE_TOKEN (Vercel Blog Storage)
- UPSTASH_REDIS_REST_URL (Used as a cache layer for the tenant app)
- UPSTASH_REDIS_REST_TOKEN
