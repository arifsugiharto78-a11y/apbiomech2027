# 14th APBiomech

Static, responsive conference website built with Astro, TypeScript, Tailwind CSS, and locally served Inter fonts. All public pages are generated as HTML. The participant form operates in DEMO mode without data collection. Separate Google Apps Script/private Google Sheets backend templates are prepared; no backend is deployed or tracking enabled.

## Current status

GitHub account: **arifsugiharto78-a11y**. Committee demonstration: [https://arifsugiharto78-a11y.github.io/apbiomech2027/](https://arifsugiharto78-a11y.github.io/apbiomech2027/). Source repository: [https://github.com/arifsugiharto78-a11y/apbiomech2027](https://github.com/arifsugiharto78-a11y/apbiomech2027). Check the [Actions deployment status](https://github.com/arifsugiharto78-a11y/apbiomech2027/actions) for the latest build. See [DEMONSTRATION_DEPLOYMENT.md](DEMONSTRATION_DEPLOYMENT.md) for account verification, authorized publication, updates, and committee sharing.

**Public committee demonstration; official launch pending.** The website displays the supplied APAB, ITB, and Masyarakat Biomekanika Indonesia logos. ITB alone identifies the host institution; the faculty name is written in full without its acronym. The active user-requested banner variant displays “14th APBiomech” and retains the ITB and APAB seals while removing the FTMD wordmark. Earlier banner assets are preserved; provenance and edit prompts are recorded in `public/images/branding/BANNER_UPDATE.md`. A WebP is generated at build time. The selected conference venue is Nusa Dua Beach Hotel & Spa – Handwritten Collection, Bali; venue details and an official hotel link are included.

The November 2026 content package now supplies the chair welcome and portrait, venue and Bali images, logos, proposed topics, draft author guidance and secretariat address. The owner selected 05-important-dates.md as the provisional timetable and the new USD international estimates (regular 500/600; student 300/350); Indonesian fees remain to be announced. See CONTENT_IMPORT_REVIEW.md for conflicts resolved and incomplete material withheld. Registration stays DEMO and all official launch approvals remain pending.

## Run locally

Participant form: `/registration/portal/`. Actual registration and abstract submission remain closed. See [REGISTRATION_SYSTEM.md](REGISTRATION_SYSTEM.md), [GOOGLE_APPS_SCRIPT_SETUP.md](GOOGLE_APPS_SCRIPT_SETUP.md), [REGISTRATION_DATABASE_SCHEMA.md](REGISTRATION_DATABASE_SCHEMA.md), and [PAYMENT_INTEGRATION_PLAN.md](PAYMENT_INTEGRATION_PLAN.md). The selected personal Google account must configure/deploy a private TEST backend before real Google connectivity/email checks; the connected university account is not used. LIVE collection requires separate committee approval. No payment provider is implemented. Tests include registration validation, duplicate/ID handling, escaping, limits and mail failure with emulated Google services; these do not verify a deployed Google account. Builds regenerate the shared Apps Script core and check mode configuration.

Install Node.js 24 LTS (including npm), then run these commands inside this directory:

```sh
npm ci
npm run dev
```

Open the printed local URL including `/apbiomech2027/`. The default development base path deliberately matches GitHub Pages. Stop the server with Ctrl+C.

```sh
npm run check
npm test
npm run build
npm run verify
npm run review:publication
npm run preview
```

`build` regenerates optimized banner metadata and WebP while preserving the PNG. `verify` checks every generated HTML page for local links, assets, base paths, headings, noindex, sitemap entries, and the custom 404. Tests cover countdown transitions, Bali time, safe portal URLs, both base paths, and publishable data requirements.

## Content and architecture

- `src/data/conference.json`: central conference facts, approved URLs, status, artwork, welcome message.
- `src/data/`: dates, registration, topics, profiles, programme, and sponsors. `planning.json` records estimate provenance and the 2025-to-2027 date adjustment method.
- `src/data/navigation.ts`: full navigation hierarchy.
- `src/data/pages.ts`: page introductions and information blocks.
- `src/pages/[...route].astro`: generates each conference page from the content and navigation.
- `src/content/announcements/*.md`: approved Markdown announcements.
- `src/components/`: reusable accessible layout and content components.
- `src/styles/global.css`: responsive design system and Tailwind import.
- `scripts/prepare-assets.mjs`: original-banner detection and optimization.
- `.github/workflows/deploy.yml`: type-check, test, static build, verify, upload, deploy.

See [WEBSITE_MAINTENANCE.md](WEBSITE_MAINTENANCE.md) for editable examples and [DOMAIN_MIGRATION.md](DOMAIN_MIGRATION.md) for future domain setup.

## GitHub Pages deployment — when authorized

1. Create or select the repository named `apbiomech2027`, with the committee-approved owner. This deliverable does not create an account or repository.
2. Commit the **contents of this directory** at the repository root, including `package-lock.json` and `.github/workflows/deploy.yml`. Do not commit `node_modules`, `dist`, or secrets.
3. In repository Settings → Pages, select **GitHub Actions** as the build source.
4. Push to `main`, or run the deployment workflow manually. This publishes the site, even while noindex remains enabled; only do so after authorization.
5. The workflow obtains the real `SITE_URL` from `github.repository_owner`; `BASE_PATH` defaults to `/apbiomech2027/`. The resulting preview URL is `https://OWNER.github.io/apbiomech2027/`.
6. If needed, set repository Actions variables `SITE_URL` and `BASE_PATH`. Neither is a secret. Set `githubPreviewUrl` in central configuration to the real preview URL once known.
7. Check the deployment URL, navigation, programme controls, keyboard menus, banner, downloads, 404, and phone layout.

Do not add a CNAME or configure the future domain during the preview phase. The local site origin is derived from `githubPreviewUrl` in conference configuration, currently `https://arifsugiharto78-a11y.github.io`. The Actions workflow derives the origin from the repository owner, unless `SITE_URL` is explicitly configured. `.env.example` documents variables. Set shell environment variables explicitly for local builds; do not rely on `.env` to configure `astro.config.mjs`.

Preview pages have `noindex, nofollow`, the committee-review notification, a development label, and `robots.txt` disallow. The configurable notification is `preview.message` and `preview.enabled` in `src/data/conference.json`; official-launch status also controls its removal. These discourage indexing and provide no access control. A public GitHub Pages preview remains public.

## Reference review

The requested [2025 conference reference](https://www.apbiomec2025.auckland.ac.nz/) and direct subpage fetches returned HTTP gateway errors during implementation. Search-indexed submission, registration, topic, award, sponsorship, accommodation, and destination pages were inspected for information architecture only. No previous-event people, imagery, or policy text were copied. On the user’s subsequent request, the indexed 2025 fees and milestones were used as explicitly provisional planning references. The source schedule contains conflicting early-bird dates; the estimate uses July 30 from the registration table/key-dates list rather than June 20 in the submission body. New Zealand GST is not applied to the Bali event.

Technical references: [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/), [Astro Tailwind integration](https://docs.astro.build/en/guides/styling/#tailwind), and [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Quality targets and limits

The implementation uses static HTML, self-hosted fonts, no framework hydration, responsive images, deferred non-hero images, semantic navigation, and reduced-motion support. Lighthouse scores above 90 are a target, not a reported measurement. Final visual/performance approval must be repeated with the supplied original banner and approved photography.

Original artwork, institutional marks, and supplied photography retain their respective rights. Confirm committee approval and licences before adding media. The neutral `27` favicon is a year marker, not an institutional logo.

## Conference and association names

Full conference title: **14th Asian-Pacific Conference on Biomechanics**. Short display name: **14th APBiomech**, without a hyphen or slash. **APAB** identifies the Asian-Pacific Association for Biomechanics. Its supplied introduction appears on the About APAB page, with a homepage summary and a linked original logo. The association website is https://www.jsme.or.jp/conference/apbiomech/index.html. Repository, base path, and planned domain are unchanged.
