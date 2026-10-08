# OSG Website — Jekyll → Next.js Migration Handoff

This document is the starting point for whoever continues the migration of the OSG
Consortium website from the legacy Jekyll site to this Next.js app. It captures **what
was built, why, and how to keep going** — and it's written so you can hand it (or point
Claude) at it at the start of a session.

> **Status:** the migration is essentially complete. The site builds as a static export
> (~230+ pages) covering the home page, events, news, user stories, presentations, team,
> all services (OSPool, OSDF, Facilitation, Access Point), the data-driven institution/
> project explorers, the section/content pages, the small content collections (MDX), and
> a redirect system for legacy URLs. What remains is polish, parity-checking, and a couple
> of deferred interactive pieces (see **§9**).

---

## Part 1 — For the intern: how to work with Claude on this project

### 1.1 Get set up
```bash
# install the Claude Code CLI (macOS)
curl -fsSL https://claude.ai/install.sh | bash

# the project
cd /Users/clock/WebstormProjects/osg-website
pnpm install
```
You also need the two reference repos checked out as **siblings** of this one (the data
audit + content source depend on them):
- `../osg-htc.github.io` — the **legacy Jekyll site** (source of truth for content).
- `../PelicanPlatform.github.io` — the **Pelican site**, used as the React/Next template.

### 1.2 Start a Claude session
```bash
claude            # start; or `claude --resume` to pick a past CLI session
```
> Sessions from the desktop/web app do **not** show up in the CLI's resume picker (they
> keep separate histories), but that's fine: Claude auto-loads the project memory at
> `~/.claude/projects/<this-project>/memory/MEMORY.md`, and all the real state is the code
> + this file. Just tell it to read this doc.

**A good first prompt:**
> "Read `MIGRATION_HANDOFF.md` and `MEMORY.md`, then run `pnpm compare:migration` to see
> what legacy pages still aren't migrated. Propose a plan before changing anything."

### 1.3 How to prompt Claude well (the loop that worked here)
For each page you migrate, give Claude four things:
1. **The source** — the legacy file, e.g. `../osg-htc.github.io/_services/ospool/index.html`
   (and any JS it loads from `../osg-htc.github.io/assets/js/...`).
2. **The target route** — e.g. "build it at `/services/ospool`".
3. **A sibling to copy the style from** — e.g. "match `app/contact/page.tsx`" or
   "for data tables follow `components/FacilityExplorer`".
4. **The guardrails** (below).

Then **verify**: `pnpm build` (or run the dev server and look). Don't trust "it should work."

### 1.4 Guardrails — paste these into Claude
> - Use **Material UI** components for everything; no other UI kit.
> - **Don't add npm packages** unless I approve it. The allowed set is already installed
>   (MUI, chart.js, SWR, MDX, react-markdown, gray-matter). Charts = **chart.js**.
> - **Replicate** the legacy page's JavaScript as typed React/TypeScript — don't copy the
>   old JS files or use gridjs/lunr/jQuery.
> - Small content pages (about / community / organization / decommissioned notices) are
>   **explicit MDX pages** at `app/<path>/page.mdx` — **never** dynamic `[...slug]` routes.
> - This is a **static export** (`output: "export"`). Two recurring traps:
>   - Never pass `component={Link}` to an MUI component from a Server Component — wrap the
>     child in `next/link` `<Link>` or use the component's own `href`. (Otherwise the build
>     fails: "Functions cannot be passed directly to Client Components".)
>   - In MDX, escape literal `<` as `&lt;` and literal `{`/`}` as `\{`/`\}` (MDX parses them
>     as JSX/JS).
> - Live data is fetched **client-side** (SWR) for things that should stay current; content
>   from GitHub repos is fetched **at build time**. Don't bake live stats into static HTML.

### 1.5 The one command that answers "are we done?"
```bash
pnpm build              # produces the static export in out/
pnpm compare:migration  # compares ../osg-htc.github.io/_site vs ./out, lists missing URLs
```
`scripts/compare-migration.mjs` canonicalizes URLs (so `/news.html`, `/news/`, and
`/news/index.html` all match) and treats a legacy page as "covered" if the new export has a
real page **or** a redirect stub at that URL. Use `--ignore '/assets/**'` etc. to filter
noise. **This is the migration scorecard — run it whenever you want to know what's left.**

