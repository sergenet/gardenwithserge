# Production deployment manifest

Authoritative source: `C:\gardenwithserge-website\garden`

Passenger target: `/home/sergbcqk/garden`

## Deploy

- `server.js`
- `package.json`
- `package-lock.json`
- `admin-billing-requests.html`
- `admin-dashboard.html`
- `admin-newsletter.html`
- `lib/**`
- `public/404.html`
- `public/about.html`
- `public/ai-limitations.html`
- `public/ads.txt`
- `public/app.js`
- `public/assets/**`
- `public/billing-support.html`
- `public/contact.html`
- `public/consent.css`
- `public/consent.js`
- `public/container-gardening-for-beginners.html`
- `public/guide-translations.js`
- `public/crabapple-tree-problems.html`
- `public/crabapple-tree-problems-600x315.jpg`
- `public/crabapple-tree-problems-600x315.webp`
- `public/crabapple-tree-problems-1200x630.jpg`
- `public/crabapple-tree-problems-1200x630.webp`
- `public/favicon.png`
- `public/indoor-plants-guide.html`
- `public/index.html`
- `public/payment-cancel.html`
- `public/payment-success.html`
- `public/plant-doctor.html`
- `public/plant-disease-guide.html`
- `public/plant-troubleshooting.html`
- `public/policies.css`
- `public/privacy.html`
- `public/refunds.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/styles.css`
- `public/sunpatiens-care-guide.html`
- `public/sunpatiens-care-guide-600x315.jpg`
- `public/sunpatiens-care-guide-600x315.webp`
- `public/sunpatiens-care-guide-1200x630.jpg`
- `public/sunpatiens-care-guide-1200x630.webp`
- `public/terms.html`
- `public/tomato-blossom-end-rot-causes-and-fixes.html`
- `public/translations.js`
- `public/vendor/lucide.min.js`
- `public/why-are-my-plant-leaves-turning-yellow.html`
- `public/why-are-my-plant-leaves-turning-yellow-600x315.jpg`
- `public/why-are-my-plant-leaves-turning-yellow-600x315.webp`
- `public/why-are-my-plant-leaves-turning-yellow-1200x630.jpg`
- `public/why-are-my-plant-leaves-turning-yellow-1200x630.webp`
- `scripts/check-production.mjs`
- `scripts/create-secure-backup.sh`
- `scripts/verify-secure-backup.sh`
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
6. Verify health/readiness, canonical routes, 404s, headers, CORS, policies, sitemap, provider-specific commerce gates, and authenticated newsletter audit access.
