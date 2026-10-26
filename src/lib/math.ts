export type Matrix = number[][]

export function shape(matrix: Matrix): [number, number] {
  return [matrix.length, matrix[0]?.length ?? 0]
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  const [rows, inner] = shape(a)
  const [otherInner, cols] = shape(b)
  if (inner !== otherInner) throw new Error('Columns in A must equal rows in B.')
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) =>
      a[i].reduce((sum, value, k) => sum + value * b[k][j], 0),
    ),
  )
}

export function transpose(a: Matrix): Matrix {
  return a[0].map((_, j) => a.map(row => row[j]))
}

export function add(a: Matrix, b: Matrix): Matrix {
  const [rows, cols] = shape(a)
  const [otherRows, otherCols] = shape(b)
  if (rows !== otherRows || cols !== otherCols) throw new Error('Both matrices must have the same dimensions.')
  return a.map((row, i) => row.map((value, j) => value + b[i][j]))
}

export function determinant(input: Matrix): number {
  const [rows, cols] = shape(input)
  if (rows !== cols) throw new Error('Determinant is defined only for square matrices.')
  const a = input.map(row => [...row])
  let det = 1
  for (let i = 0; i < rows; i++) {
    let pivot = i
    for (let r = i + 1; r < rows; r++) if (Math.abs(a[r][i]) > Math.abs(a[pivot][i])) pivot = r
    if (Math.abs(a[pivot][i]) < 1e-10) return 0
    if (pivot !== i) { [a[i], a[pivot]] = [a[pivot], a[i]]; det *= -1 }
    const value = a[i][i]
    det *= value
    for (let r = i + 1; r < rows; r++) {
      const factor = a[r][i] / value
      for (let c = i + 1; c < rows; c++) a[r][c] -= factor * a[i][c]
    }
  }
  return det
}

export function inverse(input: Matrix): Matrix {
  const [rows, cols] = shape(input)
  if (rows !== cols) throw new Error('Inverse is defined only for square matrices.')
  const a = input.map((row, i) => [...row, ...Array.from({ length: rows }, (_, j) => Number(i === j))])
  for (let i = 0; i < rows; i++) {
    let pivot = i
    for (let r = i + 1; r < rows; r++) if (Math.abs(a[r][i]) > Math.abs(a[pivot][i])) pivot = r
    if (Math.abs(a[pivot][i]) < 1e-10) throw new Error('This matrix is singular and has no inverse.')
    ;[a[i], a[pivot]] = [a[pivot], a[i]]
    const divisor = a[i][i]
    a[i] = a[i].map(value => value / divisor)
    for (let r = 0; r < rows; r++) {
      if (r === i) continue
      const factor = a[r][i]
      a[r] = a[r].map((value, c) => value - factor * a[i][c])
    }
  }
  return a.map(row => row.slice(rows))
}
