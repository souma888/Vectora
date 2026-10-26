# Architecture

## Current frontend

- **Vite** provides the development server and static production build.
- **React + TypeScript** structure the interactive UI.
- **CSS** owns the design tokens, responsive layout, animation, and accessible states.
- **Lucide React** supplies consistent interface icons.
- **Vercel** serves the static build; `vercel.json` defines build output and SPA fallback.

## Planned calculation architecture

Keep the learning experience and the numerical engine separate.

```text
React UI
  ├── Lessons and explanations
  ├── Editors and visualizations
  └── Typed client-side calculation interface
          │
          ├── lightweight validated browser operations
          └── optional API client
                    │
                 FastAPI
                    ├── Pydantic request/response schemas
                    ├── domain and dimension validation
                    └── numerical services
                           ├── NumPy / SciPy
                           └── selected teaching algorithms
```

## Boundaries and principles

1. Treat matrix dimensions and operation preconditions as explicit domain rules.
2. Keep pure math functions out of React components so they can be tested independently.
3. Include explanatory metadata (steps, assumptions, residuals) separately from numeric results.
4. Use NumPy/SciPy for reliable production computation; implement selected algorithms from scratch only when the educational value is clear.
5. Reuse the Matrix Operations project as a package/service where its API and capabilities fit. Avoid maintaining two competing implementations of the same core operations.
6. Do not claim arbitrary precision or numerical stability without a defined implementation and tests.
7. Never put API secrets in frontend environment variables; Vite variables prefixed with `VITE_` are public.

## Suggested future layout

```text
src/
  app/             # app shell and route-level views
  components/      # reusable UI
  features/
    matrix-lab/
    vectors/
    transformations/
    decompositions/
    numerical-methods/
    applications/
  lib/
    math/          # pure, typed and tested calculations
    api/           # typed API client
  styles/
  types/
server/            # optional FastAPI service, added when needed
tests/             # unit and integration tests
docs/
```

This is a direction for growth; folders should be added when they have real code to own.
