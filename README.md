# AIWORK Bluehost source

The `bluehost` branch is the canonical validated Bluehost migration source. It is separate from the historical Cloudflare/Sites branches. No automatic deployment is active yet.

## Reproduce the static build

Use Node.js 24 and the unchanged lockfile:

```sh
npm ci
npm run build:static
node --test tests/*.test.mjs tests/cinematic-engine.test.cjs
npx tsc --noEmit
```

Always build in a clean checkout. Before rebuilding, move previous `out/` outside the repository and remove `.next/cache/webpack` so Tailwind cannot scan generated output. Keep the technical fixtures under `qa/`: historical Tailwind coverage and regression tests require them. Never serve `qa/`, tests, or scripts.

The historical `npm run build`, `npm test`, and Sites scripts target Vinext/Cloudflare and are not this Bluehost build pipeline. Dependency versions are preserved.

This source corresponds to the validated final70 migration candidate. Rebuilding changes generated build IDs and chunks, so a newly built artifact requires its own review and manifest verification before deployment. Publishing source does not deploy it. Server-side PHP, private configuration, credentials, customer records, generated output, and caches are intentionally excluded.
