# Vectora

**An interactive field guide to linear algebra.**

Vectora turns abstract mathematical ideas into experiments: edit matrices, follow elimination, explore geometry, and connect the math to machine learning and robotics.

## The experience

Vectora is designed as a multi-page learning environment rather than a single scrolling landing page.

- **Overview** — a visual introduction to the learning workspace.
- **Matrix Lab** — editable matrices, dimension controls, arithmetic, transpose, determinant, inverse, reduced row-echelon form (RREF), row-operation traces, and linear-system classification.
- **Vector Space** — a dedicated home for vectors, projections, dot products, span, and basis.
- **Transformations** — a dedicated home for linear maps, shape transforms, and coordinate frames.
- **Decomposition Lab** — a roadmap for eigenanalysis, QR, and SVD.
- **Applications** — a roadmap connecting linear algebra to ML, graphics, and robotics.

The latter learning pages currently provide designed module overviews and learning plans; Matrix Lab is the first interactive lab.

## Matrix Lab

- Edit entries in matrices A and B.
- Add or remove rows and columns (up to 5 × 5).
- Use addition, multiplication, transpose, determinant, and inverse.
- Compute reduced row-echelon form and inspect pivot columns/rank.
- Follow a row-operation trace.
- Solve (Ax=b) and classify the result as unique, infinitely many solutions, or inconsistent.
- Copy the result as JSON.
- Calculation runs locally in the browser.

Numerical routines are educational implementations using floating-point arithmetic and a tolerance. For safety-critical or high-precision work, use a mature numerical package such as NumPy/SciPy.

## Tech stack

- React + TypeScript + Vite
- CSS design system with responsive layouts and keyboard focus states
- Vitest for numerical regression tests
- GitHub Actions for tests and production build
- Vercel for deployment

## Development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Run the regression suite and production build:

```bash
npm test
npm run build
```

## Project documentation

- [Product roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Product brief](docs/PRODUCT.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)

## Design principles

1. Let people manipulate a mathematical object before reading a wall of theory.
2. Show intermediate operations, not only final answers.
3. Separate conceptual illustrations from numerical results.
4. Keep each learning area on its own route.
5. Keep Vectora as the learning application and the Matrix Operations library as a reusable computation package.

## License

MIT — see [LICENSE](LICENSE).
