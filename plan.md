# AI Project Portfolio — Architecture Blueprint

---

## 1. Application Architecture & Folder Structure

```
/ai-portfolio
├── /public
│   └── favicon.ico
├── /src
│   ├── /data
│   │   ├── projects.json          # Master project catalog
│   │   └── schema.ts              # TypeScript interface definitions
│   │
│   ├── /assets
│   │   └── /images                # Any static imagery (optional)
│   │
│   ├── /components                # Reusable, stateless UI primitives
│   │   ├── /ui
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   └── ExternalLink.tsx
│   │   ├── ProjectTile.tsx        # Card for catalog grid
│   │   ├── FeatureCard.tsx        # Individual feature row/card
│   │   ├── HighlightList.tsx      # Renders highlights[]
│   │   └── NotFound.tsx           # 404 / project-not-found state
│   │
│   ├── /layouts                   # Shell wrappers, not page logic
│   │   ├── RootLayout.tsx         # Nav + footer shell
│   │   └── ContentLayout.tsx      # Max-width + padding wrapper
│   │
│   ├── /pages  (or /views)        # Route-level containers (smart)
│   │   ├── CatalogPage.tsx        # Home — grid of ProjectTiles
│   │   └── ProjectDetailPage.tsx  # Slug-driven detail view
│   │
│   ├── /hooks
│   │   ├── useProjects.ts         # Returns full project list
│   │   └── useProject.ts          # Returns single project by id
│   │
│   ├── /router
│   │   └── index.ts               # Route definitions
│   │
│   ├── /styles
│   │   ├── tokens.css             # Design tokens (colors, spacing)
│   │   └── global.css
│   │
│   └── main.tsx                   # App entry point
│
├── tsconfig.json
├── package.json
└── vite.config.ts  (or next.config.js / astro.config.mjs)
```

**Key separation principle:** `/components` owns no data-fetching logic — they are pure render units. `/pages` own routing context and data retrieval. `/hooks` own the data access boundary.

---

## 2. Data Flow & State Management

### JSON Import Strategy

For a fully static, local-file-driven app, **static import is preferred over `fetch()`**:

```ts
// src/data/schema.ts
export interface Feature {
  name: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  demo_url: string;
  highlights: string[];
  features: Feature[];
}
```

```ts
// src/hooks/useProjects.ts
import projects from '../data/projects.json';
import type { Project } from '../data/schema';

const typedProjects = projects as Project[];

export function useProjects(): Project[] {
  return typedProjects;                    // synchronous, no loading state needed
}

export function useProject(id: string): Project | undefined {
  return typedProjects.find(p => p.id === id);
}
```

**Why static import over fetch:** No async lifecycle, no loading/error states, zero network round trips, and the bundler tree-shakes unused fields. The JSON is inlined at build time.

### When to use fetch() instead

Switch to `fetch('/data/projects.json')` only if the catalog must be **updatable without rebuilding** (e.g., a CMS pipeline drops a new JSON file to `/public`). In that case:

```ts
// Async hook pattern — only adopt when runtime updates are required
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    setStatus('loading');
    fetch('/data/projects.json')
      .then(r => r.json())
      .then(data => { setProjects(data); setStatus('idle'); })
      .catch(() => setStatus('error'));
  }, []);                                  // empty deps — fetches once on mount

  return { projects, status };
}
```

### State Distribution

No global state manager (Redux, Zustand, etc.) is warranted at this scale. The data flows as:

```
projects.json
    └── useProjects() / useProject(id)
            ├── CatalogPage  ──props──▶  ProjectTile[]
            └── ProjectDetailPage  ──props──▶  FeatureCard[], HighlightList
```

If the project list grows large enough to warrant filtering/search, a single `useReducer` inside `CatalogPage` handles that locally without lifting state further.

---

## 3. Dynamic Routing Strategy

### Route Table

```
/                       → CatalogPage        (lists all projects)
/projects/:id           → ProjectDetailPage  (single project detail)
/*                      → NotFound           (catch-all)
```

### Framework-Specific Wiring

| Framework | Mechanism |
|---|---|
| React + React Router | `<Route path="/projects/:id" element={<ProjectDetailPage />}` |
| Next.js (App Router) | `/app/projects/[id]/page.tsx` — `params.id` from props |
| Astro | `/src/pages/projects/[id].astro` — `Astro.params.id` |
| SvelteKit | `/src/routes/projects/[id]/+page.svelte` — `$page.params.id` |

### ID Extraction & Validation (framework-agnostic logic)

```ts
// ProjectDetailPage.tsx
const { id } = useParams();                  // or equivalent
const project = useProject(id ?? '');

if (!project) {
  return <NotFound message={`No project found with id "${id}"`} />;
}
```

### 404 Strategy

Three tiers, applied in order:

1. **Component-level guard** — `useProject()` returns `undefined`; render `<NotFound>` inline. This handles typos and stale links without a full page redirect.
2. **Router-level catch-all** — A `path="*"` route renders a generic `<NotFound>` for entirely unknown paths.
3. **Server/build-level** — For static deployments (Netlify, Vercel, GitHub Pages), configure `404.html` or redirect rules to serve the SPA shell for all paths, so client-side routing handles the resolution.

---

## 4. Component Breakdown & Data Mapping

### Component Hierarchy

```
RootLayout
└── ContentLayout
    ├── CatalogPage
    │   └── ProjectTile × N          (receives: id, title, client, description)
    └── ProjectDetailPage
        ├── HighlightList             (receives: highlights: string[])
        └── FeatureCard × N           (receives: feature: { name, description })
```