---

## Part 2 — Project overview

The OSG website is moving off Jekyll onto **Next.js (App Router) + Material UI**, deployed
as a **static export**. Most page *content* still originates from the OSG ecosystem (shared
GitHub repos and live accounting endpoints) rather than being hard-coded, so the Next site
pulls it in at build time or at runtime.

**Three repos, three roles:**
| Repo | Role |
| --- | --- |
| `osg-website` (this) | The new Next.js site. Edit here. |
| `osg-htc.github.io` | Legacy Jekyll site. **Read-only** source of content + the JS we re-implement. |
| `PelicanPlatform.github.io` | A sibling project already on Next.js; used as the pattern/template. |

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
MUI 7 (`@mui/material`, `@mui/icons-material`) · `@chtc/web-components` (shared cards/themes)
· chart.js (graphs) · SWR (client fetching) · MDX (`@next/mdx`) for content pages ·
`next-image-export-optimizer` (images) · `@pelicanplatform/web-client` + `components` (the
OSDF data file browser). Style rules live in **`.ai/instructions.md`**.

---

## Part 3 — Architecture & conventions

### 3.1 Routing & file layout
- `app/` — App Router routes. A folder with `page.tsx` (or `page.mdx`) is a route.
- `components/<Name>/<Name>.tsx` + `index.ts` barrel — one component per folder.
- `utils/` — data fetching + helpers (the "backend" of the static site).
- `public/images/...` — assets copied from the Jekyll repo's `assets/images`.
- `redirects.json` + `scripts/generate-redirects.mjs` — legacy-URL redirects.
- Route-private helpers live in a `_components/` subfolder (e.g.
  `app/services/osdf/_components/MiniBarHeading.tsx`) — the `_` opts it out of routing.

### 3.2 Data layer — build-time vs client-time (important mental model)
- **Build-time (Server Components, baked into HTML):** content pulled from GitHub via the
  REST/raw API. See `utils/{github,articles,presentations,events,staff,collections,
  dataRepositories}.ts`. Used for news/user-stories/spotlights, presentations, events,
  team, OSDF data repositories, MDX collections.
- **Client-time (Client Components + SWR, fetched in the browser):** anything that should
  reflect *live* numbers — OSPool/OSDF usage stats, project/institution/facility tables and
  charts. See `utils/adstash.ts` and the `components/services/**` explorers. These query
  Elasticsearch/GRACC/topology directly from the browser (those endpoints are CORS-open).

### 3.3 Components worth knowing
- `components/Header/*` + `components/Footer/*` — global chrome; nav configured in `app/layout.tsx`.
- `components/services/ServiceNav` — the dark per-service sub-nav bar (OSPool/OSDF/Facilitation), wired via each service's `layout.tsx`.
- `components/services/PieChart` — thin chart.js wrapper (top-N + "Other").
- `components/FacilityExplorer` — reusable searchable/sortable MUI table + detail for facilities (used by `/institutions` and `/campus-cyberinfrastructure` via a `ccStarOnly` prop).
- `components/services/ospool/{ProjectsExplorer,InstitutionsExplorer}` and
  `components/services/osdf/OsdfProjectsExplorer` — the data explorers (table + charts + detail).
- `components/MarkdownContainer` — renders a markdown **string** via react-markdown + rehype-raw (used where content is fetched as markdown, e.g. event bodies, OSDF repo descriptions). Distinct from MDX pages.
- `components/CollectionPage` — shared shell for collection content.
- `mdx-components.tsx` (repo root, required by `@next/mdx`) — maps markdown elements to MUI (Typography/Link/Box) and wraps each MDX page in a `Container`. **This is what makes `.mdx` pages look like the rest of the site.**

### 3.4 Theming & branding
- Theme: `@chtc/web-components/themes/osg` (primary = OSG gold `#f6a32a`; secondary = dark navy). Applied in `app/layout.tsx`.
- Header uses the OSG logo (`public/logos/osg.svg`) on a `secondary`-colored (navy) AppBar; title "OSG Consortium". Mobile drawer matches.

