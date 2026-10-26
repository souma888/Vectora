"""Standalone numerical API for Vectora's Applications lab."""
from __future__ import annotations

import os
from typing import Annotated

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict

app = FastAPI(
    title="Vectora Numerical API",
    description="Validated numerical endpoints for PCA, regression, and 2D affine transforms.",
    version="1.0.0",
)

default_origins = (
    "http://localhost:5173,http://127.0.0.1:5173,"
    "https://vectora-soumadip-karan.vercel.app"
)
origins = [s.strip() for s in os.getenv("CORS_ORIGINS", default_origins).split(",") if s.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Vercel serves production aliases and deployment-specific hostnames; allow this public frontend hosting domain family too.
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


class PCARequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    data: list[list[float]] = Field(min_length=2, max_length=500)
    components: int = Field(default=2, ge=1, le=20)


class RegressionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    x: list[float] = Field(min_length=2, max_length=500)
    y: list[float] = Field(min_length=2, max_length=500)


class TransformRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    matrix: list[list[float]] = Field(min_length=3, max_length=3)
    points: list[list[float]] = Field(min_length=1, max_length=100)


def finite_array(values, label: str) -> np.ndarray:
    try:
        array = np.asarray(values, dtype=float)
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=422, detail=f"{label} must be a rectangular numeric array.") from exc
    if not np.isfinite(array).all():
        raise HTTPException(status_code=422, detail=f"{label} must contain only finite numbers.")
    return array


@app.get("/")
def root():
    return {"service": "Vectora Numerical API", "status": "ok", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "vectora-numerical-api"}


@app.post("/api/pca")
def pca(req: PCARequest):
    data = finite_array(req.data, "data")
    if data.ndim != 2 or data.shape[0] < 2 or data.shape[1] < 1:
        raise HTTPException(status_code=422, detail="data must contain at least two samples and one feature.")
    if req.components > min(data.shape):
        raise HTTPException(status_code=422, detail="components cannot exceed min(number of samples, number of features).")
    mean = data.mean(axis=0)
    centered = data - mean
    _, singular, vt = np.linalg.svd(centered, full_matrices=False)
    scores = centered @ vt[:req.components].T
    variance = (singular ** 2) / (data.shape[0] - 1)
    total = float(variance.sum())
    ratios = variance / total if total > 0 else np.zeros_like(variance)
    return {
        "method": "NumPy SVD on centered data",
        "mean": mean.tolist(),
        "components": vt[:req.components].tolist(),
        "projected": scores.tolist(),
        "explained_variance": variance[:req.components].tolist(),
        "explained_variance_ratio": ratios[:req.components].tolist(),
    }


@app.post("/api/regression")
def regression(req: RegressionRequest):
    x = finite_array(req.x, "x")
    y = finite_array(req.y, "y")
    if x.ndim != 1 or y.ndim != 1 or len(x) != len(y):
        raise HTTPException(status_code=422, detail="x and y must be one-dimensional arrays of equal length.")
    if len(x) < 2 or np.unique(x).size < 2:
        raise HTTPException(status_code=422, detail="At least two observations with distinct x values are required.")
    design = np.column_stack((np.ones_like(x), x))
    coeff, _, _, _ = np.linalg.lstsq(design, y, rcond=None)
    fitted = design @ coeff
    residual = y - fitted
    ss_res = float(residual @ residual)
    ss_tot = float(((y - y.mean()) ** 2).sum())
    r2 = 1.0 - ss_res / ss_tot if ss_tot > 0 else (1.0 if ss_res < 1e-12 else 0.0)
    return {
        "method": "Ordinary least squares (NumPy lstsq)",
        "intercept": float(coeff[0]),
        "slope": float(coeff[1]),
        "fitted": fitted.tolist(),
        "residuals": residual.tolist(),
        "residual_norm": float(np.linalg.norm(residual)),
        "r_squared": float(r2),
    }


@app.post("/api/transform")
def transform(req: TransformRequest):
    matrix = finite_array(req.matrix, "matrix")
    points = finite_array(req.points, "points")
    if matrix.shape != (3, 3):
        raise HTTPException(status_code=422, detail="matrix must be 3x3.")
    if points.ndim != 2 or points.shape[1] != 2:
        raise HTTPException(status_code=422, detail="points must be an array of [x, y] pairs.")
    if not np.allclose(matrix[2], [0.0, 0.0, 1.0], atol=1e-9):
        raise HTTPException(status_code=422, detail="matrix must be a 2D affine homogeneous transform with last row [0, 0, 1].")
    homogeneous = np.column_stack((points, np.ones(len(points))))
    transformed = (matrix @ homogeneous.T).T[:, :2]
    det = float(np.linalg.det(matrix[:2, :2]))
    return {
        "method": "Validated 2D affine transform (NumPy)",
        "points": transformed.tolist(),
        "determinant": det,
        "area_scale": abs(det),
        "orientation_reversed": det < 0,
    }
