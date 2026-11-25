# Website maintenance

Readability sizing is centralized in `src/styles/readability.css`, loaded after the original design styles. Body text uses 18 px at the default browser setting, introductory text 20 px, and controls 16 px. At the owner's request, the header uses a compact 28 px wordmark, 13 px subtitle and 13–14 px desktop navigation to show all top-level links. The full navigation remains visible from 768 px, wrapping on tablets as needed; only narrower phones use the hamburger, with 16 px links and 44 px submenu buttons. Main content retains the larger reading scale. Sizes use rem units so browser text preferences continue to work. The phone header scrolls with the page to leave more room for reading.

All paths below are relative to the repository root. Edit JSON with double quotes, no comments, and no trailing commas. Use `null` for unconfirmed values. Commit only committee-approved public information. The website is static; changes appear after a new build/deployment.

## 1. Update central conference information

Edit `src/data/conference.json`. This controls the name, dates, Bali time zone, location, host, faculty, association, contact email, domain, preview URL, portal URLs, launch status, welcome paragraphs, document paths, logos, and photography.

- `email`: approved secretariat email or `null`; the header, contact page, and footer update together.
- `socialMedia`: approved objects with `label` and HTTPS `url`.
- `welcome`: three editable paragraphs; preserve committee approval.
- `launchStatus`: keep `"development"` until an official launch is approved. `"official"` removes preview labelling and changes robots/indexing. This is separate from deployment authorization.
- `githubPreviewUrl`: actual GitHub Pages URL after the repository owner is known.

Do not change `officialDomain` to claim ownership or activate DNS. It records the future intended domain only.

## 2. Add an announcement

Create `src/content/announcements/your-announcement-slug.md`. The filename becomes its URL. Example structure (replace every bracketed field with approved information):

```md
---
title: "[Approved announcement title]"
date: "2027-01-15"
category: "Programme update"
summary: "[Approved short summary]"
approved: false
---

[Approved announcement text.]
```

The date above is an example, not a conference deadline. Categories can include call for abstracts, registration, speaker announcements, deadline extensions, programme updates, and sponsorship. Change `approved` to `true` only when ready to publish. Unapproved announcements generate no page and do not appear in listings. Announcements sort newest first. The homepage shows up to three. Remove or replace the existing website-preview notice at official launch.

## 3. Modify important dates

Edit `src/data/dates.json`. The approved `date` field remains null until committee approval. Provisional values live in separate `estimatedDate` or `estimatedLabel` fields, with their 2025 `referenceDate`. The method and source links are in `src/data/planning.json`. Replace `date: null` with an approved `YYYY-MM-DD` date or ISO timestamp to supersede an estimate; confirmed dates are displayed without the Estimated badge. Clear the estimate fields if no longer needed. The approximate programme milestone uses only a label, never a fabricated exact day. Dates are displayed in `Asia/Makassar`.

The final conference row reads the date label from central configuration rather than using its own date. If conference dates change, update `conference.json` and the explicit programme-day list in `programme.json` together.

## 4. Add committee members

Edit `src/data/committee.json`. It begins as an empty array. Example record schema:

```json
[
  {
    "name": "[Approved full name]",
    "position": "[Approved academic position]",
    "institution": "[Approved institution]",
    "country": "[Country]",
    "image": "images/committee/approved-member.jpg",
    "role": "Conference Chair",
    "biography": "[Approved short biography]",
    "approved": false
  }
]
```

Upload the actual photograph first, then set `approved: true`. Set `image: null` when no approved photograph is available. Supported roles: `Conference Chair`, `Co-Chair`, `Organizing Committee`, `International Scientific Committee`, `Local Scientific Committee`, `Advisory Committee`, and `Conference Secretariat`. Scientific committee roles appear on the Scientific Committee page; the other roles appear on the Organizing Committee page.

## 5. Add keynote or invited speakers

Edit `src/data/speakers.json`:

```json
[
  {
    "name": "[Approved full name]",
    "title": "[Approved academic title]",
    "institution": "[Institution]",
    "country": "[Country]",
    "image": "images/speakers/approved-speaker.jpg",
    "category": "keynote",
    "talk": "[Approved presentation title]",
    "biography": "[Approved short biography]",
    "approved": false
  }
]
```

Use `category: "keynote"` or `"invited"`. Set `approved: true` after approval. Approved speakers appear on the homepage and in their respective listings. Biography text is displayed with a native keyboard-accessible disclosure.

