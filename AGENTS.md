# AGENTS.md — pforge

> This file is intended for AI coding agents. It describes the project architecture, conventions, and workflows as they actually exist in the codebase. Do not make assumptions beyond what is documented here.

---

## Project Overview

**pforge** is a Svelte 5 component library (with a SvelteKit landing site) for building a **public roadmap page** from GitHub data — without a database.

The project is currently in early development. The landing page (`src/routes/+page.svelte`) is a static marketing/demo site with hardcoded sample data. A GitHub integration layer, server API router, and first library component (`GithubIssues`) exist. The patterns for adding new endpoints and hybrid components are now stabilised.

- **Repository language**: English (code, comments), French (product docs / README narrative)
- **License**: MIT
- **Package name**: `pforge`

---

## Technology Stack

| Layer                  | Technology              | Version                                    |
| ---------------------- | ----------------------- | ------------------------------------------ |
| Framework              | SvelteKit               | ^2.57.0                                    |
| UI Framework           | Svelte                  | ^5.55.2 (runes mode enforced)              |
| Language               | TypeScript              | ^6.0.2                                     |
| Bundler                | Vite                    | ^8.0.7                                     |
| CSS                    | Tailwind CSS            | v4 (via `@tailwindcss/vite`)               |
| Test Runner            | Vitest                  | ^4.1.3                                     |
| Browser Testing        | Playwright              | ^1.59.1 (via `@vitest/browser-playwright`) |
| Component Test Helpers | `vitest-browser-svelte` | ^2.1.0                                     |
| Package Tooling        | `@sveltejs/package`     | ^2.5.7                                     |
| Package Linting        | `publint`               | ^0.3.18                                    |

---

## Build & Development Commands

All commands are run via `bun`:

```bash
# Start the Vite dev server
bun run dev

# Build the library (vite build + svelte-package + publint)
bun run build

# Preview the production build
bun run preview

# Type-check the project
bun run check

# Type-check in watch mode
bun run check:watch

# Lint (Prettier check + ESLint)
bun run lint

# Auto-format everything
bun run format

# Run tests (both client browser + server node projects, headless)
bun run test

# Run tests in watch mode
bun run test:unit
```

**Important build details:**

- `bun run build` runs `vite build` followed by `prepack`, which syncs SvelteKit, packages the library with `svelte-package`, and runs `publint`.
- The library is emitted to `dist/` and is what gets published to npm (see `files` in `package.json`).
- `prepare` runs `svelte-kit sync` on install.

**Pre-delivery requirement:**

- **`bun run check` must pass** (zero errors, zero warnings) before any change is committed or delivered. This runs `svelte-check`, Prettier, and ESLint.

---

## Project Structure

```
src/
  app.html              # HTML shell (loads Inter font from Google Fonts)
  app.css               # Global styles: Tailwind v4 import + custom @theme tokens
  app.d.ts              # Empty SvelteKit ambient type declarations
  hooks.server.ts       # Global hook that forwards /pforge/* to pforgeServerApi
  routes/
    +layout.svelte      # Root layout: imports app.css, renders children
    +page.svelte        # Landing page: Hero → Demo → Features → Install → Footer
    roadmap/
      +page.svelte      # Roadmap page rendering GithubIssues (SSR + client hydration)
      +page.server.ts   # SSR loader for roadmap data
  lib/
    index.ts            # Library entry point — exports components, pforgeApi, useHybridData
    api.ts              # Typed client API — one getter per endpoint
    hybrid-data.ts      # Reusable helper for hybrid components (prop vs fetch)
    types.ts            # Shared types (GithubIssue, GetIssuesParams, etc.)
    constant.ts         # PFORGE_BASE and other constants
    components/
      GithubIssues.svelte      # First library component (hybrid)
      landing/                 # Landing-page-only components
        Hero.svelte
        Demo.svelte
        Features.svelte
        Install.svelte
        Footer.svelte
    server/
      api.ts            # Server router + PForgeServerAPI type contract
      index.ts          # Server-side public exports
      github/           # GitHub-specific business logic
        issues.ts       # getGithubIssues(params)
        octokit.ts      # Octokit installation helper
        env.ts          # GitHub env validation
    vitest-examples/    # Boilerplate tests left from project scaffolding
      greet.ts
      greet.spec.ts
      Welcome.svelte
      Welcome.svelte.spec.ts
static/
  favicon.svg
  logo.svg
```

**Key conventions:**

- `src/lib/` is the library boundary. Everything inside it is intended for packaging via `svelte-package`.
- `src/routes/` is the SvelteKit app (landing site). It is NOT packaged into the library.
- Landing components live under `src/lib/components/landing/` even though they are app-specific.
- Server-side code should go in `src/lib/server/` (excluded from browser tests by Vitest config).
- Business logic that calls external APIs (GitHub, etc.) lives in `src/lib/server/<source>/`.
- The API contract between client and server is defined by `PForgeServerAPI` in `src/lib/server/api.ts`.

