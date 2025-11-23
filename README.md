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

**Prerequisites**

We're using https://turborepo.com/, you should install turbo globally if you haven't already.

```bash
pnpm add turbo --global
```

To run the application locally, you'll need the environment variables below properly configured. After that it's a simple matter of running the dev server via pnpm.

```bash
# run all dev servers (Webapp, Storybook)
pnpm run dev
```

Alternatively you can filter out specific apps with the `--filter` flag

```bash
pnpm turbo dev --filter=webapp
```

Once the _webapp_ is running locally, there's alot of technical documentation in the /documentation route. e.g. http://localhost:3000/documentation or https://marriednext.com/documentation (sorry its not in markdown, there isn't really a need for these to be living documents so i just had AI convert them into markup that looks nice instead of going through the hassle of configuring a markdown parser)

### Running Storybook Locally

```bash
pnpm turbo dev --filter=component-shelf
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

## Troubleshooting

If you need a sanity check, run the following command to clear all auto-generated assets.

```shell
pnpm run clean
```

_Don't forget to reinstall the project dependencies before running the dev server or production build_

### Font issues

If you're running into errors related to the local fonts i.e.

```
Module not found: Can't resolve './fonts/EB_Garamond/static/EBGaramond-Bold.ttf'
```

its because you don't have the font assets in the style-shelf/dist directory. To resolve run

```shell
pnpm run build
```

then you should be good to restart the development server.

> Heads up: this error will fail silently in the Vite app, (component-shelf) you'll just see fall-back fonts.
