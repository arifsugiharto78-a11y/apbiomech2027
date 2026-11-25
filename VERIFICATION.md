# Verification and handoff

Reviewed November 24, 2026. Status: working development preview; no public deployment or external-account changes performed.

## Passed

- Astro/TypeScript diagnostics: **38 files, 0 errors, 0 warnings, 0 hints**.
- **8 automated tests**: Bali midnight countdown target; upcoming/live/ended boundaries; project/apex URL helpers; HTTPS-only external portal destinations; approved-profile and asset requirements; programme/date/fee data validity; 2025 lead-time preservation; separation of fee estimates and confirmed fees.
- Static production build: **41 HTML pages**, covering all primary and dropdown navigation destinations, announcement detail, legal-status pages, and custom 404.
- Build scan with `/apbiomech2027/`: internal navigation, document/image/CSS targets, CSS font URLs, anchors, one H1 per page, English language metadata, preview noindex, sitemap coverage, and custom 404.
- Production-equivalent build with `SITE_URL=https://apbiomech2027.org` and `BASE_PATH=/`: 41-page link/asset/metadata scan passed. This did not publish or configure the domain. Final local build restored the default GitHub preview configuration.
- Browser: desktop visual inspection at 1440px; tablet homepage layout at 768px with two-column quick access and no horizontal overflow; 390px programme layout with no horizontal overflow.
- Browser interactions: About dropdown ArrowDown focuses the first item; Escape closes it and restores toggle focus; mobile hamburger and Registration dropdown reach Registration Portal; Day 3 selects the November 18 preparation state; unavailable CMT, registration, and document actions remain disabled.
- No console errors or warnings were reported on the inspected homepage and abstract pages.

## Limits and remaining inputs

- The original banner and three supplied logo files are now installed. The PNG is preserved unchanged, with a build-generated WebP. Separate destination and venue photographs are not included; no unapproved stock photography was added.
- Nusa Dua Beach Hotel & Spa is the user-selected venue. Fee and deadline estimates are explicitly provisional, with source links and the adjustment method visible. Actual 2027 fees, billing currency, tax treatment, deadlines, meeting-room allocation, room rates, profiles, programme, contact, policies, documents, and portals remain pending approval.
- Updated desktop (1440px) and phone (390px) screenshots were inspected with the official artwork. All three header logos load; the mobile banner renders at 375 × 222 pixels with its full composition and a separate readable date/location line. The phone page has no horizontal overflow. Browser checks confirmed the reference fee amounts, a disabled registration button, the official venue link, and no console errors.
- Lighthouse was not run; no score is claimed. Repeat accessibility, performance, visual review, and production smoke checks after official assets and content arrive.
- Live CMT, external registration/payment, DNS, HTTPS provisioning, and GitHub Actions deployment require real committee-controlled destinations and an authorized deployment. They were not exercised against external services.
- Direct reference-site and subpage requests returned gateway errors. Search-indexed reference content was reviewed for structure only.

## Run and publish

Use Node.js 24 with npm. From the repository root, run `npm ci` then `npm run dev`. Visit the printed `/apbiomech2027/` URL. Run the checks documented in `README.md` before any update.

When authorized, put this directory's contents at the root of the `apbiomech2027` GitHub repository, enable Pages with GitHub Actions, and push to `main`. The included workflow checks, builds, uploads, and deploys. Keep the development/noindex status until official launch approval. Full instructions are in `README.md`, `WEBSITE_MAINTENANCE.md`, and `DOMAIN_MIGRATION.md`.

## November 24 update provenance

- Venue: [official hotel website](https://www.nusaduahotel.com/), selected by the user.
- Fee benchmark and most deadlines: [2025 registration page](https://www.apbiomec2025.auckland.ac.nz/registration/), using the search-indexed content because direct fetches returned gateway errors.
- Acceptance notification and author registration: [2025 submissions page](https://www.apbiomec2025.auckland.ac.nz/submissions/), likewise indexed.
- Shift method: retain the interval before the conference start (November 18, 2025 → November 16, 2027). Approximate mid-August remains approximate. Use July 30 from the registration table/key dates when resolving the source’s conflicting early-bird date.
- File-copy verification compares source and destination SHA-256 values for all four supplied branding assets.
