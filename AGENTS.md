# 14th APBiomech development guidance

- Static Astro website. Keep all pages pre-rendered; no SSR or payment processing. The owner authorized the participant registration form and separate Google Apps Script/private Sheets backend templates on November 25, 2026. Keep DEMO active; do not collect real participants or activate LIVE without explicit committee authorization.
- Conference facts and external portal URLs belong in `src/data/conference.json`. Use null for unconfirmed details. Never fabricate people, logos, prices, deadlines, sponsorship, or venue information.
- User-requested planning estimates are permitted when clearly labelled. Store estimates separately from approved fee/date fields, retain source URLs and currency, and document the adjustment method. Do not infer tax rules or membership discounts from the previous conference.
- The official banner must remain intact. `npm run build` creates WebP without modifying the supplied PNG. Never substitute another banner or crop embedded text or logos.
- The user explicitly approved a separate conference-name variant: `apbiomech2027-hero-updated.png`. It reads `14th APBiomech`; the original supplied PNG is retained. APAB is the association only. Preserve both assets and their documented provenance.
- The owner requested ITB-only host branding on November 26, 2026. Use the supplied ITB seal for the host institution, omit the combined FTMD ITB logo, and write the full faculty name without its acronym. The active `apbiomech2027-hero-itb.png` is a separate authorized variant removing the FTMD wordmark; retain the earlier banner assets as provenance.
- Only publish approved profiles and content. Keep proposed topics clearly labelled until approved.
- All internal URLs must use `withBase` from `src/utils/url.ts`. Test `/apbiomech2027/` and `/`.
- Maintain accessible native controls, visible focus, semantic headings, keyboard dropdowns, and reduced-motion support. Use minimal client JavaScript.
- Before handoff: `npm run check`, `npm test`, `npm run build`, `npm run verify`; inspect desktop and mobile layouts when a browser is available.
- Keep `launchStatus: "development"`, noindex, and preview labelling until committee approval. No CNAME, domain purchase, account setup, or public deployment without authorization.
- Maintain `README.md`, `WEBSITE_MAINTENANCE.md`, and `DOMAIN_MIGRATION.md` when configuration or content workflows change.