---

## Code Style Guidelines

### Formatting (Prettier)

- **Use tabs** for indentation
- **Single quotes**
- **No trailing commas**
- **Print width: 100**
- Svelte files use the `svelte` parser

### Linting (ESLint)

- Base: `@eslint/js` recommended
- TypeScript: `typescript-eslint` recommended
- Svelte: `eslint-plugin-svelte` recommended + prettier overrides
- `no-undef` is explicitly turned off (TypeScript handles this)
- Global variables from both `browser` and `node` are allowed
- Svelte parser options reference the local `svelte.config.js`

### Svelte

- **Runes mode is forced** for all project files (not in `node_modules`). This is set in `svelte.config.js` via `compilerOptions.runes`.
- All components must use Svelte 5 runes (`$props`, `$state`, etc.).
- **All `.svelte` files must use `<script lang="ts">`** — every component is written in TypeScript.

### TypeScript

- `strict: true`
- `module` / `moduleResolution`: `NodeNext`
- `rewriteRelativeImportExtensions: true`
- `allowJs` and `checkJs` are both enabled
- Import paths in `.ts` files should include `.js` extensions for relative imports.

---

## Testing Strategy

Vitest is configured with **two test projects**:

### 1. Client (Browser) Project

- **Environment**: Browser via Playwright (Chromium, headless)
- **Includes**: `src/**/*.svelte.{test,spec}.{js,ts}`
- **Excludes**: `src/lib/server/**`
- **Purpose**: Component-level tests that require a real DOM
- **Helper**: `vitest-browser-svelte` for `render()`

### 2. Server (Node) Project

- **Environment**: Node.js
- **Includes**: `src/**/*.{test,spec}.{js,ts}`
- **Excludes**: `src/**/*.svelte.{test,spec}.{js,ts}`
- **Purpose**: Unit tests for pure functions and server logic

**Global test setting:**

- `expect.requireAssertions: true` — every test must have at least one assertion.

### Existing Test Examples

- `src/lib/vitest-examples/greet.spec.ts` — simple Node unit test
- `src/lib/vitest-examples/Welcome.svelte.spec.ts` — browser component test using `render()` and `page.getByRole()`

**When adding new tests:**

- Name Svelte component tests `*.svelte.spec.ts` so they run in the browser project.
- Name plain JS/TS tests `*.spec.ts` so they run in the Node project.
- Server logic tests should live outside `src/lib/server/` exclusion if they are plain `.spec.ts` files.

---

## Design System

The project follows a documented design system (see `DESIGN.md` and `PRODUCT.md`). Key implementation notes:

### Colors (defined in `src/app.css` via Tailwind v4 `@theme`)

| Token                                                            | Role                              |
| ---------------------------------------------------------------- | --------------------------------- |
| `primary` / `primary-hover` / `primary-light` / `primary-subtle` | Deep terracotta accent            |
| `paper` / `paper-deep`                                           | Warm off-white backgrounds        |
| `ink` / `ink-secondary` / `ink-muted`                            | Text hierarchy (never pure black) |
| `clay` / `clay-border`                                           | Secondary surfaces and borders    |

### Typography

- **Font family**: Inter (400, 500, 600, 700) loaded from Google Fonts
- Single geometric sans-serif throughout

### Design Principles

- Flat surfaces at rest; subtle motion on interaction only
- No card grids of identical blocks, no gradient text, no glassmorphism
- No pure `#000` or `#fff`
- Warm, indie-maker aesthetic over corporate polish
- WCAG 2.1 AA target, support `prefers-reduced-motion`

---

## Deployment

- **Adapter**: `@sveltejs/adapter-auto` — automatically targets Vercel, Netlify, Cloudflare Pages, etc. depending on the environment.
- The project is configured to output to `.svelte-kit/` for dev and `/build` for production (adapter-dependent).
- Library artifacts are emitted to `dist/` and should be published to npm.

---

## Package Exports

The library is configured as a Svelte package:

```json
"svelte": "./dist/index.js",
"types": "./dist/index.d.ts",
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "svelte": "./dist/index.js"
  }
}
```

`src/lib/index.ts` is the entry point. Any components or utilities meant for consumers must be exported from this file.

---

## Security Considerations

