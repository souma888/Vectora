# Vectora roadmap

This roadmap tracks the current product scope and distinguishes working demonstrations from future extensions.

## Product north star
A visual, hands-on workspace where learners can manipulate mathematical objects, inspect the consequences, and connect linear algebra to engineering, machine learning, and graphics.

## Phase 0 — Foundation
- [x] React + TypeScript + Vite app and responsive design system
- [x] Dedicated routes for major learning areas
- [x] Client-side matrix playground and regression tests
- [x] CI for tests and production build
- [x] Architecture, deployment, product and contribution docs

## Phase 1 — Matrix and vector laboratory
- [x] Editable matrices and row/column dimension controls
- [x] Addition, subtraction, multiplication, transpose, determinant, inverse, rank and trace
- [x] RREF with pivot and row-operation trace
- [x] Unique / infinite / inconsistent linear-system classification
- [x] Vector addition/subtraction, dot and 3D cross products, norms, angle and projection
- [x] Dimension checks and operation-specific error messages
- [x] Pseudoinverse and example presets
- [ ] General symbolic algebra and exact rational arithmetic

## Phase 2 — Decomposition and numerical analysis
- [x] Pivoted LU factorization
- [x] QR factorization for full-column-rank educational examples
- [x] SVD / singular values and pseudoinverse
- [x] Real eigenpairs and PDP⁻¹ diagonalization check for 2×2 matrices
- [x] Numerical rank and condition-number estimate
- [x] Explain tolerance, residuals, conditioning and floating-point limits
- [x] Vitest regression tests for numerical routines
- [ ] Larger, thoroughly benchmarked decomposition algorithms and configurable relative tolerances
- [ ] Dedicated residual/reconstruction comparison for every factorization

## Phase 3 — Interactive geometric visualization
- [x] Live 2D matrix transform and transformed shape
- [x] Rotation, shear, reflection, collapse and identity presets
- [x] Determinant, area scale and rank diagnostics
- [x] Explain basis-vector images and orientation
- [ ] Draggable vector endpoints and 3D WebGL scene
- [ ] Animated composition of multiple transforms

## Phase 4 — Machine-learning applications
- [x] Editable two-feature dataset
- [x] Least-squares line fit with slope, intercept, R² and residual norm
- [x] Two-feature PCA with covariance, principal directions and explained variance
- [x] Interactive SVD rank-k approximation with reconstruction-error metric and dense-layer explanations
- [ ] CSV upload, missing-value handling and feature standardization
- [ ] Multi-feature PCA, model comparison and train/test split
- [ ] Interactive gradient-descent animation

## Phase 5 — Robotics and engineering
- [x] Planar homogeneous transforms and pose controls
- [x] Transform composition and local-to-world point mapping
- [x] Coordinate-frame and composition-order explanations
- [ ] Full 3D 4×4 transforms and rotation representations
- [ ] Forward kinematics for a configurable robot arm
- [ ] Computer-vision camera projection module

## Phase 6 — Learning and reproducibility
- [x] Guided concept notes with key relations and assumption checks
- [x] JSON experiment export
- [x] Numerical API reference and scientific-studio guide
- [x] Companion Jupyter notebook with reproducible experiments
- [ ] URL-encoded shareable experiments and import/restore workflow
- [ ] Practice questions, hints, and progress tracking
- [ ] Accessible step-by-step math notation and screen-reader review

## Phase 7 — Backend and release quality
- [x] Dedicated FastAPI + Pydantic service for selected NumPy-backed calculations
- [x] PCA, regression and 2D affine transform endpoints
- [x] CORS support for configured production origin and Vercel deployment domains
- [x] OpenAPI documentation
- [ ] Add API contract and end-to-end browser tests in CI
- [ ] Performance, keyboard, screen-reader, mobile, and security audits
- [ ] Versioned API schemas and request/response examples

## Success criteria
- A first interaction works without account creation.
- Every result has a clear definition, preconditions and limitations.
- Matrix dimensions are validated before computation.
- Numerical examples can be reproduced and checked against trusted libraries.
- The app is responsive, keyboard usable, and deployable to Vercel.
