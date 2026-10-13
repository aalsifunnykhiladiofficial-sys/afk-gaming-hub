# AFK Gaming Hub — starter kit

This is a starter project for https://www.youtube.com/@AalsiFunnyKhiladi.

## What is included
- Responsive dark gaming homepage
- Download catalogue UI with Free / Premium labels
- Admin upload form UI
- Cloudflare Worker API scaffold
- Cloudflare D1 schema
- Deployment checklist

## Important: starter, not production-ready yet
The frontend is a prototype and the Worker contains explicit TODOs for OAuth, subscription verification, file storage, admin authentication, and payment-provider integration. Do not upload private files or publish this as a secure download gate until those TODOs are implemented and tested. A plain frontend check or a hidden URL is not security.

Also, once someone downloads a file to their own device, the website cannot remotely disable that local copy. Revocation can only block future downloads or online access controlled by your service.

## Recommended free-first stack
- Cloudflare Pages: frontend hosting
- Cloudflare Workers: server-side API
- Cloudflare D1: metadata, user sessions, download grants
- Cloudflare R2: private file storage (check current account/free-tier limits)
- Google Cloud / YouTube Data API: OAuth and subscriber check
- Optional payment provider later: premium purchases
- Optional ad network later: only after approval and policy review

Free plans have quotas and may change. Review current pricing and limits before launch.

## Local preview
Open `public/index.html` directly in a browser to preview the static UI. API calls will show a demo/connection message until the Worker is deployed and configured.

## Deploy the frontend
1. Create a GitHub repository named `afk-gaming-hub` and upload the contents of this folder.
2. In Cloudflare Dashboard, open Workers & Pages → Create → Pages → Connect to Git.
3. Select the repository.
4. Framework preset: None. Build command: leave blank. Build output directory: `public`.
5. Deploy. You will receive a `*.pages.dev` URL.

## Deploy the API (after implementing TODOs)
1. Install Node.js and Wrangler: `npm install -g wrangler`
2. From the `worker` folder, run `wrangler login`.
3. Copy `wrangler.toml.example` to `wrangler.toml`.
4. Create D1 database and R2 bucket, then fill in the IDs/bindings.
5. Apply schema: `wrangler d1 execute afk-gaming-hub-db --file=./schema.sql`
6. Add secrets using `wrangler secret put ...` (never put secrets in frontend files or Git).
7. Deploy with `wrangler deploy`.
8. Set `API_BASE` in `public/app.js` to the deployed Worker URL and redeploy Pages.

## YouTube subscription verification (required before secure launch)
1. Open Google Cloud Console and create a project.
2. Enable YouTube Data API v3.
3. Configure OAuth consent screen and authorized redirect URL for the Worker callback.
4. Create an OAuth Web Client. Keep the client secret only in Worker secrets.
5. The server must complete OAuth, validate state, use the signed-in user's access token to call `subscriptions.list` with `mine=true`, and compare each returned `snippet.resourceId.channelId` against the channel ID for `@AalsiFunnyKhiladi`.
6. If the API cannot confirm the subscription (private subscription list, missing consent, quota/error), fail closed and do not issue a download grant.
7. Re-check before each new protected download or use short-lived grants. Do not trust a client-supplied `isSubscribed` boolean.
8. Determine your channel's canonical channel ID in YouTube Studio / channel settings; the handle alone is not the ID.

## Admin uploads
Before launch, implement server-side admin authentication (Google allowlist or a strong admin identity), validate file type/size, upload into a private R2 bucket, and store metadata in D1. Never expose R2 objects publicly. Use short-lived, server-issued download URLs or proxy downloads through the Worker after subscription checks.

## Monetization
- Ads: add ad scripts only after approval from the ad network. Do not click your own ads or encourage invalid traffic.
- Premium: integrate a payment provider and verify payment webhooks server-side before granting premium access. Do not trust a success page alone.
- Keep free subscriber-gated content separate from paid content so visitors understand what they are getting.

## Launch checklist
- [ ] Implement and test Google OAuth + server-side subscription checks
- [ ] Implement admin authentication
- [ ] Configure private R2 storage and D1
- [ ] Add rate limiting and upload size/type restrictions
- [ ] Implement expiring sessions and download grants
- [ ] Add privacy policy, terms, contact page, copyright takedown process
- [ ] Test sign-out, unsubscribe, private subscriptions, API failures, and direct URL access
- [ ] Review current platform terms and free-tier quotas


## Owner-only earnings dashboard (new)
- Open `public/owner.html` for the dashboard UI.
- Set `API_BASE` in `public/owner.js` to the deployed Worker URL.
- The Google OAuth routes are intentionally disabled until configured.
- Configure a single owner email as a Worker secret/variable (`OWNER_EMAIL`) and enforce it server-side on every private endpoint.
- Implement OAuth state + PKCE, validate Google ID token issuer/audience/expiry, store hashed server-side sessions, and set Secure/HttpOnly/SameSite cookies.
- AdSense reporting requires the proper Google API setup, account authorization, and API access. Affiliate providers may not offer a usable reporting API; CSV import can be the first safe version. Premium sales should come from verified payment-provider webhooks.
- Never put Google client secrets, payment keys, affiliate API keys, or OAuth refresh tokens in `public/` files or a Git repository.