- No secrets are committed. `.gitignore` excludes `.env`, `.env.*` (except `.env.example` and `.env.test`).
- Server endpoints are handled by `pforgeServerApi` in `hooks.server.ts` for all `/pforge/*` routes.
- GitHub App credentials are stored in environment variables (`GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, etc.).

---

## Library Architecture

This section documents the standard pattern for adding new GitHub-backed components. Follow it for every new resource (milestones, pull requests, releases, etc.).

### 1. Types

Add the domain type and its query params to `src/lib/types.ts`:

```ts
export type GithubMilestone = {
	/* ... */
}
export type GetMilestonesParams = { state?: 'open' | 'closed' | 'all' }
```

### 2. Server Handler

Create a pure business-logic file in `src/lib/server/<source>/`:

```ts
// src/lib/server/github/milestones.ts
import type { GithubMilestone, GetMilestonesParams } from '$lib/types'

export async function getGithubMilestones(
	params?: GetMilestonesParams
): Promise<GithubMilestone[]> {
	// Octokit calls, data mapping, etc.
}
```

Handlers must **not** contain HTTP logic (status codes, headers). They receive typed params and return typed data.

### 3. API Router

Register the endpoint in `src/lib/server/api.ts`:

```ts
const api = {
	'/issues': {
		get: async (params: GetIssuesParams, _event: RequestEvent) => getGithubIssues(params)
	},
	'/milestones': {
		get: async (params: GetMilestonesParams, _event: RequestEvent) => getGithubMilestones(params)
	}
} satisfies Record<string, EndpointConfig>
```

`PForgeServerAPI` is automatically derived from `typeof api`, stripping `RequestEvent` from the public contract. The router (`pforgeServerApi`) parses `searchParams`, casts them to the handler's param type, and returns `json(res)`.

### 4. API Client

Expose a typed getter in `src/lib/api.ts`:

```ts
export const pforgeApi: ApiClient = {
	'/issues': useApiGetter('/issues'),
	'/milestones': useApiGetter('/milestones')
}
```

`useApiGetter` serialises optional params into query strings. The return type is inferred from `PForgeServerAPI`.

### 5. Hybrid Component

Create a component that accepts data via **props** (SSR / parent-provided) **or** fetches it client-side:

```ts
// src/lib/components/GithubMilestones.svelte
<script lang="ts">
  import type { GithubMilestone, GetMilestonesParams } from '$lib/types'
  import { pforgeApi } from '$lib/api'
  import { useHybridData } from '$lib/hybrid-data'

  type Props = {
    milestones?: GithubMilestone[]
    state?: GetMilestonesParams['state']
  }

  let { milestones, state }: Props = $props()

  const { data, loading, error, reload } = useHybridData(
    () => milestones,
    () => pforgeApi['/milestones']({ state })
  )
</script>
```

`useHybridData` encapsulates the "prop vs fetch" logic, loading states, error handling, and retry.

### 6. Exports

- Add the component to `src/lib/index.ts` (library boundary).
- If the server handler is useful for consumers, export it from `src/lib/server/index.ts`.

### Summary — Convention Checklist

| Step           | File                           | What to do                            |
| -------------- | ------------------------------ | ------------------------------------- |
| Types          | `src/lib/types.ts`             | Add resource type + params type       |
| Handler        | `src/lib/server/<source>/*.ts` | Pure function: params → Promise<data> |
| Router         | `src/lib/server/api.ts`        | Register in `api` object              |
| Client         | `src/lib/api.ts`               | Register in `pforgeApi` object        |
| Component      | `src/lib/components/*.svelte`  | Use `useHybridData`                   |
| Library export | `src/lib/index.ts`             | Re-export component + helpers         |

---

## Current State & Known Gaps

1. **Tests are only examples** — the `vitest-examples/` folder is scaffolding; real tests should be added alongside features.
2. **No CLI tooling** — the README mentions `npx pforge generate-summaries`, which does not exist yet.
3. **Limited GitHub resources** — only `issues` is implemented; milestones, pull requests, releases, etc. are pending.

---

## CLI Tools

### `pforge-init`

Binary installed via the `bin` field in `package.json`. Run with:

```bash
bunx pforge-init
```

**What it does:**

1. Prompts for GitHub owner, repository name, and app name
2. Starts a temporary local HTTP server
3. Opens the browser on an auto-submitting form to `github.com/settings/apps/new`
4. Receives the GitHub callback with a temporary code
5. Exchanges the code for app credentials (`id`, `pem`, `webhook_secret`)
6. Writes a `.env` file with `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, and `GITHUB_WEBHOOK_SECRET`
7. Prints the installation URL

**Source files:**

- `src/lib/bin/pforge-init.ts` — CLI entry point (shebang `#!/usr/bin/env node`)
- `src/lib/server/github-app-manifest.ts` — pure logic (manifest builder + code exchange)
- `src/lib/server/github-app-manifest.spec.ts` — unit tests
