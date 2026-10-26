import { describe, expect, it } from 'vitest'
import { apply2, dot, eigen2, leastSquares2, norm, project, qr2, svd2 } from '../src/lib/geometry'

const close = (a:number,b:number) => expect(a).toBeCloseTo(b,6)
const closeMatrix = (a:number[][],b:number[][]) => a.forEach((row,i)=>row.forEach((v,j)=>close(v,b[i][j])))

describe('vector geometry',()=>{
  it('computes dot product and magnitude',()=>{expect(dot([2,3],[4,-1])).toBe(5);close(norm([3,4]),5)})
  it('projects onto a non-zero vector',()=>closeMatrix([project([3,4],[1,0])],[[3,0]]))
  it('rejects projection onto zero vector',()=>expect(()=>project([1,2],[0,0])).toThrow(/zero vector/))
  it('applies a 2x2 matrix to a vector',()=>expect(apply2([[2,1],[0,3]],[2,4])).toEqual([8,12]))
})
describe('matrix decompositions',()=>{
  it('finds eigenpairs for a symmetric matrix',()=>{const pairs=eigen2([[2,1],[1,2]]);expect(pairs).toHaveLength(2);close(pairs[0].value,3);close(pairs[1].value,1);const av=apply2([[2,1],[1,2]],pairs[0].vector);close(av[0],pairs[0].value*pairs[0].vector[0]);close(av[1],pairs[0].value*pairs[0].vector[1])})
  it('returns orthogonal eigenvectors for a repeated diagonal eigenvalue',()=>{const pairs=eigen2([[2,0],[0,2]]);close(Math.abs(dot(pairs[0].vector,pairs[1].vector)),0)})
  it('returns no real eigenpairs for a rotation matrix',()=>expect(eigen2([[0,-1],[1,0]])).toEqual([]))
  it('factorises A into QR',()=>{const a=[[2,1],[1,2]],f=qr2(a);closeMatrix([[f.q[0][0]*f.r[0][0]+f.q[0][1]*f.r[1][0],f.q[0][0]*f.r[0][1]+f.q[0][1]*f.r[1][1]],[f.q[1][0]*f.r[0][0]+f.q[1][1]*f.r[1][0],f.q[1][0]*f.r[0][1]+f.q[1][1]*f.r[1][1]]],a)})
  it('returns singular values in descending order',()=>{const result=svd2([[3,0],[0,2]]);expect(result.singularValues[0]).toBeGreaterThanOrEqual(result.singularValues[1]);close(result.singularValues[0],3);close(result.singularValues[1],2)})
  it('computes a least-squares line and residual',()=>{const result=leastSquares2([[1,0],[1,1],[1,2],[1,3]],[1,3,5,7]);close(result.coefficients[0],1);close(result.coefficients[1],2);close(result.residualNorm,0)})
  it('rejects dependent least-squares columns',()=>expect(()=>leastSquares2([[1,1],[2,2]],[1,2])).toThrow(/dependent/))
})
