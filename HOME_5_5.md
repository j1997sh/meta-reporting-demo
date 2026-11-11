# META Reporting 5.5 — Home priorities

The homepage now prominently presents a Weekly Community Brief and a Your Colleagues module before the KPI grid.

The demonstration Weekly Community Brief uses fictional daily topic aggregates covering 25–31 October 2026. A private workspace without verified comment data displays an unavailable state rather than invented numbers.

The colleagues module shows the user's Page alongside a privacy-preserving colleague median, with **N out of N** reporting the number of office datasets included, *not an overall ranking of MPs*. The underlying API service remains `meta-peer-benchmarks`. No other office identities are shown.

No Supabase schema changes are required. These modifications are client-side and preserve the existing Report Studio, analytics and navigation.

Upload all files inside this ZIP to the root of the existing GitHub repository. Ensure `home-priorities.js` and `home-priorities.css` are included.
