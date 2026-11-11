# META Reporting 5.3 — Analytics Overview

## Installation

Upload **all files in this folder** into the root of the existing `j1997sh/meta-reporting-demo` GitHub repository and commit. Keep the existing GitHub Pages configuration. This release builds on 5.2.1 and retains the existing social-listening, office, Report Studio, peer comparison and authentication components.

New files:

- `analytics-home.js` — responsive, configurable home overview, metric explorer, source labels and preset management.
- `analytics-home.css` — deliberately compact, icon-free analytics styling.

The HTML includes the new files after `peer-benchmarks.js` and `peer-benchmarks.css`.

## New homepage

- HQ: an overview of all eight fictional MPs by default, or filter to a single fictional Page.
- MP office: overview of its own authorised/demo Page, with a quick link to peer benchmarks.
- Presets: Executive; Detailed Analytics; Community & Content.
- Choose up to 12 headline metrics, show/hide/reorder sections, collapse panels and choose chart measures.
- Searchable metric catalogue with current values, method definitions and availability/source indicators.
- CSV export of the metric catalogue.
- Integrated Audience, Content Formats, Top Posts, Video, Conversations, Peers, Advertising, Operations and Data Coverage.
- Responsive layout, no new icons, no database changes required.

## Data and privacy

All figures displayed in the public demo are synthetic. The existing read-only Supabase bridge supplies fictional historical Page, post and advertising records where connected. Browser-generated fake figures remain a fallback if Supabase cannot be reached. This is **not a Meta API live dashboard**.

Metrics are labelled as recorded, calculated, simulated, missing or not collected. The UI deliberately does not invent reach, demographic information, video retention or other unsupported API statistics. Reach is not summed across dates. Geographic data is illustrative and not proof of constituency residence. The custom homepage layout is saved **locally in the browser** and is scoped to the workspace and signed-in user when available; it is not synchronised to Supabase.

In a private workspace with no authorised live Meta import, the homepage deliberately displays an empty state instead of showing fictional statistics as if they were live. Other existing private workspace pages are preserved.

## Validation

All local JavaScript files passed `node --check`. Existing archives were inspected and the new release includes the full previous application. Browser automation was attempted but blocked by the execution environment's browser navigation restrictions. Verify responsive rendering and interactive behaviour after uploading to GitHub Pages. No real Meta Graph API connection or authentication end-to-end testing is claimed.