## 6. Upload photographs and official logos

Put photographs in `public/images/speakers/` or `public/images/committee/`. Use concise lowercase filenames without spaces. Use rights-cleared images, ideally compressed JPEG or WebP, with adequate resolution. Paths in JSON start with `images/`, without `public/` or a leading slash. For portraits, provide a square-friendly image; cards use a square crop. This does not apply to the official banner, which is never cropped.

The user-supplied APAB, combined FTMD ITB, and Masyarakat Biomekanika Indonesia logos are now included. The combined FTMD ITB asset contains the ITB mark; it must not be separated or redrawn. Only original committee-supplied logo files may be used. Put files in `public/images/branding/`, then add to `conference.json`:

```json
"logos": [
  { "name": "[Official institution name]", "image": "images/branding/official-logo.png" }
]
```

Do not redraw institutional marks or use a wordmark as a substitute official logo. The header uses text identities while files are unavailable.

For Bali photographs, use `public/images/bali/` and add records to `baliPhotos` in `conference.json` with `image`, descriptive `alt`, and `credit`. Only approved photographs are rendered; no stock-image placeholders are included.

## 7. Upload the abstract template and other documents

Put approved files in `public/documents/`. In `conference.json`, set:

```json
"abstractTemplate": "documents/apbiomech2027-abstract-template.docx",
"sponsorshipProspectus": "documents/apbiomech2027-sponsorship-prospectus.pdf",
"programmeDownload": "documents/apbiomech2027-programme.pdf"
```

These are target-path examples, not files included in this preview. Only use paths for files actually uploaded. Download buttons remain disabled when a path is null or the file does not exist. Never use the previous conference's template as the official 2027 template.

Update `src/data/pages.ts` with approved abstract word limits, formatting, review criteria, presentation duration, poster size, and acceptance instructions. Do not infer these from previous events.

## 8. Update registration fees

Edit `src/data/registration.json`. Provisional reference amounts are in `estimatedEarlyBird` and `estimatedRegular`; their original NZD currency, source, and limitations are in `benchmark`. These are separate from actual approved fees and do not imply New Zealand GST applies in Indonesia. Keep the source information when updating estimates. Set `currency` to the approved ISO currency code before entering numeric fees. Each category has `name`, `earlyBird`, and `regular`. Use numbers for confirmed amounts, including zero if an approved category is free. Keep `null` for pending fees. Add/remove categories according to the approved structure.

Update the accompanying introductions, inclusions, taxes, eligibility, payment information, and cancellation policy in `src/data/pages.ts`. Do not activate registration until the service, privacy terms, fees, and policies are approved.

## 9. Activate Microsoft CMT submission

In `src/data/conference.json`, set `cmtUrl` to the exact committee-approved HTTPS conference portal and `submissionOpen` to `true`. Both are required. The site links out in a new tab and does not store abstract data. Set the flag back to `false` to close the action. Update approved guidelines, deadlines, the abstract template, and an announcement in the same change.

## 10. Activate registration

The owner-authorized participant form now lives at `registration/portal/`. Configure it in `src/data/registration-system.json`; keep DEMO active by default. The legacy `registrationUrl` and `registrationOpen` flags do not activate this form. Follow `REGISTRATION_SYSTEM.md` and `GOOGLE_APPS_SCRIPT_SETUP.md` for the separate private TEST backend, shared validation build, acknowledgment email and LIVE approval guards. Use the selected personal Google account; do not substitute the connected university account. No API secrets, participant rows or database identifiers belong in GitHub. The committee must explicitly approve LIVE collection and privacy/terms before activation. Payment is independently disabled.

## 11. Add sponsors and exhibitors

Upload approved artwork under `public/images/sponsors/` and edit `src/data/sponsors.json`:

```json
[
  {
    "name": "[Approved sponsor]",
    "category": "Gold",
    "image": "images/sponsors/approved-sponsor.png",
    "url": "https://example.com/",
    "approved": false
  }
]
```

Replace the illustrative external URL. Set `approved: true` only after approval. Supported categories are exactly `Supporting institutions`, `Platinum`, `Gold`, `Silver`, and `Exhibitors`. Empty categories are hidden. Sponsors appear on the homepage and Sponsors and Exhibitors page. Institutional host and association areas remain separate.

## 12. Update scientific topics and programme

