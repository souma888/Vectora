import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { VectorSpaceLab, TransformationsLab, DecompositionLab } from './Labs'
import { ScientificStudio } from './ScientificStudio'
import { ApplicationsLab } from './Applications'
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, CircleHelp, Copy, Github, Grid2X2, Layers3, Menu, RotateCcw, Sigma, X } from 'lucide-react'
import { add, determinant, inverse, multiply, rref, solveLinearSystem, transpose, type Matrix } from './lib/math'

type Tool = 'multiply' | 'add' | 'transpose' | 'determinant' | 'inverse' | 'rref' | 'solve'
const initialA: Matrix = [[2, 1], [1, 3]]
const initialB: Matrix = [[1, 2], [0, 1]]
const initialRhs = [5, 4]
const routes = [
  { href: '/', label: 'Overview', number: '00' },
  { href: '/matrix-lab', label: 'Matrix Lab', number: '01' },
  { href: '/vector-space', label: 'Vector Space', number: '02' },
  { href: '/transformations', label: 'Transformations', number: '03' },
  { href: '/decomposition-lab', label: 'Decomposition Lab', number: '04' },
  { href: '/applications', label: 'Applications', number: '05' },
  { href: '/scientific-studio', label: 'Studio', number: '06' },
]
function fmt(n: number) { if (Math.abs(n) < 1e-9) return '0'; return Number.isInteger(n) ? String(n) : Number(n.toFixed(4)).toString() }
function useRoute() { return typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/' }

function Brand() {
  return <a className="brand" href="/" aria-label="Vectora home"><span className="brand-mark"><i/><i/><i/><i/></span><span>vectora<span className="brand-period">.</span></span></a>
}
function Header({ active, theme, onToggleTheme }: { active: string; theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><div className="header-inner"><Brand/><nav className={open ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">{routes.map(route => <a key={route.href} className={active === route.href ? 'nav-active' : ''} href={route.href} onClick={() => setOpen(false)}><span>{route.number}</span>{route.label}</a>)}</nav><button className="theme-toggle" onClick={onToggleTheme} aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"} title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}><span>{theme === "light" ? "DARK" : "LIGHT"}</span><span className="theme-toggle-icon">{theme === "light" ? "☾" : "☼"}</span></button><a className="header-github" href="https://github.com/souma888/Vectora" target="_blank" rel="noreferrer">Source <Github size={15}/></a><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X/> : <Menu/>}</button></div></header>
}
function Footer() {
  return <footer className="site-footer"><Brand/><span>Mathematics you can get your hands on.</span><span className="footer-right">BUILT TO EXPLORE · © VECTORa 2026</span></footer>
}
function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow"><span className="eyebrow-square"/> {children}</div> }
function MatrixGrid({ value, label, accent, onChange, compact = false }: { value: Matrix; label: string; accent?: boolean; onChange?: (matrix: Matrix) => void; compact?: boolean }) {
  return <div className={compact ? 'matrix-panel compact-matrix' : 'matrix-panel'}>
    <div className="matrix-panel-head"><strong>{label}</strong><span>{value.length} × {value[0]?.length ?? 0}</span></div>
    <div className={accent ? 'matrix-bracket accent-bracket' : 'matrix-bracket'}><div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${value[0].length}, minmax(34px, 1fr))` }}>
      {value.flatMap((row, i) => row.map((n, j) => <input key={`${i}-${j}`} aria-label={`${label} row ${i + 1} column ${j + 1}`} type="number" step="any" value={fmt(n)} readOnly={!onChange} onChange={event => onChange?.(value.map((r, ri) => r.map((v, ci) => ri === i && ci === j ? Number(event.target.value) : v)))} />))}
    </div></div>
  </div>
}
function resizeMatrix(matrix: Matrix, rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => matrix[i]?.[j] ?? Number(i === j)))
}
function MatrixEditor({ value, onChange, label }: { value: Matrix; onChange: (m: Matrix) => void; label: string }) {
  const rows = value.length, cols = value[0]?.length ?? 0
  return <div className="editor-card"><div className="editor-card-top"><span className="editor-label">{label}</span><span className="dim-chip">{rows} × {cols}</span></div><MatrixGrid value={value} label={label} accent={label === 'A'} onChange={onChange}/><div className="dimension-controls"><span>Dimensions</span><div><button aria-label={`Remove row from ${label}`} disabled={rows <= 1} onClick={() => onChange(resizeMatrix(value, rows - 1, cols))}>− row</button><button aria-label={`Add row to ${label}`} disabled={rows >= 5} onClick={() => onChange(resizeMatrix(value, rows + 1, cols))}>+ row</button><button aria-label={`Remove column from ${label}`} disabled={cols <= 1} onClick={() => onChange(resizeMatrix(value, rows, cols - 1))}>− col</button><button aria-label={`Add column to ${label}`} disabled={cols >= 5} onClick={() => onChange(resizeMatrix(value, rows, cols + 1))}>+ col</button></div></div></div>
}
function ResultMatrix({ value, label = 'RESULT' }: { value: Matrix; label?: string }) {
  return <div className="result-card"><div className="result-head"><span className="result-pip"/>{label}<span className="live-tag">CALCULATED</span></div><MatrixGrid value={value} label={label} compact/></div>
}
function MatrixLab() {
  const [a, setA] = useState<Matrix>(initialA), [b, setB] = useState<Matrix>(initialB)
  const [rhs, setRhs] = useState<number[]>(initialRhs), [tool, setTool] = useState<Tool>('multiply'), [copied, setCopied] = useState(false)
  const tools: { id: Tool; label: string; notation: string; description: string }[] = [
    { id: 'multiply', label: 'Multiply', notation: 'AB', description: 'Compose two linear maps.' },
    { id: 'add', label: 'Addition', notation: 'A + B', description: 'Add corresponding entries.' },
    { id: 'transpose', label: 'Transpose', notation: 'Aᵀ', description: 'Swap rows and columns.' },
    { id: 'determinant', label: 'Determinant', notation: 'det A', description: 'Measure signed area scale.' },
    { id: 'inverse', label: 'Inverse', notation: 'A⁻¹', description: 'Undo an invertible map.' },
    { id: 'rref', label: 'Row reduction', notation: 'RREF', description: 'Find pivots and rank.' },
    { id: 'solve', label: 'Solve Ax = b', notation: 'Ax = b', description: 'Classify and solve a system.' },
  ]
  const computed = useMemo(() => {
    try {
      if (tool === 'multiply') return { matrix: multiply(a, b), error: '' }
      if (tool === 'add') return { matrix: add(a, b), error: '' }
      if (tool === 'transpose') return { matrix: transpose(a), error: '' }
      if (tool === 'determinant') return { matrix: [[determinant(a)]], error: '' }
      if (tool === 'inverse') return { matrix: inverse(a), error: '' }
      if (tool === 'rref') return { matrix: rref(a).matrix, error: '' }
      return { matrix: null, error: '' }
    } catch (e) { return { matrix: null, error: e instanceof Error ? e.message : 'These dimensions are not compatible.' } }
  }, [a, b, tool])
  const reduction = useMemo(() => { try { return rref(a) } catch { return null } }, [a])
  const solution = useMemo(() => { try { return solveLinearSystem(a, rhs.slice(0, a.length).concat(Array.from({length: Math.max(0, a.length-rhs.length)}, () => 0))) } catch { return null } }, [a, rhs])
  const copy = async () => {
    const text = tool === 'solve' ? JSON.stringify(solution, null, 2) : JSON.stringify(computed.matrix ?? reduction?.matrix, null, 2)
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { setCopied(false) }
  }
  const reset = () => { setA(initialA); setB(initialB); setRhs(initialRhs); setTool('multiply') }
  return <div className="lab-layout"><aside className="lab-rail"><div className="rail-heading">WORKBENCH <span>01 / 07</span></div>{tools.map((item, i) => <button key={item.id} className={tool === item.id ? 'tool-choice chosen' : 'tool-choice'} onClick={() => setTool(item.id)}><span className="tool-number">0{i + 1}</span><span className="tool-name">{item.label}<small>{item.description}</small></span><span className="tool-notation">{item.notation}</span></button>)}<div className="rail-note"><CircleHelp size={16}/><p>Results use floating-point arithmetic. Small rounding differences are normal.</p></div></aside>
    <div className="lab-main"><div className="lab-toolbar"><div><span className="mono-kicker">MATRIX WORKSPACE / LIVE</span><h2>{tools.find(t => t.id === tool)?.label}</h2></div><div className="toolbar-actions"><button className="subtle-button" onClick={reset}><RotateCcw size={14}/> Reset</button><button className="solid-button" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy result'}</button></div></div>
      <div className="editors-row"><MatrixEditor label="A" value={a} onChange={setA}/>{tool !== 'transpose' && tool !== 'determinant' && tool !== 'inverse' && tool !== 'rref' && tool !== 'solve' && <div className="editor-operator">{tool === 'multiply' ? '×' : '+'}</div>}{tool !== 'transpose' && tool !== 'determinant' && tool !== 'inverse' && tool !== 'rref' && tool !== 'solve' && <MatrixEditor label="B" value={b} onChange={setB}/>}</div>
      {tool === 'solve' ? <section className="lab-output"><div className="output-title"><div><span className="mono-kicker">LINEAR SYSTEM</span><h3>Solve <i>Ax = b</i></h3></div><span className="output-badge">AUGMENTED MATRIX</span></div><p className="output-description">Edit the right-hand side vector. Coefficients come from matrix A.</p><div className="rhs-editor">{rhs.slice(0, a.length).concat(Array.from({length: Math.max(0,a.length-rhs.length)},()=>0)).map((v,i)=><label key={i}><span>b{i+1}</span><input type="number" value={fmt(v)} onChange={e=>setRhs(old=>{const next=old.slice();next[i]=Number(e.target.value);return next})}/></label>)}</div>{solution && <div className={solution.kind === 'none' ? 'solution-banner error-banner' : 'solution-banner'}><strong>{solution.kind === 'unique' ? 'Unique solution' : solution.kind === 'infinite' ? 'Infinitely many solutions' : 'No solution'}</strong><span>{solution.kind === 'unique' ? solution.values.map((v,i)=>`x${i+1} = ${fmt(v)}`).join('   ·   ') : solution.kind === 'infinite' ? `Free variables: ${solution.freeVariables.map(i=>`x${i+1}`).join(', ')}` : 'The equations are inconsistent.'}</span></div>}{solution && <div className="output-matrix-wrap"><ResultMatrix value={solution.rref} label="RREF [A | b]"/></div>}</section> :
      <section className="lab-output"><div className="output-title"><div><span className="mono-kicker">RESULT / NUMERICAL OUTPUT</span><h3>{tool === 'rref' ? 'Reduced row-echelon form' : tool === 'determinant' ? 'Determinant value' : 'Your result'}</h3></div><span className="output-badge">LIVE UPDATE</span></div>{computed.error ? <div className="error-state"><strong>Operation not defined</strong><p>{computed.error}</p><span>Try adjusting the matrix dimensions or entries.</span></div> : computed.matrix && <div className="output-matrix-wrap"><ResultMatrix value={computed.matrix}/>{tool === 'rref' && <div className="rank-note">Rank(A) = {reduction?.pivotColumns.length} <span>·</span> Pivot columns: {reduction?.pivotColumns.length ? reduction.pivotColumns.map(c=>c+1).join(', ') : 'none'}</div>}</div>}</section>}
      {tool === 'rref' && reduction && <section className="steps-section"><div className="output-title"><div><span className="mono-kicker">ROW OPERATIONS</span><h3>Reduction trace</h3></div><span className="output-badge">{reduction.steps.length} STATES</span></div><div className="step-list">{reduction.steps.map((step,i)=><article className="step-item" key={i}><div className="step-number">{String(i+1).padStart(2,'0')}</div><div className="step-content"><strong>{step.label}</strong><div className="step-matrix">{step.matrix.map((row,r)=><div key={r}>{row.map((n,c)=><span key={c}>{fmt(n)}</span>)}</div>)}</div></div></article>)}</div></section>}
      {tool === 'solve' && solution && <section className="steps-section"><div className="output-title"><div><span className="mono-kicker">ELIMINATION TRACE</span><h3>How we got there</h3></div><span className="output-badge">{solution.steps.length} STATES</span></div><div className="step-list">{solution.steps.map((step,i)=><article className="step-item" key={i}><div className="step-number">{String(i+1).padStart(2,'0')}</div><div className="step-content"><strong>{step.label}</strong><div className="step-matrix">{step.matrix.map((row,r)=><div key={r}>{row.map((n,c)=><span key={c}>{fmt(n)}</span>)}</div>)}</div></div></article>)}</div></section>}
      <div className="lab-footnote"><Activity size={14}/><span>Computed in your browser · no data is sent to a server</span><span className="footnote-right">EPSILON 1e−10</span></div>
    </div></div>
}
const pageData: Record<string,{num:string;eyebrow:string;title:string;accent:string;intro:string;status:string;features:{num:string;title:string;copy:string;symbol:string}[]}> = {
  '/vector-space': {num:'02',eyebrow:'GEOMETRY / VECTOR SPACE',title:'Vectors have a',accent:'direction.',intro:'Build intuition for magnitude, direction, dot products, projections, and linear combinations before the notation gets in the way.',status:'NEXT MODULE',features:[{num:'01',title:'Vector playground',copy:'Move vector tips and compare magnitude, direction, and component form.',symbol:'v⃗'},{num:'02',title:'Dot product',copy:'Explore how alignment changes the dot product from positive to zero to negative.',symbol:'u·v'},{num:'03',title:'Span & basis',copy:'See how independent vectors build a space and where they fall short.',symbol:'span'}]},
  '/transformations': {num:'03',eyebrow:'GEOMETRY / TRANSFORMATIONS',title:'A matrix is a machine for',accent:'space.',intro:'See matrices as actions: rotate, stretch, reflect, shear, and change the coordinate frame beneath a shape.',status:'NEXT MODULE',features:[{num:'01',title:'Transform a grid',copy:'Compare the standard basis with its image under a matrix.',symbol:'T(x)'},{num:'02',title:'Shape laboratory',copy:'Explore rotations, reflections, shears, and non-uniform scaling.',symbol:'↗'},{num:'03',title:'Coordinate frames',copy:'Connect homogeneous transforms to robotics and 3D positioning.',symbol:'SE(2)'}]},
  '/decomposition-lab': {num:'04',eyebrow:'STRUCTURE / DECOMPOSITIONS',title:'Find the structure inside the',accent:'matrix.',intro:'Explore the factorisations that reveal hidden directions, low-rank structure, and numerically useful representations.',status:'PLANNED MODULE',features:[{num:'01',title:'Eigen directions',copy:'Understand directions that stay on their own line after a transformation.',symbol:'Av=λv'},{num:'02',title:'QR factorisation',copy:'Separate an orthogonal basis from a triangular system.',symbol:'A=QR'},{num:'03',title:'Singular value decomposition',copy:'Inspect how a matrix stretches along its most important directions.',symbol:'A=UΣVᵀ'}]},
  '/applications': {num:'05',eyebrow:'PRACTICE / APPLICATIONS',title:'The mathematics behind the',accent:'tools.',intro:'Connect linear algebra to the work it powers: machine learning, computer graphics, robotics, and data analysis.',status:'PLANNED MODULE',features:[{num:'01',title:'Machine learning',copy:'Follow the linear algebra in regression, embeddings, and principal component analysis.',symbol:'Xw'},{num:'02',title:'Computer graphics',copy:'Use transforms and coordinate systems to move geometry through a scene.',symbol:'3D'},{num:'03',title:'Robotics',copy:'Relate frames, pose, and motion through homogeneous transformations.',symbol:'Tₐᵦ'}]},
}
function Home() {
  return <><main className="home-main"><section className="home-hero"><div className="home-hero-copy"><Eyebrow>AN INTERACTIVE MATHEMATICS ENVIRONMENT</Eyebrow><h1>Make abstract<br/>ideas <em>visible.</em></h1><p>Explore linear algebra by doing it. Change a matrix, follow its row operations, and see the structure hiding behind the symbols.</p><div className="home-actions"><a className="solid-button big-button" href="/matrix-lab">Enter Matrix Lab <ArrowRight size={17}/></a><a className="text-action" href="/transformations">Explore the concepts <ArrowDownRight size={16}/></a></div><div className="hero-rule"><span>01 / INTERACTIVE LEARNING</span><span>BUILT FOR THE CURIOUS</span></div></div><div className="hero-board"><div className="board-top"><span>FIG. 01 / LINEAR MAP</span><span>R² → R²</span></div><svg viewBox="0 0 500 390" role="img" aria-label="A coordinate grid transformed into a skewed parallelogram"><defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#202a3a" strokeOpacity=".14" strokeWidth="1"/></pattern></defs><rect width="500" height="390" fill="url(#grid)"/><g stroke="#202a3a" strokeWidth="1" opacity=".4"><path d="M42 195H460 M250 28V360"/><path d="M455 190l8 5-8 5 M245 35l5-8 5 8" fill="none"/></g><g transform="translate(250 195)"><polygon points="0,0 120,-5 170,-110 50,-105" fill="#2558d8" fillOpacity=".13" stroke="#2558d8" strokeWidth="2"/><polygon points="0,0 120,-5 170,-110 50,-105" fill="none" stroke="#2558d8" strokeWidth="1" strokeDasharray="5 5"/><path d="M0 0L120 -5 M0 0L50 -105" stroke="#2558d8" strokeWidth="3"/><path d="M0 0L170 -110" stroke="#e45135" strokeWidth="3"/><circle cx="120" cy="-5" r="5" fill="#2558d8"/><circle cx="50" cy="-105" r="5" fill="#2558d8"/><circle cx="170" cy="-110" r="6" fill="#e45135"/></g><g fill="#202a3a" fontFamily="DM Mono,monospace" fontSize="11"><text x="270" y="178">e₁</text><text x="302" y="86" fill="#e45135">T(v)</text><text x="284" y="344">TRANSFORMATION / 2D</text></g></svg><div className="board-bottom"><span>THE SAME SPACE, A DIFFERENT BASIS</span><span>VECTORa FIELD NOTES № 001</span></div><div className="board-stamp">LINEAR<br/>ALGEBRA<br/><b>01</b></div></div></section><section className="home-intro"><div><Eyebrow>THE WORKBENCH</Eyebrow><h2>Not another wall<br/>of formulas.</h2></div><p>Vectora is built around a simple idea: the best way to understand mathematics is to experiment with it. Each lab gives you a place to change inputs, inspect results, and connect symbols to intuition.</p></section><section className="module-section"><div className="section-topline"><Eyebrow>CHOOSE YOUR EXPLORATION</Eyebrow><span>01 — 06 / MODULES</span></div><div className="module-grid">{routes.slice(1).map((r,i)=><a className={i===0?'module-card module-featured':'module-card'} key={r.href} href={r.href}><div className="module-card-top"><span>{r.number} / MODULE</span><ArrowUpRight size={17}/></div><div className="module-symbol">{['[ A ]','u · v','T(x)','A = QR','Xw','∑'][i]}</div><h3>{r.label}</h3><p>{['Edit matrices, reduce rows, and solve systems with a visible elimination trace.','Explore vector operations, projections, and the geometry of a basis.','See how matrices rotate, reflect, stretch, and shear coordinate space.','Uncover eigen directions, rank, and matrix factorisations.','See linear algebra at work in machine learning, graphics, and robotics.','Explore the full scientific workbench: matrix operations, numerical diagnostics, PCA, and coordinate-frame composition.'][i]}</p><span className="module-link">{i===0?'OPEN LAB':'EXPLORE MODULE'} <ArrowRight size={14}/></span></a>)}</div></section><section className="home-method"><div className="method-number">HOW VECTORa WORKS <span>03 PRINCIPLES</span></div><div className="method-row"><span>01</span><div><h3>Change something.</h3><p>Start with an editable mathematical object, not a static example.</p></div><Sigma/></div><div className="method-row"><span>02</span><div><h3>Watch the structure emerge.</h3><p>Follow row operations, pivots, and numerical results one step at a time.</p></div><Grid2X2/></div><div className="method-row"><span>03</span><div><h3>Connect the idea to the world.</h3><p>Move from the mathematics to graphics, data science, and robotics.</p></div><Layers3/></div></section></main></>
}
function ConceptPage({ path }: { path: string }) {
  const page = pageData[path]
  return <main className="concept-page"><section className="concept-hero"><div className="concept-copy"><Eyebrow>{page.eyebrow}</Eyebrow><div className="concept-number">{page.num} / 05</div><h1>{page.title.replace(page.accent,'')}<em>{page.accent}</em></h1><p>{page.intro}</p><span className="planned-pill"><span/>{page.status}</span></div><div className="concept-art"><div className="art-coordinate-label">VECTORa / STUDY {page.num}</div><div className="concept-formula">{['u·v = |u||v|cos θ','T(x) = Ax','A = QR = UΣVᵀ','y = Xw'][Number(page.num)-2] ?? 'Ax = b'}</div><div className="concept-grid-art"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div><div className="concept-art-bottom">CONCEPTUAL MODEL · NOT TO SCALE</div></div></section><section className="concept-detail"><div className="section-topline"><Eyebrow>INSIDE THIS MODULE</Eyebrow><span>STUDY PLAN / {page.num}</span></div><div className="concept-feature-grid">{page.features.map(item=><article className="concept-feature" key={item.num}><div className="concept-feature-head"><span>{item.num}</span><b>{item.symbol}</b></div><h2>{item.title}</h2><p>{item.copy}</p><span className="planned-text">ON THE ROADMAP</span></article>)}</div><div className="concept-notice"><BookOpen size={19}/><div><strong>This module is being developed.</strong><p>The page and learning outline are in place. Interactive lessons for this topic are planned; Matrix Lab is the first fully interactive learning tool.</p></div><a href="/matrix-lab">Try Matrix Lab <ArrowRight size={15}/></a></div></section></main>
}
function NotFound() { return <main className="not-found"><Eyebrow>404 / OFF THE GRID</Eyebrow><h1>This point isn't<br/><em>in the space.</em></h1><p>That page hasn't been mapped yet.</p><a href="/" className="solid-button">Return home <ArrowRight size={16}/></a></main> }
export default function App() {
  const path = useRoute()
  const [theme,setTheme] = useState<'light'|'dark'>(() => typeof window !== 'undefined' && window.localStorage.getItem('vectora-theme') === 'dark' ? 'dark' : 'light')
  useEffect(() => { if (typeof window !== 'undefined') window.localStorage.setItem('vectora-theme',theme) },[theme])
  const active = path === '/' ? '/' : path
  let content
  if (path === '/') content = <Home/>
  else if (path === '/matrix-lab') content = <main className="matrix-page"><section className="page-heading"><div><Eyebrow>MATRIX LAB / INTERACTIVE WORKSPACE</Eyebrow><h1>Make the matrix<br/><em>make sense.</em></h1><p>Change entries, explore operations, and follow the elimination steps that turn a system into an answer.</p></div><div className="page-heading-aside"><span>01 / 07</span><strong>THE FIRST WORKING LAB</strong><p>Runs locally in your browser. No sign-in, no uploads, no server round-trip.</p></div></section><MatrixLab/></main>
  else if (path === '/vector-space') content = <VectorSpaceLab/>
  else if (path === '/transformations') content = <TransformationsLab/>
  else if (path === '/decomposition-lab') content = <DecompositionLab/>
  else if (path === '/applications') content = <ApplicationsLab/>
  else if (path === '/scientific-studio') content = <ScientificStudio/>
  else if (pageData[path]) content = <ConceptPage path={path}/>
  else content = <NotFound/>
  return <div className="app-shell" data-theme={theme}><Header active={active} theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}/>{content}<Footer/></div>
}
