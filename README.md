Wedding Cake Studio

## Tests

```bash
pnpm run test # vitest test suites
pnpm run test-storybook # storybook interaction & a11y tests
```

## development

```bash
pnpm run dev
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
