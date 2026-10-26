import { describe, expect, it } from 'vitest'
import { add, conditionReport, determinant, inverse, lu, multiply, pca2, pseudoinverse, qr, rref, solveSystem, svd, vectorProjection } from './scientificMath'
const close=(a:number,b:number,tol=1e-6)=>expect(Math.abs(a-b)).toBeLessThan(tol)
describe('scientific matrix operations',()=>{
 it('multiplies compatible matrices and rejects dimensions',()=>{expect(multiply([[1,2],[3,4]],[[2],[1]])).toEqual([[4],[10]]);expect(()=>multiply([[1,2]],[[1,2]])).toThrow(/columns\(A\)/)})
 it('computes determinant and inverse',()=>{close(determinant([[4,7],[2,6]]),10);const prod=multiply([[4,7],[2,6]],inverse([[4,7],[2,6]]));close(prod[0][0],1);close(prod[0][1],0);close(prod[1][0],0);close(prod[1][1],1)})
 it('returns pivot and classification for linear systems',()=>{expect(solveSystem([[1,1],[2,2]],[2,4]).kind).toBe('infinite');expect(solveSystem([[1,1],[2,2]],[2,5]).kind).toBe('none');expect(solveSystem([[2,1],[1,3]],[5,4])).toMatchObject({kind:'unique',values:[2,1]})})
 it('produces an LU factorization with pivoting',()=>{const a=[[0,2],[1,3]],{P,L,U}=lu(a);expect(multiply(P,a).map((r,i)=>r.map((x,j)=>x-multiply(L,U)[i][j]))).toEqual([[0,0],[0,0]])})
 it('produces QR factors whose product recovers A',()=>{const a=[[1,1],[1,0],[0,1]],{Q,R}=qr(a),rec=multiply(Q,R);a.forEach((r,i)=>r.forEach((x,j)=>close(rec[i][j],x)))})
 it('computes SVD singular values and pseudoinverse shape',()=>{const a=[[1,0],[0,2],[0,0]],d=svd(a),pinv=pseudoinverse(a);expect(d.singularValues[0]).toBeGreaterThan(d.singularValues[1]);expect(pinv.length).toBe(2);expect(pinv[0].length).toBe(3);expect(conditionReport(a).rank).toBe(2)})
 it('computes PCA and vector projection',()=>{expect(pca2([[1,1],[2,2],[3,3]]).explainedVariance[0]).toBeGreaterThan(.99);expect(vectorProjection([3,4],[1,0])).toEqual([3,0])})
 it('adds matrices',()=>expect(add([[1,2]],[[3,4]])).toEqual([[4,6]]))
})
