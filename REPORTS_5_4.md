# META Reporting 5.4 — Detailed Reports

A report-design upgrade for the existing GitHub Pages demo. This replaces neither the underlying database nor the authentication system.

## How to use

1. Open **Reports → Report Studio → Create report**.
2. Under **Start with a complete report**, choose Executive performance review, MP monthly performance report, Content & video review, Paid media review, or Community conversation review.
3. Choose the Page and reporting period at the top of the website, then inspect the report canvas. Rename, reorder, duplicate or delete any section.
4. Use **Print / PDF** to create a print-oriented report, or **Export PowerPoint** for a multi-slide editable deck. Save the template when satisfied.

## What's new

- Professional title/cover page, numbered sections and coherent report-page hierarchy.
- 13 richer sections, including performance scorecard, daily audience history, content-format analysis, interaction breakdown, video detail, up to 20 top posts, geography, community themes, campaign tables, account summary and methodology.
- Self-contained native editable PowerPoint slides rather than a single slide trying to display a long report preview.
- Correct data mapping for Photo / Video / Link / Text fictional posts.
- Daily follower history plotted from recorded follower snapshots rather than using an unrelated metric.
- Print styles with intentional page breaks and repeatable report source notes.

## Data/technical limitations

- This is a fictional demonstration. No Meta OAuth or authenticated Meta Insights import is enabled.
- Public report templates use local demonstration state. Sign-in enables cloud storage for template layouts, but the scheduled cloud report worker is separate and currently retains its own simpler export implementation: it has **not** been upgraded to match all rich report blocks.
- This upgrade is intended for the interactive Report Studio's PowerPoint and browser PDF/print exports. The server-generated cloud exports should be upgraded separately to ensure parity.
- Any comment discussion presented in reports uses loaded fictional aggregate topic data. If it is missing, a clearly labelled unavailable message is shown.
- Calculated engagement / post and other rates are descriptive, not causal explanations.

## File changes

Added `report-pro.js` and `report-pro.css`; added references to these files at the end of `index.html`. All previous files retained.
