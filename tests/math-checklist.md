# Calculation validation checklist

The browser operations are an initial learning prototype. Before expanding them, add automated tests for these cases.

## Multiplication
- [ ] Known 2×2 result: `[[2,1],[1,3]] × [[1,2],[0,1]] = [[2,5],[1,5]]`
- [ ] Rectangular multiplication where dimensions are compatible
- [ ] Reject incompatible inner dimensions
- [ ] Identity and zero matrix properties

## Addition
- [ ] Element-wise addition for equal shapes
- [ ] Reject mismatched row or column counts

## Transpose
- [ ] Transpose square and rectangular matrices
- [ ] Transpose twice returns the original matrix

## Determinant
- [ ] Identity and triangular matrices
- [ ] Row-swap sign change
- [ ] Singular matrix returns zero within the chosen tolerance
- [ ] Reject non-square input

## Inverse
- [ ] Verify A × inverse(A) is approximately identity
- [ ] Reject singular and non-square matrices
- [ ] Exercise pivoting, near-zero pivots, and negative values

## Quality gates
- [ ] Use explicit tolerances for floating-point assertions
- [ ] Keep pure functions independent of React
- [ ] Test empty and malformed matrices before exposing user-editable dimensions
- [ ] Explain that floating-point results are approximate
