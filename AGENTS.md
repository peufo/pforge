# AGENTS.md — pforge

> This file is intended for AI coding agents. It describes the project architecture, conventions, and workflows as they actually exist in the codebase. Do not make assumptions beyond what is documented here.

---

## Project Overview

**pforge** is a Svelte 5 component library (with a SvelteKit landing site) for building a **public roadmap page** from GitHub data — without a database.

The project is currently in early development. The landing page (`src/routes/+page.svelte`) is a static marketing/demo site with hardcoded sample data. The library entry point (`src/lib/index.ts`) is empty. No GitHub integration, server code, or library components exist yet.

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
  routes/
    +layout.svelte      # Root layout: imports app.css, renders children
    +page.svelte        # Landing page: Hero → Demo → Features → Install → Footer
  lib/
    index.ts            # Library entry point (currently empty)
    components/landing/ # Landing-page-only components
      Hero.svelte
      Demo.svelte
      Features.svelte
      Install.svelte
      Footer.svelte
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
- The app is currently static with no server endpoints (`+page.svelte` only, no `+page.server.ts` or API routes).
- Any future GitHub App integration must store credentials in environment variables, not in code.

---

## Current State & Known Gaps

1. **Library entry point is empty** — `src/lib/index.ts` needs exports once components are ready.
2. **No actual library components exist yet** — the components in `src/lib/components/landing/` are landing-page-only.
3. **No server code** — `src/lib/server/` does not exist yet.
4. **No GitHub API integration** — the Demo section uses hardcoded sample data.
5. **No CLI tooling** — the README mentions `npx pforge generate-summaries`, which does not exist yet.
6. **Tests are only examples** — the `vitest-examples/` folder is scaffolding; real tests should be added alongside features.
