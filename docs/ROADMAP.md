# Vectora roadmap

This roadmap describes intended scope, not a claim that every feature is implemented.

## Product north star

A visual, hands-on workspace where learners can manipulate mathematical objects, inspect the consequences, and connect linear algebra to engineering, machine learning, and graphics.

## Phase 0 — Foundation
- [x] Establish React + TypeScript + Vite project
- [x] Create responsive brand and landing experience
- [x] Add a first client-side matrix playground
- [x] Document architecture, principles, and deployment
- [ ] Add automated tests and accessibility review

## Phase 1 — Matrix Lab
- [ ] Matrix editor with dimension controls and cell validation
- [ ] Arithmetic, transpose, determinant, inverse, rank, and trace
- [ ] Step-by-step row reduction and linear-system solving
- [ ] Explain domain constraints and numerical limitations
- [ ] Unit tests for calculation functions

## Phase 2 — Vectors and transformations
- [ ] Vector operations, dot products, norms, projection, and angle
- [ ] Interactive 2D coordinate plane with draggable vectors
- [ ] Apply 2×2 transformations to points, grids, and shapes
- [ ] Show basis vectors before and after transformation
- [ ] Explain determinant as signed area scaling

## Phase 3 — Decomposition and numerical methods
- [ ] Eigenvalues and eigenvectors with geometric interpretations
- [ ] LU, QR, SVD, least squares, and pseudoinverse
- [ ] Conditioning, stability, residuals, and floating-point error
- [ ] Compare algorithms and explain when assumptions fail

## Phase 4 — Applications
- [ ] Linear regression and least squares
- [ ] PCA and low-rank approximation
- [ ] 2D/3D graphics and coordinate frames
- [ ] Robotics transformations and composition
- [ ] Small, reproducible datasets and guided experiments

## Phase 5 — Learning experience
- [ ] Guided lessons, worked examples, and practice challenges
- [ ] Save/share experiments through URL or export
- [ ] Notebook-style explanations and accessible visualizations
- [ ] Progressively disclose advanced details without hiding assumptions

## Phase 6 — Backend and release quality
- [ ] FastAPI + Pydantic service for heavier computations
- [ ] Reuse the separate Matrix Operations package where appropriate
- [ ] Stable request/response schemas and API tests
- [ ] CI for linting, tests, and production build
- [ ] Performance, keyboard, screen-reader, mobile, and security audits

## Initial success criteria
- Landing page communicates the value proposition in seconds.
- The first interaction works without account creation.
- Every displayed mathematical result has a clear definition and constraints.
- The site is responsive, keyboard usable, and deployable to Vercel.
- Prototype calculations are labelled honestly; production numerical work is validated independently.
