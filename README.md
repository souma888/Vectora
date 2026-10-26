# Vectora

**An interactive field guide to linear algebra and scientific computing.**

Vectora is a browser-based mathematical workbench. Instead of only returning an answer, it lets learners edit mathematical objects, inspect intermediate steps, visualize geometric effects, and connect linear algebra to data science, machine learning, and robotics.

## Product modules

### Focused learning labs
- **Matrix Lab** — editable matrix operations, dimension checks, determinant/inverse, RREF, elimination traces, and linear-system classification.
- **Vector Space** — vector magnitude, dot product, angle, projection, and coordinate-plane geometry.
- **Transformations** — interactive 2D linear maps, transformed grids and basis vectors, rotation/shear/reflection presets, and determinant/area interpretation.
- **Decomposition Lab** — compact demonstrations of eigenanalysis, QR, SVD, singular values, and least-squares fitting.
- **Applications** — NumPy-backed PCA, regression, computer-graphics transformations, and planar robotics pose experiments.

### Scientific Studio — `/scientific-studio`
A connected workbench with six detailed areas:

1. **Matrix and vector laboratory:** create/resize/edit A and B (up to 5×5), add/subtract/multiply, transpose, determinant, inverse, RREF, pseudoinverse, rank, trace, dot product, norms, projection, angle, and system classification (unique / infinite / inconsistent).
2. **Decomposition and numerical analysis:** pivoted LU, QR, SVD/singular values, 2×2 real eigenpairs, pseudoinverse, numerical rank, condition estimate, row-operation trace, and guidance about tolerance, residuals, and floating-point limits.
3. **Interactive geometry:** animate the effect of a 2×2 matrix on a shape and basis vectors; explore rotation, shear, reflection, collapse, determinant, rank, and area scaling.
4. **Machine learning:** edit a 2D dataset; fit least-squares regression; inspect slope, intercept, R² and residual norm; explore PCA covariance, principal directions and explained variance; learn low-rank approximation and neural-network matrix operations.
5. **Robotics and engineering:** edit planar pose and point parameters; inspect homogeneous transforms, transform composition, local-to-world point mapping, and coordinate-frame conventions.
6. **Learning and reproducibility:** guided lessons, key equations, assumption checks, JSON experiment export, API documentation, and a companion Jupyter notebook.

## Numerical scope and transparency

- Browser calculations use JavaScript IEEE-754 double precision.
- Rank and singularity use tolerance-based decisions; near-zero cases can depend on scaling and tolerance.
- The Scientific Studio is an educational implementation for small matrices. Its compact SVD uses a Jacobi eigensolver on (A^TA), QR uses modified Gram–Schmidt, and real eigenvector display is limited to 2×2 matrices. QR reports dependent-column failures.
- The browser PCA module currently uses two features; regression is a straight-line fit; robotics demonstrates planar SE(2), not full 3D kinematics.
- Use mature numerical libraries such as NumPy/SciPy for large, ill-conditioned, scientific, or safety-critical work. The dedicated FastAPI backend uses NumPy for the supported Applications endpoints.

## Architecture

- **Frontend:** React, TypeScript, Vite, CSS, Lucide React.
- **Client-side math:** pure TypeScript routines in `src/lib/`, with Vitest tests.
- **Numerical API:** FastAPI + Pydantic + NumPy in `backend/app/main.py`.
- **Deployment:** Vercel frontend and a dedicated Render API service. The Vectora API is separate from the older `numpy-matrix-operations` service.

API base URL defaults to `https://vectora-wwp0.onrender.com`. Set `VITE_MATRIX_API_URL` at build time to use another service. Vite-prefixed variables are public; never place secrets in them.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
npm test
npm run build
```

Open the local Vite URL and select **Studio** or visit `/scientific-studio`.

To run the API locally:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs are available at `/docs` when the backend is running.

## Documentation and examples

- [Scientific Studio guide](docs/SCIENTIFIC_STUDIO.md)
- [Numerical API reference](docs/API_REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Product roadmap](docs/ROADMAP.md)
- [Product brief](docs/PRODUCT.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)
- [Jupyter walkthrough](examples/linear_algebra_walkthrough.ipynb)

## Design principles

1. Let users manipulate mathematical objects before reading theory.
2. Show intermediate operations and assumptions, not only final answers.
3. Give every learning area its own focused route.
4. Make dimension rules and numerical limitations visible.
5. Keep educational implementations distinct from trusted production numerical libraries.
6. Keep experiments reproducible through documented examples and exported inputs.

## License

MIT — see [LICENSE](LICENSE).
