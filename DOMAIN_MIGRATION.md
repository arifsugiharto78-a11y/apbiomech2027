# Future migration to apbiomech2027.org

The domain is intended, not assumed purchased or owned. No CNAME file, registrar account, DNS change, or public deployment has been created by this project.

These steps require committee authorization. Check the current [GitHub custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and [domain verification documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) before applying DNS changes. Providers and settings can change.

## 1. Purchase and establish ownership

After approval, check availability with a reputable registrar, register the domain under a committee-controlled account, and record responsibility for billing and renewals. Enable the registrar's recommended account security and renewal protections. Do not assume the desired name remains available. Keep payment and account credentials outside the repository.

## 2. Verify ownership in GitHub

In the owning user/organization's GitHub settings, open Pages, add the domain, and copy the exact TXT record GitHub provides. Add that record at the authoritative DNS provider and complete verification after propagation. Retain the verification record. Verify before pointing DNS at GitHub to reduce domain-takeover risk. Instructions: [verify your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

## 3. Configure GitHub Pages custom domain

At repository Settings → Pages, enter `apbiomech2027.org` in the custom-domain field. This project uses Actions deployment; do not add a premature CNAME file to the source. Follow the current Pages instructions for Actions-based deployments. Commit changes only if the current documented workflow specifically requires them.

## 4. Configure authoritative DNS

For an apex domain, use the DNS-provider option supported by GitHub: ALIAS/ANAME to the GitHub Pages host if supported, or the documented GitHub A records. At implementation review, GitHub documents these IPv4 addresses:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Use `@` as the apex record name according to the provider's UI. Confirm the addresses in the current GitHub documentation before applying them. If using IPv6, add only the currently documented GitHub AAAA records. Remove conflicting apex A/AAAA records associated with an old website while preserving unrelated email and verification records.

For `www`, add a CNAME from `www` to `OWNER.github.io` (replace OWNER with the actual account/organization name). Do not include `/apbiomech2027/` or point the CNAME to a repository path. Do not use wildcard DNS records. GitHub can redirect between apex and www once both are correctly configured and one is selected as the Pages custom domain.

## 5. Change build configuration

Set repository Settings → Secrets and variables → Actions → **Variables**:

```text
SITE_URL = https://apbiomech2027.org
BASE_PATH = /
```

Set central `launchStatus` to `"official"` only once the committee approves the public launch; confirm the intended `officialDomain` matches. For local production-equivalent verification, set the same environment variables in the shell. Example PowerShell:

```powershell
$env:SITE_URL = 'https://apbiomech2027.org'
$env:BASE_PATH = '/'
npm run check
npm test
npm run build
npm run verify
```

Astro then regenerates all links, asset URLs, canonicals, Open Graph URLs, structured-data URLs, sitemap entries, and `robots.txt` using the new origin and base. No component redesign or route rewrites are required. `officialDomain` alone does not change build URLs; `SITE_URL` and `BASE_PATH` control them.

## 6. Enable HTTPS

Wait for GitHub's DNS check and certificate provisioning to complete, then enable **Enforce HTTPS** in Pages settings when available. Verify the certificate covers the configured hostname and both apex/www redirects. Do not bypass certificate warnings; resolve DNS or certificate provisioning first. Propagation and certificate issuance may take time.

## 7. Verify after the authorized deployment

- Visit the apex URL and www; confirm the intended canonical hostname and HTTPS redirects.
- Test Home and all dropdown pages, direct nested-page refreshes, the custom 404, keyboard/mobile navigation, programme filters, disabled/active portals, and approved documents.
- Confirm the original banner and optimized WebP both load, with no cropping or duplicated titles.
- Inspect canonical, Open Graph, Event JSON-LD, robots, and sitemap URLs. Confirm they use the official domain and no repository subdirectory.
- Check internal links, self-hosted fonts, portraits, sponsor logos, external CMT/registration destinations, and no browser-console errors.
- Confirm the preview badge and noindex only disappear after approved launch. Run Lighthouse on the final artwork and production hosting.
- Review search-engine indexing only after launch; noindex removal does not guarantee immediate indexing.

## Rollback

Participant registration is independent of the domain migration. Keep `src/data/registration-system.json` in DEMO during this stage. Internal form/privacy/terms links use `withBase`; the future Apps Script native POST endpoint is an absolute HTTPS URL and does not depend on the GitHub Pages path. Re-test Google redirects, new-tab acknowledgment and retained-entry retry on the actual domain before approved LIVE activation. Changing DNS or `launchStatus` does not activate registration. Disable an already deployed backend separately if rolling back collection.

If migration fails, restore `SITE_URL` and `BASE_PATH` to the known GitHub Pages preview values and rebuild. Coordinate Pages custom-domain and DNS changes with the domain owner; do not leave DNS pointing to a removed/unverified Pages binding. Keep domain verification in place. Record the final configuration for the next committee maintainer.