### 3.5 Redirects (legacy `.html` URLs & pointers)
Static export can't use `next.config` `redirects()`, so: add `{source, destination, text?}`
entries to **`redirects.json`**, and `scripts/generate-redirects.mjs` (run in `postbuild`)
writes a meta-refresh HTML page at each source path into `out/`. It preserves exact URLs
(`/foo.html` → file, else `/index.html`), supports absolute + relative destinations, and
**skips any source that collides with a real page**. Use redirects for old `.html` URLs,
pointer/short-link pages, and form redirects.

---

## Part 4 — What's been built (route map)

| Area | Routes | Source / data |
| --- | --- | --- |
| Home | `/` | `index.html`; articles + upcoming events |
| Events | `/events`, `/events/[...slug]` | `CHTC/events` repo |
| News | `/news`, `/news/[...slug]` | `CHTC/Articles` (type `news`) |
| User stories | `/user-stories/[...slug]` | `CHTC/Articles` (type `user`) |
| Spotlights | `/spotlights`, `/spotlights/[...slug]` | `CHTC/Articles` |
| Presentations | `/presentations`, `/presentations/[...slug]` | `CHTC/Presentations` |
| Team | `/team` | `chtc/staff-list@init-staff-list` |
| OSPool | `/services/ospool` (+ `/projects`, `/institutions`) | adstash ES + topology |
| OSDF | `/services/osdf` (+ `/projects`, `/data`, `/data/[id]`, `/alphafold`) | adstash ES, fabaid.io, local JSON |
| Facilitation | `/services/facilitation` (+ `/monthly-training`) | staff list + events |
| Access Point | `/services/access-point` | static |
| Institutions / Projects | `/institutions`, `/institutions/[name]`, `/projects/[name]`, `/campus-cyberinfrastructure` | GRACC + topology |
| Content pages | `/contact`, `/branding`, `/code-of-conduct`, `/newsletter`, `/covid-19` | hand-written MUI |
| Collections (MDX) | `app/{about,community,organization,campus,pointers}/**/page.mdx` | converted from `_about`/`_community`/`_organization` |
| Decommissioned notices | `/myosg-decommissioned`, `/osg-twiki-decommissioned`, `/ticket-decommissioned`, `/voms-decomissioned`, `/outage` (MDX) | legacy `.md` |

Per-entity pages (`/projects/[name]`, `/institutions/[name]`, `/services/osdf/data/[id]`)
are generated via `generateStaticParams` from the data lists; names are slugified for the
URL with `utils/slug.ts` and recovered from the data at render time.

---

## Part 5 — Key design decisions & rationale

1. **Static export (`output: "export"`).** Matches the Pelican site and GitHub Pages hosting.
   Consequence: no server runtime — redirects, "live" data, and per-entity pages all had to be
   solved without it (hence the redirect generator, client-side SWR, and `generateStaticParams`).
2. **Replicate legacy JS in TypeScript; don't reuse it.** The Jekyll pages used hand-rolled
   ES modules + gridjs + lunr + a bespoke chart wrapper. We re-implemented the *behavior* with
   MUI tables (sort/search/paginate), plain client-side substring filtering (replaces lunr), and
   chart.js (replaces the custom pie chart). Keeps one consistent component vocabulary.
3. **No-new-modules rule.** Deliberate constraint to keep the bundle lean and the codebase
   consistent. The only graph lib is chart.js. (The one sanctioned exception is
   `@pelicanplatform/web-client`/`components` for the OSDF **data file browser**, which needs a
   service worker copied into `public/` via `scripts/copy-pelican-sw.mjs` in `pre(dev|build)`.)
4. **Data sources kept centralized, not copied.** Content lives in shared CHTC GitHub repos and
   live accounting endpoints; we fetch rather than fork it, so the OSG team keeps a single source
   of truth. The `'pelican'` publish/org filter from the template was swapped to `'osg'`.
5. **Build-time vs client-time split.** Editorial content (articles, events, staff, repos) is
   baked at build; usage statistics are fetched live in the browser so they stay current without
   rebuilding.
6. **Content collections as explicit MDX pages, not a dynamic catch-all.** Early on a `[...slug]`
   renderer was tried; we switched to one `page.mdx` per doc because it's transparent, individually
   tailorable, and consistent with the rest of the hand-authored site. `mdx-components.tsx` gives
   them site styling for free.
7. **Redirects as data + a generator** (see §3.5) rather than per-page redirect components — one
   `redirects.json` is easy to audit and extend, and handles the `.html` URLs a Next route can't.
