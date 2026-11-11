# META Reporting changes

## v4.0 — Supabase cloud workspace

- Added Supabase Auth login/sign-up and single-use private workspace activation.
- Added owner/admin/analyst/viewer membership controls and an authenticated invitation backend.
- Added three private report templates on workspace activation; version history for template updates.
- Connected Report Studio saves and league table saved views to Supabase.
- Added private report file storage, signed download links, PDF/PowerPoint exports and report job history.
- Added automatic daily/weekly/monthly scheduling with UK-time scheduling and optional review approval.
- Deployed and tested an Edge Function worker that generates PDF and PPTX files from synthetic data.
- Added organisation admin pages and restricted user management.
- Preserved prior public fictional analytics, audience geography, and read-only Supabase demonstration bridge.

Known limits: No live Meta API token or real account data has been connected; no email provider; server-generated exports are simplified relative to the visual web report canvas.
