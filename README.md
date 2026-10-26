# Vectora

**A visual workspace for linear algebra, numerical methods, and geometric intuition.**

Vectora is an interactive learning environment in progress. It is designed to make abstract mathematical ideas tangible through manipulable matrices, live visualizations, guided experiments, and practical connections to machine learning and robotics.

## Product direction

- **Matrix Lab** — edit matrices and explore arithmetic, determinants, inverses, rank, and systems of equations.
- **Vector Space** — work with vectors, projections, dot products, and linear combinations.
- **Transformations** — see how matrices move points, shapes, and coordinate frames.
- **Decomposition Lab** — build intuition for eigenvalues, eigenvectors, QR, SVD, and least squares.
- **Numerical Methods** — investigate stability, conditioning, approximation, and numerical error.
- **Applications** — connect linear algebra to regression, PCA, graphics, and robotics.

## Status

The initial frontend establishes the product identity, responsive landing experience, navigation, and a first interactive matrix workspace. Numerical features are staged in the roadmap; the current browser workspace is an educational frontend prototype and should not be treated as a verified numerical-computing engine yet.

## Tech direction

- React + TypeScript + Vite
- CSS design system with responsive layouts and accessible interaction states
- Planned API: FastAPI + Pydantic
- Numerical foundation: NumPy / SciPy, with selected from-scratch algorithms for teaching
- Deployment target: Vercel

## Local development

```bash
npm install
npm run dev
```

Run a production build with `npm run build` and preview it with `npm run preview`.

## Documentation

- [Product roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)

## Principles

1. Show the intuition, not only the answer.
2. Make every result inspectable and reproducible.
3. Separate educational explanations from numerical computation.
4. Prefer accessible, responsive, keyboard-friendly interactions.
5. Keep Vectora as the learning application and the Matrix Operations library as a reusable computation package.

## License

MIT — see [LICENSE](LICENSE).
