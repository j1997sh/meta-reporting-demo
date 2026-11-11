# META Reporting — Changelog

## 5.0 — 11 November 2026

- Distinct HQ Intelligence and MP Office workspace interfaces, selectable in public fictional demonstration mode.
- Public Social Listening: 64,485 synthetic comments and 27,698 aggregate topic/day rows in Supabase.
- Topic classification, questions for review, approximate language/tone breakdowns, 7-day activity comparisons and keyword frequency in loaded comments.
- Six generic shared operating practices, 48 fictional practice-documentation indicators and an anonymous demonstration of cross-office uptake.
- Office Insights: 48 fictional explanatory observations linked to sample record counts.
- Action Centre: 48 seeded tasks; private tasks can be created, reviewed, assigned to self and updated by authorised users.
- Private MP office Page assignments with database-enforced row restrictions.
- HQ-only office invitation Edge Function and HQ-controlled private report sharing via signed URLs.
- Incremental topic/day aggregate refresh database trigger.
- HQ meeting-pack template creator integrated with existing Report Studio.
- No Meta tokens, service-role credentials or real constituent comments in the browser.

## 4.0 — 10 November 2026

- Supabase authentication, private workspaces and report templates.
- Cloud report library, scheduled report workers, private PDF/PPTX storage and role-based organisation administration.

## 3.0 — 10 November 2026

- Read-only Supabase-backed fictional follower, post, ad and geography analytics.

## 2.0 — 10 November 2026

- Visual Report Studio, custom leagues, geography, campaign exploration and report exports.


## 5.1 – Navigation & design refinement
- Six primary HQ navigation headings, contextual expandable submenus and sectional tabs.
- MP office navigation streamlined independently.
- Replaced sidebar icons with typographic hierarchy, reduced sidebar size and refined all major components.
- Renamed Office Intelligence to **Insights & Actions** consistently.
- Preserves 5.0 Supabase connectivity, users, reports, social listening and automations.

## 5.2 — Peer benchmarks (11 November 2026)
- Added **Peer benchmarks** to individual MP office Analytics navigation and home screen.
- Fictional demo: displays each office's video, photo, link and text mix alongside anonymous network medians; engagement per post is descriptive.
- Private mode: `meta-peer-benchmarks` Supabase Edge Function returns grouped figures only after checking the logged-in user's own Page access and requiring at least five eligible other Pages. Does not return peer identities, individual results, or ranks.
- Missing Meta post-format/engagement inputs show unavailable, not invented values.
- No changes to the HQ report builder, login, database schema or original reporting routes.
