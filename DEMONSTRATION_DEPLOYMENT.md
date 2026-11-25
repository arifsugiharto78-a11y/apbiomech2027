# Committee demonstration deployment

Prepared for the personal account **arifsugiharto78-a11y**. No organization, replacement account, custom domain, or DNS setup is required.

- Repository: https://github.com/arifsugiharto78-a11y/apbiomech2027
- Committee preview: https://arifsugiharto78-a11y.github.io/apbiomech2027/
- GitHub Pages source: GitHub Actions; default branch: `main`.
- Publication authorized by the owner on November 25, 2026. Authenticated GitHub CLI identity verified as arifsugiharto78-a11y. The public repository and Actions-based Pages configuration are in place. Latest workflow status: https://github.com/arifsugiharto78-a11y/apbiomech2027/actions.

## Local preparation

`npm ci`, `npm run check`, `npm test`, `npm run build`, and `npm run verify` validate the static site. `node scripts/review-publication.mjs` inventories proposed public source/assets and checks common credential patterns and unnecessary documents. `node_modules`, `dist`, `.astro`, local work, archives, and credentials are excluded from the publication set.

The website displays the committee-review notification configured in `src/data/conference.json` under `preview`. Leave `launchStatus: "development"` and `preview.enabled: true` during evaluation. All pages retain noindex/nofollow. The notification does not restrict access: the requested public demonstration is accessible to anyone with the link and needs no GitHub login.

Confirmed deadlines and 2027 registration fees remain “To be announced.” The previously requested estimates remain clearly labelled planning references. The unavailable CMT, registration, and document actions remain disabled.

## Authorized publication sequence

Readiness verified November 25, 2026: clean dependency installation; type checking with 40 files and no errors or warnings; eight tests passed; 41 static HTML pages built and link/asset-checked under `/apbiomech2027/`; correct account-specific canonical URLs; exact committee notification and noindex on every page; workflow YAML parsed and its build-to-deploy dependency checked. Browser review covered desktop (1440px), tablet (768px), and phone (390px), with no horizontal page overflow, all branding images loaded, keyboard dropdown operation, mobile registration navigation, disabled registration, and no reported console errors.

The proposed publication inventory contains 81 source and asset files (approximately 5 MB). The heuristic scan found no common credential patterns or confidential office documents. The authenticated repository check confirmed no existing repository. After owner authorization, a new public repository was created and the reviewed files were committed on main. The initial commit preserves the prepared site as the beginning of the project history.

Perform the following only after the owner explicitly approves public repository creation, upload, and GitHub Pages settings changes:

1. Sign in to GitHub CLI using the existing personal account. Verify `gh auth status` and `gh api user --jq .login`; the latter must equal `arifsugiharto78-a11y`. Do not use the separately connected university account.
2. Run `gh repo view arifsugiharto78-a11y/apbiomech2027` to distinguish an absent repository from an existing private repository. Preserve any existing remote history; do not replace or force-push existing work.
3. If absent, create the requested **public** repository. Initialize the local project on `main`, review its exact tracked-file list, and commit the reviewed source/assets only. Configure the personal author identity locally rather than changing global Git identity.
4. Connect the correct remote and push to `main`. Do not upload the parent chat workspace, local authentication state, dependencies, or generated build directory.
5. Enable GitHub Pages with the **GitHub Actions** publishing source. Leave the custom-domain field empty. The workflow uses the repository owner for `SITE_URL` and defaults `BASE_PATH` to `/apbiomech2027/`.
6. If the first push precedes Pages configuration, run the workflow manually after enabling Pages. Monitor both build and deployment jobs, resolve errors, and verify the returned deployment URL.
7. Check the actual public website without authentication: homepage, banner, all logos, nested-page navigation, keyboard/mobile menus, estimates, venue link, unavailable actions, and any approved downloads. Confirm no console or network errors.

## Updating and sharing after deployment

Use `WEBSITE_MAINTENANCE.md` for content changes. Review and merge approved changes into `main`; Actions rebuilds and deploys automatically. A failed check or build prevents the deploy job.

Share the committee preview URL directly by your preferred channel. Recipients do not need to sign in to GitHub. Include a short explanation that this is a demonstration website, that content may change, and that registration/submission are not yet open. This project does not send invitations or messages on the owner's behalf.

The future domain remains a configuration-only migration documented in `DOMAIN_MIGRATION.md`; do not activate it during this stage.


The corrected conference display name is **14th APBiomech**; **APAB** refers only to the association. The full association introduction supplied by the owner is included on the About APAB page, with its official website link and a homepage summary. The user-approved banner variant reads (14th APBiomech), while the original file is retained. The final additions were checked on desktop, tablet, and phone with no horizontal overflow, complete text, a loaded linked logo, and no reported console errors.

