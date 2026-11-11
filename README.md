# META Reporting 5.0 — HQ Intelligence and MP Office Workspaces

This is the **complete existing GitHub Pages application**, upgraded from META Reporting 4.0. It preserves the existing overview, audience analytics, account comparison, league table, advertising, content explorer, Report Studio, cloud workspace, automated PDF/PPTX report generation and Supabase integration.

**Current website:** https://j1997sh.github.io/meta-reporting-demo/

## Publish the website

1. Download and extract `META_Reporting_HQ_and_Office_Intelligence_v5.zip`.
2. Open the **existing** GitHub repository: `j1997sh/meta-reporting-demo`.
3. Click **Add file → Upload files**. Select **all files inside** the extracted `meta-reporting-demo` folder, not the folder itself.
4. Upload them to the repository **root**, replacing existing files, and commit.
5. Leave GitHub Pages configured to deploy from `main` / `/ (root)`.
6. Refresh the GitHub Pages website once GitHub has published the commit.

**New required files:** `intelligence.js`, `intelligence.css`. The modified `index.html` loads them. Both must be present.

The Supabase database changes and Edge Functions for this release have **already been applied** to the existing META TRACKING project, ref `hlwqgzhtmhmwfywiiwdx`. **Do not rerun schema or data-seeding SQL.** The website ZIP contains no administrator secrets.

## Two different interfaces

Use the **workspace mode** selector in the top bar:

- **HQ demo**: Existing network reporting plus HQ Intelligence, Social Listening, Office Insights, Action Centre, meeting packs, office-access management and report sharing navigation. Public fictitious data only.
- **MP office demo**: Select any of the eight fictitious MPs and view their Page analytics, community conversations, office insights, action centre and reports interface. All sample figures and authors are fictional.
- **My private workspace**: Available after signing in and activating a private Supabase organisation (or after being invited by HQ). Requires authentication. The private workspace is **not populated with the public fictional posts/comments**; real account data is absent until an authorised Meta integration is implemented.

A signed-in **office-only** member is restricted to their assigned private Page(s) and cannot switch to the HQ view. Access is limited in the **database**, not merely by hidden menu items.

## Social Listening features

- 64,485 entirely fictional comments / replies, associated with the eight fictional Facebook Pages and approximately 2,942 fictional Page posts.
- 27,698 per-Page, per-day topic summary rows stored in Supabase.
- Twelve example community-service topic labels, including transport, roads, planning, schools and healthcare.
- Question detection, unanswered/internal-review status, and approximate language/tone categories.
- Comment-level examples, keyword frequency from loaded sample comments, conversation summaries and week-to-week theme activity.
- Filtering to a single MP Page or the whole HQ network.
- The comment classifications and summary text are **rule-based and simulated**, not the output of a live LLM. They are not survey evidence, electoral opinions or reliable sentiment about individual people.

Only synthetic author labels are present in the demonstration. Future real-comment ingestion should minimise identifying information and implement privacy/retention controls, review of permissions and Meta API coverage checks.

## Office Insights / Shared Practice / Action Centre

- Forty-eight fictional, evidence-linked operational observations across eight MPs (six per Page).
- Forty-eight seeded fictional office action records with statuses and sample deadlines.
- Six generic, fictional shared operational practices, with 48 per-office practice documentation indicators.
- Office users can review recurring factual questions and check documentation, accessibility, verified public-service links, publishing calendars and internal workflows.
- Anonymised practice-documentation counts in public demonstration views; **private office views do not reveal peer offices' private metrics**.
- In the private workspace, authorised staff can add tasks, assign tasks to themselves, update task status, record due dates, mark comments as internally reviewed, acknowledge or dismiss observations, and self-report office practices. These operations update Supabase under Row Level Security.

Operational suggestions are *for human review*, are evidence-linked wherever possible, and do not recommend political persuasion or electoral targeting.

## HQ access and individual-office access

The private HQ owner creates Page records from **Organisation admin** (the existing functionality) and then opens **MP office access** to invite staff to a particular Page. Roles: `office_admin`, `office_staff`, `office_viewer`.

