META Reporting 5.2 — Peer benchmarks
====================================

Deployment:
1. Open your existing GitHub repository j1997sh/meta-reporting-demo.
2. Upload ALL files inside this ZIP to repository root, replacing existing files.
3. Commit and refresh the GitHub Pages site.
4. In the fictional MP office demo, open Analytics -> Peer benchmarks.

Two new files must be present: peer-benchmarks.js, peer-benchmarks.css.

What's live in Supabase:
- A new Edge Function meta-peer-benchmarks is deployed in project hlwqgzhtmhmwfywiiwdx.
- It requires authenticated Page membership; private comparisons require a minimum five other offices with post data and suppress peer identities and individual rows.
- This function does not bring in Meta data; real private benchmarking only works after Meta posts and insights have been ingested into the private organisation.
- No account permissions or existing RLS policies were changed in this release.

Metrics:
- Your own count and share of Video, Photo, Link and Text posts.
- Median share across eligible other offices, not the aggregate share across all posts.
- Own interactions/post when 3+ posts have complete insight snapshots; peer median when 5+ eligible offices have that measure.
- Never present missing API metrics as zero.

Benchmarks describe observable activity; differences do not establish causation or determine political success.

Testing:
- New JavaScript passes node --check.
- Chromium browser rendering could not be verified in the available environment (blocked by administrator).
- Secure Edge Function deployment was accepted as ACTIVE; real signed-in / live Meta data end-to-end test is outstanding.

5.3 copy adjustment: all visible network/peer midpoint labels now read “Your colleagues”, with median and anonymity caveats retained.
