# META Reporting — Expanded GitHub Pages Demonstration

A static, browser-based **fictional Facebook network analytics** demonstration. All MPs, Pages, location distributions, posts, campaigns, follower figures and advertising performance figures are simulated. **No real Meta API connection is included.**

## What's new in this release

- **Visual Report Studio:** Add, remove and drag/reorder report components; adjust account, title, metric, colours, logo URL and commentary. Preview results. Export an editable `.pptx`, print/save as PDF, and save report templates **in your own browser**.
- **Templates and configuration:** Save/duplicate/delete templates; export/import templates as JSON; inspect local report history; configure illustrative schedules. **Schedules are saved as examples and do not send reports or execute automatically.**
- **Audience geography:** Simulated follower percentages by city and country, configurable city groups for a descriptive local-area estimate, CSV download, and a geography component in the report builder. **City labels are not parliamentary constituency boundaries.**
- **Custom league table:** Choose metrics and visible columns, save named views, export CSV.
- **Expanded campaigns:** Edit keyword rules and manually exclude irrelevant post matches.
- **Advertising explorer:** Campaign, account and daily reporting views from the fictional dataset.
- **Connections and diagnostics:** Documentation of permissions and metrics to validate when a secure live integration is added. It does not test the API.
- Existing **Overview, Accounts, Compare MPs, Audience, Content Explorer and Activity Monitor** remain available.

## Publish the update to your existing GitHub repository

Your current site is configured from the `main` branch and `/ (root)` folder.

1. Extract this ZIP.
2. Open your existing `meta-reporting-demo` repository on GitHub.
3. Select **Add file → Upload files**.
4. Upload **all the files inside this folder** directly to the repository root. This includes `index.html`, `styles.css`, `extensions.css`, `app.js`, `extensions.js`, `jszip.min.js`, `pptxgen.min.js`, `.nojekyll`, `README.md`, and the licence notices.
5. GitHub may warn that some filenames already exist; accept the replacements, then **Commit changes**.
6. Your existing GitHub Pages deployment should publish the update automatically. If the old interface persists, perform a hard refresh or open a private browser window.

**Do not upload the outer folder as a nested folder, and do not upload the ZIP itself.**

## Security and accuracy

The public GitHub Pages website is a **demo only**. Never commit Meta access tokens, real personal or constituent data, API secrets or unpublished reports to it. No server-side authentication, live Meta data ingestion, automated report delivery or persistent multi-user database is implemented.

Report templates, saved league-table views, geographic groups, local campaign exclusions and schedule settings live in the current browser's `localStorage`. They do not sync between devices. Export your templates as JSON if you want a backup.

The follower geography feature uses illustrative percentages, **not** Meta Page Insights. For production, an authenticated backend must determine which geographic follower breakdowns the authorised Page actually supports, verify metric fields/periods against its Graph API version and Page permissions, and account for aggregation/suppression and non-constituency geographic boundaries.

PowerPoint export uses a bundled browser-side library and creates editable text and shapes; not every browser chart is reproduced as an editable PowerPoint chart. PDF export uses the browser print dialogue.

## Files

- `index.html` — website shell and navigation
- `styles.css` — original dashboard styling
- `extensions.css` — report studio, geography, filters and print styling
- `app.js` — synthetic dataset and original dashboards
- `extensions.js` — report studio, geography, deeper explorer and local settings
- `jszip.min.js` and `pptxgen.min.js` — bundled open-source PowerPoint export dependencies
- Licence notices — third-party library licences
- `.nojekyll` — disables Jekyll processing on GitHub Pages

## Testing performed

- JavaScript syntax checked with Node.js.
- Tested rendering of all expanded views in headless Chromium with the provided demo data.
- Tested adding report components, saving a template, switching tabs, and changing league table columns.
- Tested and generated a `.pptx` download in headless Chromium.

A full live Meta API integration and cross-browser production test remain outstanding.
