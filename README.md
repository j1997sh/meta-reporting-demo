# META Reporting 4.0 — Secure Cloud Workspace

**Website:** https://j1997sh.github.io/meta-reporting-demo/

The public site continues to display **fictional Facebook analytics**. A separate, authenticated Supabase workspace enables durable report templates, user roles, report jobs, private PDF/PowerPoint exports and scheduled reporting. There is **no real Meta API connection yet**.

## Installation: existing GitHub Pages website

1. Extract `META_Reporting_Cloud_Workspace_v4.zip`.
2. Open the existing repository `j1997sh/meta-reporting-demo` on GitHub.
3. Use **Add file → Upload files**. Upload the **files inside** the `meta-reporting-demo/` directory into the **root of the repository**, replacing same-named existing files. Do not upload the directory itself.
4. Commit. Leave GitHub Pages configured for the `main` branch and `/ (root)`.
5. Refresh https://j1997sh.github.io/meta-reporting-demo/ after GitHub Pages publishes the update.

**Important new files:** `cloud-workspace.js`, `cloud-workspace.css`. Do not omit these. `index.html` and `app.js` have also changed.

## One-time Supabase Authentication settings

In the existing Supabase **META TRACKING → j1997sh's Project** dashboard:

1. Open **Authentication → URL Configuration**.
2. Set **Site URL** to `https://j1997sh.github.io/meta-reporting-demo/`.
3. Add **Redirect URL**: `https://j1997sh.github.io/meta-reporting-demo/**`.
4. Keep email confirmation enabled if available. Supabase's built-in email service can have rate limits; a custom SMTP provider is recommended before inviting numerous people.

No API secret or service-role key needs to be entered in GitHub. The publishable key in the browser is public by design; access is controlled through RLS and authenticated functions.

## Activate your own workspace

1. On the published website click **Sign in → Create account** and verify your email if requested.
2. Sign in; open **My workspace**.
3. Download the **separately delivered** `META_Reporting_Private_Setup_Code.txt` and enter its one-time activation code on the website. **Never upload that code file to GitHub.**
4. Name the workspace and activate it. This code can only be used once.
5. Three starter templates are added to your private organisation: Weekly MP Performance, Organisation Performance and Advertising Review.

The initial user becomes the workspace owner. Other users join through invitations in **Organisation admin**; the one-time setup code is not shared with them.

## What is live and tested on Supabase

- 17 original reporting tables plus template version history; Row Level Security and private Storage policies.
- A database-backed authenticated organisation with `owner`, `admin`, `analyst` and `viewer` roles. Owners/admins can edit reporting records; analysts/viewers can read.
- A protected invite/member management Edge Function (`meta-members`).
- A custom Report Studio and saved report templates, persisted in your own workspace database.
- Cloud-saved league table configurations and template version history (previous template versions are stored in the database; a visual restore button is not yet present).
- Private report storage (`meta-reports` bucket), with signed download URLs.
- An automatic report worker Edge Function (`meta-report-worker`), authenticated by a secret held inside Supabase Vault.
- Two active PostgreSQL cron jobs: queue checks every 15 minutes, with report processing every 15 minutes, offset by five minutes.
- Weekly, daily and monthly schedules using Europe/London local time; weekly defaults to Monday at 09:00 UK time. Supports organisation and individual-MP reports, plus all-eight-MP bulk reports.
- An end-to-end automated PDF/PPTX export was generated and verified in private Supabase Storage using a synthetic QA job.

## Using the new website

**My workspace**: Sign in, activate your organisation, review cloud template and report counts.

**Report studio**: Use the existing visual component editor. Click **Save template** to save to Supabase while signed in. Without sign-in, edits continue to save locally only.

**Cloud report library**: Select a saved template and scope; generate a PDF and PowerPoint. Create schedules, approve review-required reports, inspect job history, and download finished reports through short-lived signed URLs.

**Organisation admin**: Rename the organisation, add/enable/disable/remove Page records, invite users and change their roles.

**League table**: Click **Save current view** while signed in to persist your column/sort selection in Supabase, available on another device.

## Important scope and limitations

- **All reporting metrics are currently simulated**. The public demonstration dataset is intentionally kept separate from the private workspace.
- The automated server worker currently produces **editable PowerPoint text and shapes** and a structured PDF, but does **not reproduce every browser chart or drag-and-drop pixel placement**. The browser's full visual report designer remains the richer interactive representation.
- **Email delivery is not configured**. Scheduled reports generate files privately; they are not automatically emailed. An email provider and recipient/consent controls are needed before enabling that feature.
- The interface does not yet retrieve live Meta Page Insights, audience geography or Marketing API data. It is prepared for future server-side integration; never paste Meta tokens into GitHub files.
- Do not use the public Pages demonstration to store confidential or sensitive data. Live customer data should remain behind authenticated Supabase access.
- The Github Pages demo cannot host backend logic. Scheduled jobs and file generation already run server-side in Supabase.

## Troubleshooting

**Sign up redirects to the wrong site:** Check Authentication → URL Configuration (Site URL and Redirect URLs).

**Invitation never arrives:** Check spam and Supabase Auth email sending limits. You can still invite an existing Supabase user.

**Cloud SDK unavailable:** Ensure the browser can access the pinned Supabase JavaScript SDK from jsDelivr. Ad blockers and network restrictions may prevent it loading.

**No reports in the library:** Confirm a template was saved after signing in. Scheduled jobs run on cron intervals; press Refresh to retrieve the latest job status.

**Report requires approval:** Click **Approve** in the cloud library. The worker then generates the PDF/PPTX automatically on the next run.

**Supabase access denied:** Confirm you are signed into the account that owns the private organisation or have received an invitation.

## Security reminders

The activation-code file is separate from the website ZIP. It must **never** be committed to GitHub. Real Meta user tokens, service-role keys, secrets and private report files must never be committed to the repository. Public demo read permissions are intentionally restricted to fictional rows; private reports and authentication records remain protected by Supabase.
