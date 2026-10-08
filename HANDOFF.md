# Website Migration Handoff

This document describes the OSG website conversion (legacy Jekyll → Next.js) — what was
built, why, and the conventions to follow. It is written for **two audiences**:

1. **You** — read **Part 0** first. It explains how to work *with* Claude
   effectively so you don't have to learn everything by hand.
2. **Claude** — feed this whole file in as the starting context when you begin the *next*
   site's migration. Everything after Part 0 is the institutional knowledge from the OSG
   migration that transfers to the next one.

---

# Part 0 — How to guide Claude (read this first)

You're inheriting a migration that was done almost entirely by pairing with Claude (Claude
Code, the terminal agent). The single most valuable thing handed to you is **the working
relationship and the conventions** below — not just the code. Here's how to get good results.

## Start every session by giving Claude its bearings

Claude starts each session with no memory of the last one *except* what's written down.
Two mechanisms keep it oriented — make sure both are healthy:

- **`CLAUDE.md`** (repo root or `~/.claude/CLAUDE.md`): standing instructions Claude reads
  every session. Put hard rules here ("don't add npm modules without asking", "use MUI for
  UI", "static export only").
- **The memory file**: this project accumulated a long, dated migration log
  (`.claude/projects/.../memory/osg-jekyll-to-nextjs.md`). It's the single best record of
  *why* decisions were made. Ask Claude to **keep a running log like this for the new site** —
  one dated entry per phase. It is what made this handoff possible.

When you start the new migration, literally paste this file in and say: *"This is how the
last site's migration went. Set up the same conventions and start a migration log for the
new site."*

## Give Claude the source of truth, explicitly

The biggest lever on quality was telling Claude exactly **where the legacy content lives**
and **what to use as a design template**. For OSG that was three local repos:

- the legacy site (source of truth for *content*),
- a sibling already-modern site to copy patterns/templates from,
- and the new repo itself.

Do the same: clone all relevant repos side-by-side and tell Claude their paths up front.

## Work in phases, and verify each one

This migration succeeded because it was sliced into ~13 small phases (one section at a
time: news, events, services, header, footer…), each ending with a green build. Don't ask
for "migrate the whole site" in one go. Ask for one section, **review it**, then move on.

- After each chunk, have Claude run the build (`npx next build`) and report it green.
- **Visually check things in a browser yourself.** Claude often can't see the rendered
  page — large parts of the styling work here are marked "build-verified only, not visually
  verified." A build passing ≠ it looks right. This is the #1 outstanding risk.

## Be decisive about constraints — Claude will respect them

The cleanest parts of this codebase came from firm constraints the user set and Claude
followed: *no new dependencies without asking*, *replicate the old JS as typed React (don't
reuse it)*, *explicit pages not dynamic routes for content*. State your constraints clearly
and Claude will hold the line across sessions (because they're written in `CLAUDE.md`).

## Practical tips

- **Let Claude run the build and read its own errors.** It's good at fixing what it can see.
- **When something's ambiguous, ask Claude to propose options rather than guess.** It will.
- **Don't approve compound shell commands blindly** — the user's global rule here is to avoid
  them so each step is reviewable.
- **If Claude does something you disagree with, say so plainly and ask it to record the
  correction in memory.** It learned from corrections throughout (e.g. it tried converting
  the stats display to tiles, the user said "no, keep the narrative," and that's now a
  permanent note).
- **Trust but verify the migration coverage tool**, not your gut, for "did we get
  everything?" (see `scripts/compare-migration.mjs` below).

---

# Part 1 — What this project is

The OSG website was rebuilt from a legacy **Jekyll** site into a modern **Next.js** app.

- **Framework:** Next.js 16 (App Router) with **static export** (`output: 'export'` → `out/`).
  There is no running server in production; everything is pre-rendered HTML at build time.
- **UI:** Material UI (MUI) v7 + `@chtc/web-components` (shared CHTC component/theme library).
- **Language:** TypeScript, `strict: true`.
- **Data fetching:** at **build time** in Server Components (from GitHub APIs + Elasticsearch
  + topology JSON); client-side interactivity uses **SWR**.
- **Charts:** chart.js. **Markdown/MDX:** react-markdown + `@next/mdx`.

Code-style rules live in **`.ai/instructions.md`** — read it. Key points: App Router only,
Server Components by default with `'use client'` islands for interactivity, `sx` prop for
styling, reusable components in PascalCase dirs with a barrel `index.ts`, page-local
components in `_components/`.

## Repo layout

```
app/            Routes, layouts, pages (App Router). MDX content pages live here too.
  _components/  Page-local presentational components for the homepage.
components/     Reusable components (PascalCase dir + index.ts barrel each).
utils/          Data layer + helpers (adstash, articles, events, github, staff, slug…).
types/          Shared TS types (@/types).
scripts/        Build/redirect/migration tooling (.mjs, some run under tsx).
public/         Static assets (images, data JSON, pelican service worker).
static-redirects.json   Hand-maintained redirect list (single source of truth).
mdx-components.tsx       Maps markdown elements → MUI components.
.ai/instructions.md     Code-style rules.
```

## Build & run

```bash
npx next build        # type-check + static export to out/  (quick verify)
pnpm build            # FULL pipeline: prebuild (pelican SW) + build + postbuild
pnpm dev              # dev server (Turbopack)
pnpm compare:migration  # coverage report vs the legacy site
```

`postbuild` runs: image optimizer → sitemap → `generate-redirects.mjs`.
Note: `npx next build` **skips** `prebuild`/`postbuild`. Use `pnpm build` for the real thing
(the Pelican download service worker must be in `public/`, and redirects are generated in
postbuild).

---

# Part 2 — Key design decisions (these transfer to the next site)

These are the choices that shaped the codebase. Carry the *reasoning* forward even if the
specifics differ.

### Static export, data fetched at build time
`output: 'export'` means no on-demand rendering. Every dynamic page must be enumerated at
build via `generateStaticParams`, and all its data fetched at build time. This is why the
build makes hundreds of network calls (GitHub + Elasticsearch) and why detail pages are
**async Server Components** that bake real numbers into the HTML (good for SEO). Interactive
*listing* pages stay client-side with SWR.

### Content collections = explicit pages, NOT dynamic `[...slug]` routes
The user strongly preferred one explicit `app/<col>/<slug>/page.mdx` per content page over a
single dynamic catch-all. More files, but each is greppable, individually styleable, and
obvious. **Avoid `[...slug]` for content collections on the next site too** unless asked.

### Replicate legacy JS as typed React/TS — don't reuse the old objects
The legacy site had hand-written JS (e.g. for Elasticsearch stats). Rather than import it,
it was **re-implemented** as typed TS in `utils/` and React components. Cleaner, type-safe,
maintainable.

### No new dependencies without asking
A hard constraint. The dependency list was kept deliberately small (MUI, chart.js, swr,
mdx, react-markdown, gray-matter, js-yaml). Anything new required explicit user approval
(e.g. the Pelican file-browser packages, added only because the user insisted it was the
most important feature). **Honor this on the next site.**

### Redirect system: a JSON file → generated static stubs
`static-redirects.json` (array of `{source, destination, text?}`) is the single source of
truth for hand-maintained redirects. `scripts/generate-redirects.mjs` writes a static
meta-refresh HTML page at each source path into `out/`. Chosen over Next's `redirects()`
because static export can't do server redirects, and sources include `.html` URLs and paths
under existing route namespaces. **Article/event redirects are generated dynamically** at
build (from the live content sources) by `scripts/content-redirects.mjs` — so legacy
date-less URLs resolve to the new dated permalinks.

### Theme: extend the base theme, don't replace it
`app/theme.ts` does `createTheme(baseTheme, {...})` over the `@chtc/web-components` OSG theme
— keeping brand colors but layering modern tokens (heading weights, border radius 12,
off-white background, component defaults). Don't fork the whole theme; extend it.

### Data layer centralized in `utils/`
- `utils/adstash.ts` — typed Elasticsearch/GRACC/topology client (OSG accounting data). Has
  **retry-with-backoff** on ES queries (`elasticSearch()`) because the CI build was flaking
  on single timeouts among ~390 per-entity queries. **If the next site's build flakes on
  other build-time fetches, give them the same retry treatment.**
- `utils/articles.ts`, `utils/events.ts`, `utils/github.tsx` — pull content at build time
  from shared CHTC GitHub repos, filtered to the org (`'osg'`).
- `utils/slug.ts` — `slugify()` (NFKD + strip diacritics). Dynamic route folders must use
  slugs, not `encodeURIComponent` of raw names — raw names with spaces/accents/commas don't
  resolve reliably on static hosts.

---

# Part 3 — Gotchas (hard-won; will bite you again)

- **MUI + `next/link` in Server Components:** never pass `component={Link}` (a function) to a
  MUI component from a Server Component — the static-export prerender fails. Wrap with
  `next/link`'s `<Link>` or use `href` directly.
- **MDX escaping:** in `.mdx`, escape literal `<` → `&lt;` and `{` / `}` → `\{` / `\}`, or MDX
  parses them as JSX/JS expressions and the build breaks.
- **Empty YAML fields parse to `null`:** an empty `links:` becomes `null`, which breaks
  components expecting `[]`. Coalesce with `?? undefined` in the util mappers.
- **Unquoted YAML dates** (`start_date: 2024-08-05`) parse to JS `Date` and drift by timezone.
  Normalize to `YYYY-MM-DD` via UTC.
- **Build flakiness:** transient `ENOTFOUND` / `ETIMEDOUT` on build-time fetches — a re-run
  usually succeeds. ES queries already retry; other fetches don't yet.
- **`npx next build` ≠ `pnpm build`:** the former skips pre/post build steps (service worker,
  redirects). Use `pnpm build` when you need the full output.
- **Stale `.next` cache:** if tsc complains about `.next/dev/types` LayoutRoutes after route
  changes, `rm -rf .next` and rebuild.
- **Global anchor reset:** `app/globals.css` resets `a { color: inherit; text-decoration:
  none }` — a root-cause fix for third-party components (e.g. `ArticleCard`) rendering
  blue/underlined links. Affects all links site-wide; add affordance explicitly.

---

# Part 4 — The migration, phase by phase (summary)

The full dated log lives in the project memory file. Condensed history:

1. **Content sections** — presentations, news, user-stories (later → spotlights), team.
   Pulled at build from shared CHTC GitHub repos, filtered to `'osg'`.
2. **Events** — listing + detail pages from the `CHTC/events` repo.
3. **Redirect system** — `static-redirects.json` + generator script.
4. **Home page** — hero, intro cards, news/events/spotlights rows, maps grid, support.
5. **Services** — OSPool (overview/projects/institutions), OSDF (overview/projects/data/
   alphafold), facilitation, access-point. Legacy JS re-implemented as typed TS; live
   Elasticsearch stats.
6. **Content pages + small collections** — static MUI pages + MDX collections (about,
   community, organization).
7. **QA sweep** — audited legacy vs new, filled gaps, decommissioned-notice pages.
8. **Full header navigation** + `/user-stories` → `/spotlights` rename.
9. **Header completion + style modernization** — opinionated theme refresh across all
   surfaces. **Build-verified only — still needs a browser pass.**
10. **Detail pages** — project/institution modals replaced with statically-generated,
    SEO-friendly dedicated routes (async Server Components).
11. **Align to `.ai/instructions.md`** — component dir+barrel structure, ESLint via CLI, etc.
12. **Footer rebuild** — replaced the shared footer with an OSG one matching legacy.
13. **Pelican "Data Repositories" feature** — ported into `/services/osdf/data`.

**Migration coverage tool:** `pnpm compare:migration` (`scripts/compare-migration.mjs`)
diffs the legacy site against `out/`, accounts for redirects, and writes the missing-URL
list to `migration-missing.txt`. Use this — not intuition — to answer "did we migrate
everything?" Latest run: ~67% direct coverage; nearly all "missing" URLs are old
content-collection entries with no current equivalent (retired articles/events not in the
OSG-filtered sources).

---

*Generated as a starting point for the next migration. When you begin the new site, paste
this in, set up `CLAUDE.md` + a migration log, point Claude at the source repos, and work in
verified phases.*
