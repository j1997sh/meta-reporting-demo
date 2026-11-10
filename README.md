# META Reporting — GitHub Pages demonstration

A complete **static, browser-based demo** for a fictional network of eight MPs. This is a *demonstration only*: all Pages, constituencies, followers, posts, engagement, advertising results and campaigns are synthetic. No authentication, Facebook access token, database or Google Sheet is connected.

## What works

- Responsive overview with charts and KPIs
- Searchable MP directory and individual account dashboards
- Sortable, metric-selectable league table
- Side-by-side MP comparison
- Audience charts and posting activity calendar
- Searchable content explorer and keyword campaign monitor
- Advertising results and filters
- CSV downloads and browser print/PDF for an individual account
- Global reporting period (7, 30, 90 or 365 days)

## Publish on GitHub Pages

1. Create a new repository, for example `meta-reporting-demo`.
2. Upload **`index.html`**, **`styles.css`**, **`app.js`** and **`.nojekyll`** to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, then select `main` and `/ (root)`; save.
5. GitHub will provide a URL typically resembling `https://YOUR-USERNAME.github.io/meta-reporting-demo/`.

For a public demonstration, a public GitHub repository is simplest. Do **not** upload API keys, real Meta data, passwords or private spreadsheets. **GitHub Pages is publicly accessible, including when source is stored in a private repository.**

## Local preview

Open `index.html` in a browser. No build step or third-party JavaScript libraries are required.

## Technical notes

- Date range is anchored to **31 October 2026**, the end date of the fictional dataset, so the charts are populated regardless of the day you view the demo.
- Data is generated deterministically in the browser in `app.js`. It is not pulled from Meta or Google Sheets.
- Reports are client-side CSV files or the browser's print/PDF feature; **server-side editable PowerPoint generation, real user accounts, scheduling and email delivery are not implemented**.
- For the future private production app, move Meta API calls, credentials, user authorisation, ingestion and report jobs to a secure backend/database. Do not put tokens in this static frontend.
- GitHub Pages is suitable for this non-commercial prototype, not as the only infrastructure for a private production SaaS platform.
