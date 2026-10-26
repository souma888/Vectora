# Vectora Numerical API Reference

Base URL: `https://vectora-wwp0.onrender.com`

The browser-based Scientific Studio uses local TypeScript routines for immediate interactive experiments. The Applications page uses the FastAPI service for selected NumPy-backed calculations.

## Service checks
- `GET /` — service name, status, and docs location.
- `GET /health` — health status.
- `GET /docs` — interactive OpenAPI documentation.

## POST /api/pca
Request:
```json
{
  "data": [[1.0, 1.2], [1.5, 1.7], [2.0, 1.8]],
  "components": 2
}
```
Returns feature means, component vectors, projected observations, explained variance and explained-variance ratios. Data must be a rectangular numeric array with at least two samples; components cannot exceed the smaller data dimension. The implementation centers data and uses NumPy SVD.

## POST /api/regression
Request:
```json
{"x": [0, 1, 2, 3], "y": [1.1, 2.0, 2.4, 3.8]}
```
Returns intercept, slope, fitted values, residuals, residual norm, and (R^2). At least two observations with distinct x values are required.

## POST /api/transform
Request:
```json
{
  "matrix": [[0.866, -0.5, 2], [0.5, 0.866, 1], [0, 0, 1]],
  "points": [[0, 0], [1, 0], [0, 1]]
}
```
Returns transformed 2D points, determinant, absolute area scale, and whether orientation is reversed. The matrix must be a 3×3 affine homogeneous transform with final row `[0, 0, 1]`.

## Validation and errors
- Request schemas reject unknown fields.
- Inputs must be finite and dimensionally valid.
- Invalid inputs return HTTP 422 with a descriptive detail.
- Browser CORS allows the configured production origin and Vercel-hosted deployment domains.
- Configure `VITE_MATRIX_API_URL` at build time if deploying the frontend against a different service. Vite-prefixed environment variables are public, so never put secrets in them.
