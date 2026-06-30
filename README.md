# Looper Next.js Todo E2E

Disposable target repository for exercising Looper end to end on a non-trivial Next.js todo application.

The app implementation, issue decomposition, PRs, and deployment are intentionally generated through Looper so the run can audit the factory workflow.

## Local Development

```sh
npm ci
npm run dev
```

Useful verification commands:

```sh
npm run lint
npm test
npm run build
```

To run the production build locally:

```sh
npm run preview
```

## Public Preview Deployment

Looper uses Vercel preview deployments for this app. The repository includes
`vercel.json` so Vercel uses the Next.js framework preset, installs from the
lockfile with `npm ci`, and builds with the same production command used
locally: `npm run build`.

Deployment path:

1. Import the repository into Vercel as a Next.js project, or connect it through
   the Vercel Git integration.
2. Leave environment variables empty. The app does not require authentication,
   a database, or secret configuration.
3. Keep Vercel Authentication and deployment protection disabled for this
   preview project so the generated URL is publicly accessible.
4. Leave the output directory unset so Vercel uses the Next.js build output.
5. Push a branch or open a pull request. Vercel will create a public preview URL
   for that branch or pull request.

Preview todos are stored only in the visitor's browser `localStorage`. Data is
not sent to a server and is not shared between users, browsers, or devices.
