import { describe, expect, it } from 'vitest'
import { add, determinant, inverse, multiply, rref, shape, solveLinearSystem, transpose } from '../src/lib/math'

const closeMatrix = (actual: number[][], expected: number[][]) => {
  expect(actual.length).toBe(expected.length)
  actual.forEach((row, i) => row.forEach((value, j) => expect(value).toBeCloseTo(expected[i][j], 8)))
}

describe('matrix arithmetic', () => {
  it('adds matrices with matching dimensions', () => closeMatrix(add([[1, 2], [3, 4]], [[5, 6], [7, 8]]), [[6, 8], [10, 12]]))
  it('rejects addition with mismatched dimensions', () => expect(() => add([[1, 2]], [[1], [2]])).toThrow(/same dimensions/))
  it('multiplies compatible rectangular matrices', () => closeMatrix(multiply([[1, 2, 3], [4, 5, 6]], [[1, 2], [3, 4], [5, 6]]), [[22, 28], [49, 64]]))
  it('rejects incompatible multiplication', () => expect(() => multiply([[1, 2]], [[1, 2]])).toThrow(/Columns in A/))
  it('transposes a rectangular matrix', () => closeMatrix(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]))
  it('transpose twice returns the original', () => closeMatrix(transpose(transpose([[2, 3], [4, 8]])), [[2, 3], [4, 8]]))
  it('computes determinant with row pivoting', () => expect(determinant([[0, 1], [2, 3]])).toBeCloseTo(-2))
  it('returns zero for a singular matrix', () => expect(determinant([[1, 2], [2, 4]])).toBe(0))
  it('rejects determinant for a non-square matrix', () => expect(() => determinant([[1, 2, 3]])).toThrow(/square/))
  it('inverts an invertible matrix', () => closeMatrix(inverse([[4, 7], [2, 6]]), [[0.6, -0.7], [-0.2, 0.4]]))
  it('rejects inverse of a singular matrix', () => expect(() => inverse([[1, 2], [2, 4]])).toThrow(/singular/))
  it('reports matrix shape', () => expect(shape([[1, 2], [3, 4], [5, 6]])).toEqual([3, 2]))
})

describe('row reduction', () => {
  it('reduces a matrix to reduced row-echelon form', () => {
    const result = rref([[1, 2, 1], [2, 4, 0]])
    closeMatrix(result.matrix, [[1, 2, 0], [0, 0, 1]])
    expect(result.pivotColumns).toEqual([0, 2])
    expect(result.steps.length).toBeGreaterThan(1)
  })
  it('handles a zero matrix without inventing pivots', () => {
    const result = rref([[0, 0], [0, 0]])
    closeMatrix(result.matrix, [[0, 0], [0, 0]])
    expect(result.pivotColumns).toEqual([])
  })
})

describe('linear systems', () => {
  it('finds the unique solution of a square system', () => {
    const result = solveLinearSystem([[2, 1], [1, 3]], [5, 4])
    expect(result.kind).toBe('unique')
    if (result.kind === 'unique') expect(result.values.map(v => Number(v.toFixed(8)))).toEqual([2.2, 0.6])
  })
  it('classifies a consistent underdetermined system as infinite', () => {
    const result = solveLinearSystem([[1, 2], [2, 4]], [3, 6])
    expect(result.kind).toBe('infinite')
    if (result.kind === 'infinite') expect(result.freeVariables).toEqual([1])
  })
  it('classifies an inconsistent system as having no solution', () => {
    expect(solveLinearSystem([[1, 1], [1, 1]], [2, 3]).kind).toBe('none')
  })
  it('rejects a right-hand side with the wrong number of equations', () => expect(() => solveLinearSystem([[1, 2], [3, 4]], [1])).toThrow(/one right-hand-side/))
})
