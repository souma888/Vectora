# Vectora Scientific Studio

The Scientific Studio is the extended hands-on workbench at `/scientific-studio`. It complements the focused Matrix Lab, Vector Space, Transformations, Decomposition Lab, and Applications routes.

## Modules

### A. Matrix and vector laboratory
- Editable A and B matrices with row/column resizing (1–5 dimensions per axis).
- Addition, subtraction, multiplication, transpose, determinant, inverse, RREF, pseudoinverse, rank, and trace.
- Vector addition/subtraction, dot product, 3D cross product, Euclidean norm, angle, and projection.
- Linear system classification: unique solution, infinitely many solutions, or inconsistency.
- Dimension/precondition errors and a row-operation trace for RREF.
- Presets for identity, rank-deficient, and pivoting examples.

### B. Decomposition and numerical analysis
- LU factorization with row pivoting: (PA=LU).
- QR via modified Gram–Schmidt for full-column-rank matrices.
- SVD through eigendecomposition of (A^TA), with singular values and left/right factors.
- Real eigenvalues/eigenvectors and a PDP⁻¹ diagonalization/reconstruction check for diagonalizable 2×2 matrices.
- Moore–Penrose pseudoinverse, numerical rank, singular values, and a 2-norm condition estimate.
- Explanations of tolerance, residuals, conditioning, and IEEE-754 floating-point limitations.

This is an educational implementation. It is not a replacement for LAPACK/NumPy/SciPy on large or ill-conditioned matrices. The SVD implementation is a compact Jacobi-eigen approach and should be treated as an explainer, not a high-performance production solver. Rank is tolerance-dependent.

### C. Interactive geometric visualization
- Live 2D matrix transform and transformed shape/basis directions.
- Rotation, shear, reflection, projection/collapse, and identity presets.
- Determinant, absolute area scale, and rank diagnostics.
- Explanations connecting columns of a matrix to transformed basis vectors and determinant to orientation/area.

### D. Machine-learning applications
- Editable JSON dataset of 2D observations.
- Least-squares line fit with intercept, slope, (R^2), and residual norm.
- Two-dimensional PCA with centered data, covariance matrix, principal directions, projected observations, and explained-variance ratios.
- Interactive SVD rank-k reconstruction with a slider and Frobenius reconstruction error.
- Guided concepts for low-rank approximation and matrix operations in dense neural-network layers.
- Dataset presets for correlated, negative, and nonlinear trends.

PCA in this compact module is limited to two features. For real datasets with mixed units, consider standardization and evaluate the effect on principal components.

### E. Robotics and engineering
- Interactive SE(2) pose controls: heading, translation, and local point.
- A 3D 4×4 homogeneous transform lab with roll, pitch, yaw, translation, and non-uniform scaling controls.
- 3D local-to-world mapping and inverse round-trip check, plus an isometric point view.
- Homogeneous transform matrices, composition order, and coordinate-frame conventions.

### F. Learning and reproducibility
- Expandable guided concept notes, key relations, and assumption checks.
- Export current matrix, vector, dataset, transform, and pose inputs as a JSON experiment file.
- A Jupyter notebook in `examples/linear_algebra_walkthrough.ipynb`.
- API reference and architecture documentation.

## Running locally

Requires Node.js 20+.

```bash
npm install
npm run dev
npm test
npm run build
```

Open `/scientific-studio` in the Vite app.

## Numerical assumptions and limitations
- Browser calculations use JavaScript IEEE-754 double precision.
- Near-zero pivots/singular values are classified using a fixed tolerance; scaling the input can affect rank decisions.
- QR uses modified Gram–Schmidt and explicitly rejects detected dependent columns.
- Real eigenvector display is currently limited to 2×2 matrices and does not show complex eigenpairs.
- PCA is currently 2D; regression is a simple line fit.
- The interactive robotics demonstration uses planar homogeneous transforms (SE(2)), not full 3D robot kinematics.
- These tools are for learning and small experiments. Use tested numerical libraries for scientific or safety-critical decisions.

## Validation
The pure numerical routines have Vitest coverage in `src/lib/scientificMath.test.ts` for dimension validation, arithmetic, inverse, solution classification, pivoted LU, QR reconstruction, SVD/pseudoinverse shapes, PCA, and vector projection.
