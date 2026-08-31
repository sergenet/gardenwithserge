# Production deployment manifest

Authoritative source: `C:\gardenwithserge-website\garden`

Passenger target: `/home/sergbcqk/garden`

## Deploy

- `server.js`
- `package.json`
- `package-lock.json`
- `admin-billing-requests.html`
- `admin-dashboard.html`
- `lib/**`
- `public/404.html`
- `public/ai-limitations.html`
- `public/app.js`
- `public/assets/**`
- `public/billing-support.html`
- `public/contact.html`
- `public/favicon.png`
- `public/index.html`
- `public/payment-cancel.html`
- `public/payment-success.html`
- `public/plant-doctor.html`
- `public/policies.css`
- `public/privacy.html`
- `public/refunds.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/styles.css`
- `public/terms.html`
- `public/translations.js`
- `public/vendor/lucide.min.js`
- the referenced public image and PDF assets used by the deployed pages

## Never deploy

- `.env*` other than `.env.example`
- `.git/**`, `node_modules/**`, `test/**`, `tmp/**`, `coverage/**`
- logs, database files, private keys, certificates, credentials, backups, and archives
- `public/inject_keys.js`
- duplicate or stale translations
- public deployment notes, repair summaries, nested package manifests, or patch scratch files
- any content from `gardenwithserge.com/public_STALE_COPY_DO_NOT_DEPLOY`

## Release procedure

1. Run `npm ci`, `npm run build`, `npm run check`, and `npm audit --omit=dev`.
2. Scan the staged manifest for credential patterns without printing values.
3. Build the release only from the allowlist above.
4. Preserve a server-side rollback archive.
5. Upload, install exact production dependencies, and restart Passenger.
6. Verify health/readiness, canonical routes, 404s, headers, CORS, policies, sitemap, and provider-specific commerce gates.
