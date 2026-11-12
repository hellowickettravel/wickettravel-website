# Wicket Travel — website

Public marketing site for [wickettravel.com](https://www.wickettravel.com).
Next.js 16 (App Router), React 19, Tailwind 4. Hosted on **Netlify**.

> Next 16 has breaking changes. Read `node_modules/next/dist/docs/` before
> writing framework code (see `AGENTS.md`).

## Local development

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # production build: run this before pushing
npm run lint
```

Node 22 (see `.nvmrc`). Copy `.env.example` to `.env.local` if you need to
override anything; the site runs with no env vars at all.

## Deploying (Netlify)

Every setting lives in `netlify.toml`, so importing the repo is enough:

1. Netlify → **Add new project → Import an existing project → GitHub** →
   pick `hellowickettravel/wickettravel-website`, branch `main`.
2. Leave build settings as detected: build command `npm run build`, publish
   directory `.next`. Netlify's Next.js runtime (`@netlify/plugin-nextjs`)
   handles API routes, server rendering and `next/image`.
3. Add environment variables (below), then **Deploy**.
4. **Domain management** → add `www.wickettravel.com` as the primary domain
   (Netlify redirects the apex `wickettravel.com` to it) and update DNS as
   Netlify instructs. HTTPS is issued automatically.

Pushes to `main` deploy production; pull requests get deploy previews.

### Environment variables

Set in Netlify → **Site configuration → Environment variables**. All are
optional; the meaning of each is documented in `.env.example`.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Emails contact/quote/newsletter forms to the team. Unset: forms fall back to WhatsApp / email links. |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Form email recipient / sender (sender domain must be verified in Resend). |
| `PORTAL_ORIGIN` | Portal origin for the server relays. Default `https://portal.wickettravel.com`. |
| `WICKET_RELAY_SECRET` | Shared secret with the portal (see `.env.example`). |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID (loads only after cookie consent). |
| `NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID` | Trustpilot TrustBox. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Search console verification tokens. |

`NEXT_PUBLIC_*` values are baked in at build time: after changing one,
trigger a new deploy (**Deploys → Trigger deploy → Clear cache and deploy**).
