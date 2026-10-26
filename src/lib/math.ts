export type Matrix = number[][]
export type ReductionStep = { label: string; matrix: Matrix }
export type LinearSolution =
  | { kind: 'unique'; values: number[]; rref: Matrix; steps: ReductionStep[] }
  | { kind: 'infinite'; rref: Matrix; steps: ReductionStep[]; freeVariables: number[] }
  | { kind: 'none'; rref: Matrix; steps: ReductionStep[] }

const EPS = 1e-10
export function shape(matrix: Matrix): [number, number] {
  return [matrix.length, matrix[0]?.length ?? 0]
}
export function validateMatrix(matrix: Matrix): void {
  if (!matrix.length || !matrix[0]?.length) throw new Error('A matrix must have at least one row and one column.')
  const cols = matrix[0].length
  if (matrix.some(row => row.length !== cols)) throw new Error('Every matrix row must have the same number of columns.')
  if (matrix.some(row => row.some(value => !Number.isFinite(value)))) throw new Error('Matrix entries must be finite numbers.')
}
function sameShape(a: Matrix, b: Matrix): void {
  validateMatrix(a); validateMatrix(b)
  if (shape(a).some((n, i) => n !== shape(b)[i])) throw new Error('Both matrices must have the same dimensions.')
}
export function multiply(a: Matrix, b: Matrix): Matrix {
  validateMatrix(a); validateMatrix(b)
  const [rows, inner] = shape(a)
  const [otherInner, cols] = shape(b)
  if (inner !== otherInner) throw new Error('Columns in A must equal rows in B.')
  return Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => a[i].reduce((sum, value, k) => sum + value * b[k][j], 0)))
}
export function transpose(a: Matrix): Matrix {
  validateMatrix(a)
  return a[0].map((_, j) => a.map(row => row[j]))
}
export function add(a: Matrix, b: Matrix): Matrix {
  sameShape(a, b)
  return a.map((row, i) => row.map((value, j) => value + b[i][j]))
}
export function determinant(input: Matrix): number {
  validateMatrix(input)
  const [rows, cols] = shape(input)
  if (rows !== cols) throw new Error('Determinant is defined only for square matrices.')
  const a = input.map(row => [...row]); let det = 1
  for (let i = 0; i < rows; i++) {
    let pivot = i
    for (let r = i + 1; r < rows; r++) if (Math.abs(a[r][i]) > Math.abs(a[pivot][i])) pivot = r
    if (Math.abs(a[pivot][i]) < EPS) return 0
    if (pivot !== i) { [a[i], a[pivot]] = [a[pivot], a[i]]; det *= -1 }
    const value = a[i][i]; det *= value
    for (let r = i + 1; r < rows; r++) {
      const factor = a[r][i] / value
      for (let c = i + 1; c < cols; c++) a[r][c] -= factor * a[i][c]
    }
  }
  return det
}
export function inverse(input: Matrix): Matrix {
  validateMatrix(input)
  const [rows, cols] = shape(input)
  if (rows !== cols) throw new Error('Inverse is defined only for square matrices.')
  const a = input.map((row, i) => [...row, ...Array.from({ length: rows }, (_, j) => Number(i === j))])
  for (let i = 0; i < rows; i++) {
    let pivot = i
    for (let r = i + 1; r < rows; r++) if (Math.abs(a[r][i]) > Math.abs(a[pivot][i])) pivot = r
    if (Math.abs(a[pivot][i]) < EPS) throw new Error('This matrix is singular and has no inverse.')
    ;[a[i], a[pivot]] = [a[pivot], a[i]]
    const divisor = a[i][i]; a[i] = a[i].map(value => value / divisor)
    for (let r = 0; r < rows; r++) {
      if (r === i) continue
      const factor = a[r][i]
      a[r] = a[r].map((value, c) => value - factor * a[i][c])
    }
  }
  return a.map(row => row.slice(rows).map(clean))
}
function clean(value: number): number { return Math.abs(value) < EPS ? 0 : value }
export function rref(input: Matrix): { matrix: Matrix; steps: ReductionStep[]; pivotColumns: number[] } {
  validateMatrix(input)
  const a = input.map(row => [...row]); const steps: ReductionStep[] = [{ label: 'Start with the original matrix', matrix: a.map(row => [...row]) }]
  const [rows, cols] = shape(a); const pivotColumns: number[] = []; let pivotRow = 0
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let best = pivotRow
    for (let r = pivotRow + 1; r < rows; r++) if (Math.abs(a[r][col]) > Math.abs(a[best][col])) best = r
    if (Math.abs(a[best][col]) < EPS) continue
    if (best !== pivotRow) {
      ;[a[best], a[pivotRow]] = [a[pivotRow], a[best]]
      steps.push({ label: `Swap row ${pivotRow + 1} with row ${best + 1}`, matrix: a.map(row => [...row]) })
    }
    const pivot = a[pivotRow][col]
    if (Math.abs(pivot - 1) > EPS) {
      a[pivotRow] = a[pivotRow].map(v => clean(v / pivot))
      steps.push({ label: `Scale row ${pivotRow + 1} to make the pivot 1`, matrix: a.map(row => [...row]) })
    }
    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue
      const factor = a[r][col]
      if (Math.abs(factor) < EPS) continue
      a[r] = a[r].map((v, c) => clean(v - factor * a[pivotRow][c]))
      steps.push({ label: `Eliminate column ${col + 1} from row ${r + 1}`, matrix: a.map(row => [...row]) })
    }
    pivotColumns.push(col); pivotRow++
  }
  return { matrix: a.map(row => row.map(clean)), steps, pivotColumns }
}
export function solveLinearSystem(coefficients: Matrix, constants: number[]): LinearSolution {
  validateMatrix(coefficients)
  if (coefficients.length !== constants.length) throw new Error('There must be one right-hand-side value per equation.')
  if (constants.some(value => !Number.isFinite(value))) throw new Error('Right-hand-side values must be finite numbers.')
  const augmented = coefficients.map((row, i) => [...row, constants[i]])
  const reduced = rref(augmented); const [rows] = shape(reduced.matrix); const vars = coefficients[0].length
  for (let r = 0; r < rows; r++) if (reduced.matrix[r].slice(0, vars).every(v => Math.abs(v) < EPS) && Math.abs(reduced.matrix[r][vars]) >= EPS) return { kind: 'none', rref: reduced.matrix, steps: reduced.steps }
  const pivotCols = reduced.pivotColumns.filter(col => col < vars)
  if (pivotCols.length < vars) return { kind: 'infinite', rref: reduced.matrix, steps: reduced.steps, freeVariables: Array.from({ length: vars }, (_, i) => i).filter(i => !pivotCols.includes(i)) }
  const values = Array.from({ length: vars }, () => 0)
  for (let r = 0; r < rows; r++) {
    const pivot = reduced.matrix[r].slice(0, vars).findIndex(v => Math.abs(v) > EPS)
    if (pivot >= 0) values[pivot] = clean(reduced.matrix[r][vars])
  }
  return { kind: 'unique', values, rref: reduced.matrix, steps: reduced.steps }
}