---

### `ProjectTile`

```
Props:  id, title, client, description
```

- Renders `title` as heading, `client` as a subdued label, and the first ~120 characters of `description` as a snippet (truncated with `…`)
- The entire tile is a navigable surface — wrap in `<Link to={/projects/${id}}>` (not just a button inside)
- No images required; a deterministic color accent derived from `id` (e.g., `hsl(charCodeSum % 360, 60%, 50%)`) provides visual differentiation without asset overhead

---

### `ProjectDetailPage`

```
Data source:  useProject(id)
Owns:  title, client, description, demo_url, highlights[], features[]
```

Passes `highlights` directly to `<HighlightList>` and maps `features` to individual `<FeatureCard>` instances:

```tsx
<HighlightList items={project.highlights} />

{project.features.map(f => (
  <FeatureCard key={f.name} name={f.name} description={f.description} />
))}
```

---

### `HighlightList`

```
Props:  items: string[]
```

- Renders as a `<ul>` — each string is a `<li>`
- No parsing complexity; strings are treated as opaque display values
- Do not use indexes as React keys if the list is ever reordered; since items are strings here, use `item` itself as the key (acceptable when values are unique)

---

### `FeatureCard`

```
Props:  name: string, description: string
```

- Two-part layout: `name` as a bold label, `description` as body text
- Appropriate for a definition list (`<dl>/<dt>/<dd>`) or a card variant
- Key must be set at the parent's `map()` call, not inside this component

---

### `ExternalLink`

```
Props:  href: string, label?: string
```

- Wraps `demo_url` — always renders with `target="_blank"` and `rel="noopener noreferrer"` to prevent tab-napping
- Validate that `href` starts with `http` before rendering; fall back to a disabled state if malformed

---

### `NotFound`

```
Props:  message?: string
```

- Renders a human-readable error, a "Back to catalog" link, and optionally the offending `id`
- Never expose raw stack traces or internal path structures in the UI

---

## 5. Performance & Scalability Considerations

### Asset Footprint

| Concern | Guideline |
|---|---|
| Bundle size | Avoid runtime dependencies for things the JSON already provides. No date library, no markdown parser, no icon pack unless icons are actually needed. |
| Fonts | Use system font stack (`ui-sans-serif, system-ui, sans-serif`) by default. If a custom font is required, self-host it and set `font-display: swap`. |
| Images | The schema has no image field — keep it that way unless there is a clear content need. SVG illustrations (inlined or as components) have zero HTTP cost. |
| CSS | Scope styles to components. Avoid global utility-class frameworks that ship hundreds of kilobytes of unused rules unless purging is configured (e.g., Tailwind with content paths). |

### JSON Data Scaling

The static-import pattern bundles the entire `projects.json` into the main chunk. This is fine up to ~50–100 projects. Beyond that:

- **Route-level code splitting** — each `ProjectDetailPage` chunk loads on demand. The catalog grid is a list of IDs/titles only; full project data loads when the route is visited.
- **Split JSON by project** — one file per project (`/data/projects/ml-pipeline.json`). The `useProject(id)` hook performs a dynamic import: `` import(`../data/projects/${id}.json`) ``. The bundler emits separate chunks; only the viewed project's data is ever downloaded.
- **Search/filter** — if the catalog requires client-side search, build a lightweight index at import time (a `Map<id, {title, client}>` for display) and load full records lazily.

### Rendering Performance

- `ProjectTile` components in the catalog grid are pure/memo-safe — they receive stable primitive props from a static array. Wrap with `React.memo` (or equivalent) to prevent re-renders if a parent ever gains state (e.g., a search filter).
- Avoid re-deriving the full project list inside render functions. Compute `useProjects()` once at the page level and pass slices down.
- For catalogs exceeding ~200 tiles, apply **windowed rendering** (virtual list) so the DOM contains only visible items. Libraries like `@tanstack/virtual` are framework-agnostic and under 5 kB.

### URL & Link Hygiene

- IDs in `projects.json` should be lowercase hyphen-separated slugs (`ml-demand-forecasting`, not `MLDemandForecasting`). Enforce this in the schema validation step.
- `demo_url` values should be validated at data-authoring time, not at runtime. A CI-time JSON schema check (e.g., with `ajv`) catches malformed URLs before they reach production.
- Add `<link rel="preload">` for the projects JSON if using the fetch strategy, so data is in-flight during the initial HTML parse.

### Deployment & Caching

- Build output is a fully static site — deploy to any CDN (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
- Set `Cache-Control: public, max-age=31536000, immutable` on hashed JS/CSS bundles. Set a short TTL (`max-age=60`) on `projects.json` if it is served at runtime so updates propagate quickly.
- Configure the CDN to serve `index.html` for all unmatched routes (the SPA fallback), which is what makes client-side 404 handling work correctly.

---

## Summary Decision Matrix

| Decision Point | Recommendation | Switch When |
|---|---|---|
| Data loading | Static import | Needs runtime updates → fetch |
| State management | Local hooks only | Filtering/search UI → useReducer |
| Routing | Client-side SPA | SEO is critical → SSR/SSG (Next.js/Astro) |
| JSON splitting | Single file | > 50 projects → per-project files |
| Styling | CSS Modules or scoped CSS | Design system in place → token-based utility |
| List rendering | Native DOM | > 200 tiles → virtual list |