Edit `src/data/topics.json`. Keep `approved: false` while topics are proposed; change it only after approval. Add or replace strings in `items`.

Edit `src/data/programme.json`. `days` defines date buttons. `sessionTypes` documents expected categories. Add approved records to `entries` using this schema:

```json
{
  "id": "[unique-session-id]",
  "date": "2027-11-16",
  "time": "09:00",
  "endTime": "10:00",
  "title": "[Approved session title]",
  "type": "Keynote lecture",
  "topic": "Computational biomechanics",
  "location": "[Confirmed room]",
  "speakers": ["[Approved speaker name]"],
  "approved": false
}
```

The times are schema examples, not announced sessions. Set each approved record to `approved: true` and then `published: true` at the top of the file to display the schedule. Date, type, and topic filters activate when published entries exist. Times are Bali local time. Keep entries in chronological order. Topic strings should match `topics.json`. Pending schedules retain a clearly labelled preparation message.

## 13. Replace the official homepage banner

The original user-supplied banner is retained. The active user-approved name variant is controlled by `banner` in `src/data/conference.json`, currently `public/images/branding/apbiomech2027-hero-updated.png`. To switch to another approved file, upload it and update that configuration path. The retained original is:

`public/images/branding/apbiomech2027-hero.png`

Run `npm run build`. This retains the original PNG, creates a quality-92 WebP, and updates `src/generated/assets.json` automatically. The hero switches from the labelled text preview to the complete official banner. The image has intrinsic dimensions, keeps its aspect ratio, uses no text overlays, and shows separate date/location text on phones. A visually hidden H1 preserves accessibility. Do not crop, recompose, edit, or replace the official art.

## 14. Publish a content update through GitHub

1. Obtain committee approval for the content and permission to publish.
2. In GitHub, open the relevant file and use the pencil icon, or use **Add file → Upload files** for approved media.
3. Preserve JSON/Markdown formatting. Describe the change in the commit message. Prefer a branch and pull request for review; merge to `main` after approval.
4. The Actions workflow runs `npm ci`, type checking, tests, build, and link checks. It deploys automatically after a successful push to `main` once Pages is enabled.
5. Inspect the completed workflow and published site. Test the edited content, phone view, keyboard navigation, downloads, and external actions.

For local editing, use the commands in `README.md`. A failed validation prevents the deployment job. To undo an incorrect update, revert its commit and allow the workflow to publish the correction. Do not delete the repository or change domain settings as a rollback.

## 15. Launch review

Before replacing `development` with `official`, confirm the original banner and logos, all committee-approved facts and policies, accessible media, portal URLs, document files, contact details, and final hosting configuration. Update preview wording throughout content. Preview noindex is not authentication or privacy protection. Domain activation is a separate authorized operation described in `DOMAIN_MIGRATION.md`.

## Venue information

The selected venue is configured in `src/data/conference.json` under `venue` (`name`, `shortName`, `url`, and `address`). Update it there so the homepage, venue cards, FAQ, and Event structured data remain consistent. The present name and address are based on the user-selected [official hotel website](https://www.nusaduahotel.com/). Conference room rates, room blocks, meeting-room allocation, and transport arrangements remain unconfirmed.

## Committee demonstration notice

The exact review notice is stored in `conference.json` under `preview.message`, with `preview.enabled: true`. Keep it enabled during committee evaluation. Set `launchStatus` to `official` only after launch approval; this removes the review notification and preview indexing restrictions. Changing the banner message alone does not change access controls or indexing. See `DEMONSTRATION_DEPLOYMENT.md` for the personal-account Pages setup and sharing instructions.

## Conference name and APAB introduction

Keep the full conference title and short display name separate from the APAB association name. The short conference label is `14th APBiomech`. The user-approved banner variant is `public/images/branding/apbiomech2027-hero-updated.png`; the original remains alongside it. `conference.json` controls the active `banner` and records `bannerOriginal`. Do not replace either without an approved asset. The supplied APAB text, author attribution, and official link are in `src/data/association.json`; `Association.astro` renders the full introduction and homepage summary.

Planning estimates are displayed in IDR using the planningConversion object in registration.json. Its rate is IDR per one NZD (currently 10000, supplied by the owner). Original estimatedEarlyBird/estimatedRegular values stay in benchmark.currency (NZD); the view converts them for display. Change the configured rate to update all displayed estimates together. Confirmed fee fields use the separate approved currency and are not converted a second time.
