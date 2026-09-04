# school-projects

This is the start of a place to house our family's digital homeschool projects.

## Research reports

HTML research reports from the Research Assistant bot live in `reports/` and are listed from `data/reports.json` (not `data/links.json`).

**Drop-and-publish**

1. Save the report as a self-contained HTML file in `reports/` named `YYYY-MM-DD-topic-slug.html`.
2. Append an entry to `data/reports.json` with at least `title`, `date` (ISO, e.g. `2026-09-04`), and `path` (e.g. `reports/2026-09-04-topic-slug.html`). Optional fields: `summary`, `tags`.
3. Commit and push to `main`. GitHub Pages deploys the site; the new report appears in the Research Reports section on the home page and on `reports.html`.