8. **`compare-migration.mjs` as the definition of "done."** Parity is measured against the legacy
   `_site` build, not guessed.

---

## Part 6 — External data sources (reference)

| What | Endpoint / repo |
| --- | --- |
| Presentations | GitHub `CHTC/Presentations` (raw API) |
| Articles (news / user / spotlights) | GitHub `CHTC/Articles` |
| Events | GitHub `CHTC/events` |
| Staff / team / facilitators | GitHub `chtc/staff-list` @ `init-staff-list` |
| OSPool usage stats & per-project/institution | Elasticsearch (adstash) `https://elastic.osg.chtc.io/q`, index `ospool-summary-*` |
| Facility usage (institutions / CC*) | GRACC `https://gracc.opensciencegrid.org/q`, index `gracc.osg.summary` |
| Topology metadata | `https://topology.opensciencegrid.org/miscproject/json` and `/miscfacility/json` |
| OSDF data repositories | `https://fabaid.io/data/data-repositories.json` (keyed by id) |
| OSDF valid namespaces | `public/data/valid-namespaces.json` |
| AlphaFold cache stats | `public/data/alphafold-caching.json` (local) |
| Maps | `map.osg-htc.org` iframes |

All the query logic is centralized in **`utils/adstash.ts`** (ES/GRACC/topology) and
`utils/dataRepositories.ts` (OSDF repos). Add new queries there, not in components.

---

## Part 7 — Gotchas / pitfalls (these cost real time)

- **`component={Link}` from a Server Component → build failure.** Wrap children in `<Link>` or use `href`. This recurred on nearly every page.
- **MDX is strict.** Escape literal `<` (`&lt;`) and `{`/`}` (`\{`/`\}`) in prose; convert raw HTML to markdown (MDX treats tags as JSX). `react-markdown` (string renderer) tolerates raw HTML; **MDX does not**.
- **YAML frontmatter quirks:** unquoted dates (`2024-08-05`) parse to JS `Date` — normalize to `YYYY-MM-DD` via UTC (`toISODate` in `utils/events.ts`); empty fields (`keywords:`) parse to `null` — coalesce with `?? undefined` so component array-defaults apply.
- **`generateStaticParams` must return param objects** (`{ slug }`), not full data objects, or static export errors with "missing param".
- **`next build` wipes `out/`** each run, so generated redirect files don't accumulate — but it also means you must rebuild before `compare:migration`.
- **GitHub API rate limits** during build — set `GITHUB_TOKEN` in the environment to avoid flaky builds (the raw-file fetch sends it if present).
- Dev server config lives in `.claude/launch.json` (`osg-dev`); a stale `next dev` can hold `.next/dev/lock` — kill it before restarting.

---

## Part 8 — Build, run, deploy

```bash
pnpm dev                 # local dev (Turbopack); predev copies the Pelican SW
pnpm build               # next build → static export in out/  (postbuild: image optimizer,
                         #   sitemap, then generates redirect stubs)
pnpm lint                # eslint
pnpm compare:migration   # migration coverage report vs ../osg-htc.github.io/_site
npx tsc --noEmit         # typecheck
```
Env: `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_MATOMO_URL`, `NEXT_PUBLIC_MATOMO_SITE_ID`,
`HOSTNAME` (see `.env`); optional `GITHUB_TOKEN` for higher API limits.

---

## Part 9 — What's left / known gaps

Run `pnpm compare:migration` for the authoritative list. Known items:
- **Interactive Leaflet institutions/OSDF map** (legacy `_organization/iframe.html`) — the most
  custom interactive piece; verify the current map embeds vs. a full interactive map.
- **Parity pass** — diff each migrated page against the legacy `_site` output for content fidelity
  (the comparison tool finds *missing URLs*, not wording differences).
- **Spot-check live-data pages** — the ES/GRACC queries depend on field names; if an endpoint
  changes, the explorers degrade. Confirm they still populate.
- **`redirect_from` aliases** on some legacy pages may still need entries in `redirects.json`.
- **Accessibility / responsive QA** across the data tables and the home page.

---

*Generated as a migration handoff. The richest running notes are in this project's Claude
memory (`MEMORY.md` → `osg-jekyll-to-nextjs.md`), which Claude loads automatically.*
