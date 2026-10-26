# Vectora

**An interactive field guide to linear algebra.**

Vectora turns abstract mathematics into experiments: edit matrices, follow elimination, explore vector geometry, watch transformations act on shapes, and inspect the decompositions behind numerical methods.

## Interactive modules

- **Matrix Lab** — matrix editing, arithmetic, transpose, determinant, inverse, RREF, row-operation traces, and linear-system classification.
- **Vector Space** — interactive 2D vectors, magnitude, dot product, angle, projection, and a live coordinate-plane diagram.
- **Transformations** — edit a 2 × 2 matrix and see it act on a rectangle and coordinate grid; inspect basis vectors and determinant/area scaling. Includes rotation, shear, reflection, and stretch presets.
- **Decomposition Lab** — calculate real eigenvalues/eigenvectors, QR factorisation, singular values and SVD factors, and least-squares line fitting with editable observations.
- **Applications** — a separate learning outline connecting linear algebra to ML, graphics, and robotics.

Each module has its own route; this is not a single long scrolling page. Use the **DARK / LIGHT** control in the top navigation to switch themes. The preference is saved in the browser.

## Numerical scope

The Vector Space and Transformations labs work in 2D. The Decomposition Lab's eigenanalysis, QR, and SVD demonstrations are currently designed for real 2 × 2 matrices. Least squares fits an intercept and slope to four editable observations using the normal equations. These are compact educational implementations using floating-point arithmetic, not replacements for a mature numerical library. Ill-conditioned and larger problems should use NumPy/SciPy or another established numerical package.

## Tech stack

- React + TypeScript + Vite
- Responsive editorial design system with light and dark themes
- Vitest regression tests for matrix and geometry routines
- GitHub Actions for regression tests and production build
- Vercel deployment target

## Development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Run tests and production build:

```bash
npm test
npm run build
```

## Documentation

- [Product roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Product brief](docs/PRODUCT.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)

## Design principles

1. Let people manipulate mathematical objects before reading a wall of theory.
2. Show intermediate operations, not only final answers.
3. Keep every learning area on its own route.
4. Explain numerical assumptions and limitations.
5. Keep Vectora as the learning application and Matrix Operations as a reusable computation package.

## License

MIT — see [LICENSE](LICENSE).
