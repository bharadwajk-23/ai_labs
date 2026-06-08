# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static AI project portfolio — a React + TypeScript SPA (Vite) that displays a catalog of AI projects, each with a detail view. Data lives entirely in `src/data/projects.json`; no backend. See `plan.md` for the full architecture blueprint.

## Commands

Once scaffolded, the standard commands will be:

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server
npm run build        # production build
npm run preview      # preview production build
npm run lint         # ESLint
```

To run a single Vitest test file:
```bash
npx vitest run src/hooks/useProject.test.ts
```

## Architecture

### Data Model

`src/data/projects.json` is the sole data source, typed by `src/data/schema.ts`:

```ts
interface Feature { name: string; description: string; }
interface Project {
  id: string;          // lowercase hyphen-separated slug, e.g. "ml-demand-forecasting"
  title: string;
  description: string;
  client: string;
  demo_url: string;
  highlights: string[];
  features: Feature[];
}
```

**Static import only** — `import projects from '../data/projects.json'` (not `fetch()`). Data is inlined at build time; no loading/error states needed. Switch to fetch only if the JSON must be updatable without a rebuild.

### Data Flow

```
projects.json
    └── useProjects() / useProject(id)   ← src/hooks/
            ├── CatalogPage   ──props──▶  ProjectTile[]
            └── ProjectDetailPage  ──props──▶  FeatureCard[], HighlightList
```

- `src/hooks/` owns the data access boundary — no component imports JSON directly.
- `src/components/` are pure render units — no data fetching.
- `src/pages/` own routing context and call hooks.
- No global state manager; if filtering is added, use `useReducer` inside `CatalogPage`.

### Routing

```
/                  → CatalogPage
/projects/:id      → ProjectDetailPage
/*                 → NotFound
```

The router lives in `src/router/index.ts`. React Router `useParams()` extracts `id`; pass it to `useProject(id ?? '')` and render `<NotFound>` if the result is `undefined`.

### Key Implementation Notes

- `ProjectTile` derives a color accent from `id` via `hsl(charCodeSum % 360, 60%, 50%)` — no image assets needed.
- `ExternalLink` always sets `target="_blank" rel="noopener noreferrer"` and validates that `href` starts with `http`.
- IDs in `projects.json` must be lowercase hyphen-separated slugs. Enforce this at data-authoring time (not runtime).
- `React.memo` on `ProjectTile` is appropriate since it receives stable primitive props from a static array.
- Beyond ~50 projects, split JSON per project and use dynamic `import(`../data/projects/${id}.json`)` in `useProject`.

### Styling

Use CSS Modules or scoped CSS with design tokens in `src/styles/tokens.css`. Avoid global utility-class frameworks unless Tailwind purging is configured. Use the system font stack unless a specific font is required.

### Deployment

Fully static — deploy to any CDN. Configure the CDN to serve `index.html` for all unmatched routes (SPA fallback).