Invitations are issued through a protected Supabase Edge Function. The office user has a `viewer` membership at the organisation level, plus a separate Page assignment. Authenticated Row Level Security policies isolate Page-level rows, comments, insights, actions, practice records and relevant aggregate reporting. Existing HQ owner/admin/analyst/viewer roles are preserved; a user who is already HQ owner/admin/analyst cannot be silently reassigned to an office-only role.

**HQ Report Sharing:** Select a finished cloud report and the destination Page. The `meta-report-access` Edge Function authorises office recipients based on the Page assignment and returns a short-lived signed URL for a private report file. **HQ must review a report before sharing**, particularly if it contains information about other MPs.

## Report Studio and meeting packs

The **HQ Meeting Packs** section creates an editable, reusable Report Studio template containing a factual account-performance section, a simulated aggregate conversation summary, an office-action review and a data-quality disclaimer. Use the existing Report Studio Save action to persist the template to the private workspace when signed in.

Existing server-side scheduled PDF/PPTX generation continues to use the v4 report worker. **New Social Listening and Office Insights components are added as text sections in this v5 meeting-pack template**; they are not yet a completely dynamic, server-rendered chart suite inside automated PDF/PPTX exports.

## Supabase implementation

Existing project: **META TRACKING / j1997sh's Project**, PostgreSQL 17 in Ireland.

New tables: `page_office_members`, `page_comments`, `conversation_topics_daily`, `office_observations`, `office_actions`, `shared_practices`, `report_shares`, `office_practice_adoption`.

Existing private table policies were tightened so office-assigned users cannot access an organisation-wide data feed. New foreign keys enforce that office rows refer to a Page in the **same organisation**. The updated indexes support recent comments, topics, actions and per-Page lookups. A private database trigger maintains daily topic aggregates when comments are inserted, updated or deleted. An insertion/deletion trigger test passed and left no lasting QA record.

New Edge Functions (already deployed): `meta-office-manager` and `meta-report-access`. Both require a valid Supabase user session and check membership/ownership on the server. The functions have no service-role secret in browser JavaScript. The v4 `meta-members` and `meta-report-worker` functions remain available.

## Important limitations and next deployment steps

- The **real Meta comments API is NOT connected**. For actual Page comments, a suitable Page token and approved scopes such as `pages_read_user_content` will be required, and data availability must be tested per Page before claiming coverage. Never put a Meta token into public GitHub code.
- The fictional Page post/ads/followers dataset is separate from the private organisation database. Public demo and private data are not intermingled.
- No live natural-language model has been integrated. Topic labels, tone tags and operational observations in the demo are synthetic/rule-based.
- Only the underlying report-job and report-sharing flows have been implemented; an authenticated real office invited to the current private project has **not** been end-to-end tested because no authentication users or office assignments are currently present.
- The public browser site is not automatically updated. Publishing the ZIP is still required.
- Authentication → URL Configuration must include `https://j1997sh.github.io/meta-reporting-demo/` and `https://j1997sh.github.io/meta-reporting-demo/**` before production sign-in.
- Supabase's security advisor continues to flag the pre-existing one-time activation function as a privileged callable function. This is an intentionally code-gated bootstrap endpoint, but it deserves an additional independent review before real constituent data is imported.
- Automatic email delivery and live Meta API ingestion are not part of this release.

## Local validation performed

- `node --check` verified all modified application JavaScript syntax.
- Chromium local smoke tests exercised the HQ Intelligence, Social Listening, Office Insights, Action Centre, Meeting Packs, MP office overview, Page analytics, conversations and report interface; no JS errors under mocked/offline API responses.
- Browser interaction smoke tests checked creation of an editable HQ meeting-pack template, navigation switching to MP office, and preventing office-mode navigation to HQ pages.
- Verified Supabase schema, seeded record counts, anonymous visibility limited to fictional records, and security advisor results.

This is an operational **demonstration and integration foundation**, not a validated real-data Facebook intelligence service.
