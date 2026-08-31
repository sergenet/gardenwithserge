# Production operations

## Verification

Run `npm run check`, `npm audit --omit=dev`, and `npm run check:production` before and after a production release. Also retain the Lighthouse JSON reports for the homepage and Plant Doctor.

## Secret boundary

Production credentials belong only in cPanel environment variables or owner-only secret files with mode `0600`. Never put `.env`, `*.key`, logs, database exports, or credentials into a release archive. Release archives must contain an explicit file list.

## Rollback

1. Identify the last verified Git commit and create an explicit archive of only the application files changed by the failed release.
2. Upload the archive to `/home/sergbcqk/garden`, extract it with overwrite enabled, and trigger Passenger with `touch /home/sergbcqk/garden/tmp/restart.txt`.
3. Do not overwrite cPanel environment variables or the owner-only secret files during rollback.
4. Run `npm run check:production`, verify both health and readiness endpoints, and confirm the expected live content and security headers.
5. Keep commerce disabled unless a separate payment test plan passes with provider test-mode credentials and verified webhook lifecycle handling.

## PayPal activation gate

Keep `PAYPAL_ENABLED=false` until the live client credentials and webhook ID are installed, all four configured plans pass exact live API validation, the webhook endpoint is subscribed to the supported subscription lifecycle events, and existing PayPal subscriber status has been reconciled. Stripe can remain enabled independently. PayPal refunds remain manual unless a verified capture-to-member ledger is added.
