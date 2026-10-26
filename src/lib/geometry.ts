import type { Matrix } from './math'

export type Vec2 = [number, number]
export type EigenPair = { value: number; vector: Vec2 }
export type QRResult = { q: Matrix; r: Matrix }
export type SVDResult = { u: Matrix; singularValues: [number, number]; v: Matrix }

const EPS = 1e-10
const clean = (x: number) => Math.abs(x) < EPS ? 0 : x
export const dot = (a: Vec2, b: Vec2) => a[0] * b[0] + a[1] * b[1]
export const addVec = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]]
export const scaleVec = (a: Vec2, s: number): Vec2 => [a[0] * s, a[1] * s]
export const subtractVec = (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]]
export const norm = (a: Vec2) => Math.hypot(a[0], a[1])
export function project(a: Vec2, onto: Vec2): Vec2 {
  const denom = dot(onto, onto)
  if (denom < EPS) throw new Error('Cannot project onto the zero vector.')
  return scaleVec(onto, dot(a, onto) / denom)
}
export function apply2(matrix: Matrix, vector: Vec2): Vec2 {
  if (matrix.length !== 2 || matrix.some(row => row.length !== 2)) throw new Error('A 2 × 2 matrix is required.')
  return [matrix[0][0] * vector[0] + matrix[0][1] * vector[1], matrix[1][0] * vector[0] + matrix[1][1] * vector[1]]
}
export function eigen2(matrix: Matrix): EigenPair[] {
  if (matrix.length !== 2 || matrix.some(row => row.length !== 2)) throw new Error('Eigenanalysis currently supports real 2 × 2 matrices.')
  const [[a,b],[c,d]] = matrix
  const trace = a + d, det = a*d - b*c, discriminant = trace*trace - 4*det
  if (discriminant < -EPS) return []
  const root = Math.sqrt(Math.max(0, discriminant))
  const values = [(trace + root)/2, (trace - root)/2]
  return values.map((value,index) => {
    let vector: Vec2 = [b, value-a]
    const alternative: Vec2 = [value-d, c]
    if (norm(alternative) > norm(vector)) vector = alternative
    if (norm(vector) < EPS) {
      if (Math.abs(b) < EPS && Math.abs(c) < EPS) vector = index === 0 ? [1,0] : [0,1]
      else vector = [1,0]
    }
    const length = norm(vector)
    return { value: clean(value), vector: [clean(vector[0]/length), clean(vector[1]/length)] as Vec2 }
  })
}
export function qr2(matrix: Matrix): QRResult {
  if (matrix.length !== 2 || matrix.some(row => row.length !== 2)) throw new Error('QR factorisation currently supports 2 × 2 matrices.')
  const a: Vec2 = [matrix[0][0], matrix[1][0]], b: Vec2 = [matrix[0][1], matrix[1][1]]
  const r11 = norm(a)
  if (r11 < EPS) throw new Error('QR is undefined for a zero first column in this compact demo.')
  const q1 = scaleVec(a, 1/r11), r12 = dot(q1,b), bOrth = subtractVec(b, scaleVec(q1,r12)), r22 = norm(bOrth)
  if (r22 < EPS) throw new Error('Columns are linearly dependent; this demo needs full-rank input for QR.')
  const q2 = scaleVec(bOrth,1/r22)
  return { q: [[q1[0],q2[0]],[q1[1],q2[1]]], r: [[r11,r12],[0,r22]] }
}
export function svd2(matrix: Matrix): SVDResult {
  if (matrix.length !== 2 || matrix.some(row => row.length !== 2)) throw new Error('SVD currently supports 2 × 2 matrices.')
  const ata: Matrix = [
    [matrix[0][0]**2 + matrix[1][0]**2, matrix[0][0]*matrix[0][1] + matrix[1][0]*matrix[1][1]],
    [matrix[0][0]*matrix[0][1] + matrix[1][0]*matrix[1][1], matrix[0][1]**2 + matrix[1][1]**2],
  ]
  const pairs = eigen2(ata).sort((a,b)=>b.value-a.value)
  const singularValues: [number,number] = [Math.sqrt(Math.max(0,pairs[0].value)),Math.sqrt(Math.max(0,pairs[1].value))]
  const v: Matrix = [[pairs[0].vector[0],pairs[1].vector[0]],[pairs[0].vector[1],pairs[1].vector[1]]]
  const uCols: Vec2[] = []
  for (let i=0;i<2;i++) {
    if (singularValues[i] > EPS) uCols.push(scaleVec(apply2(matrix,[v[0][i],v[1][i]]),1/singularValues[i]))
    else uCols.push(i===0 ? [1,0] : [-uCols[0][1],uCols[0][0]])
  }
  return { u: [[uCols[0][0],uCols[1][0]],[uCols[0][1],uCols[1][1]]], singularValues: singularValues.map(clean) as [number,number], v }
}
export function leastSquares2(a: Matrix, b: number[]): { coefficients: Vec2; residualNorm: number } {
  if (a.length !== b.length || a.length < 2 || a.some(row=>row.length!==2)) throw new Error('Provide an m × 2 design matrix and one target value per row (at least two rows).')
  if (b.some(x=>!Number.isFinite(x)) || a.flat().some(x=>!Number.isFinite(x))) throw new Error('All inputs must be finite numbers.')
  let s00=0,s01=0,s11=0,t0=0,t1=0
  a.forEach((row,i)=>{s00+=row[0]*row[0];s01+=row[0]*row[1];s11+=row[1]*row[1];t0+=row[0]*b[i];t1+=row[1]*b[i]})
  const det=s00*s11-s01*s01
  if (Math.abs(det)<EPS) throw new Error('The columns are dependent or poorly conditioned; a unique least-squares fit is unavailable.')
  const coefficients: Vec2=[clean((t0*s11-t1*s01)/det),clean((s00*t1-s01*t0)/det)]
  const residualNorm=Math.sqrt(a.reduce((sum,row,i)=>sum+(row[0]*coefficients[0]+row[1]*coefficients[1]-b[i])**2,0))
  return {coefficients,residualNorm:clean(residualNorm)}
}
