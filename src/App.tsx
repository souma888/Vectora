import { useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Atom, BookOpen, Check, ChevronDown, Command, Compass, Copy, Github, Grid2X2, Layers3, Menu, MoveUpRight, Play, RotateCcw, Sparkles, WandSparkles, X } from 'lucide-react'
import { add, determinant, inverse, multiply, shape, transpose, type Matrix } from './lib/math'

type Tool = 'multiply' | 'add' | 'transpose' | 'determinant' | 'inverse'

const initialA: Matrix = [[2, 1], [1, 3]]
const initialB: Matrix = [[1, 2], [0, 1]]

function fmt(n: number) {
  if (Math.abs(n) < 1e-9) return '0'
  return Number.isInteger(n) ? String(n) : Number(n.toFixed(3)).toString()
}

function MatrixGrid({ value, onChange, label, accent = false }: { value: Matrix; onChange?: (m: Matrix) => void; label: string; accent?: boolean }) {
  return <div className="matrix-block">
    <div className="matrix-caption"><span>{label}</span><span>{value.length} × {value[0]?.length ?? 0}</span></div>
    <div className={`matrix-brackets ${accent ? 'matrix-accent' : ''}`}>
      <div className="matrix-cells" style={{ gridTemplateColumns: `repeat(${value[0].length}, minmax(32px, 1fr))` }}>
        {value.flatMap((row, i) => row.map((n, j) => <input key={`${i}-${j}`} aria-label={`${label} row ${i + 1} column ${j + 1}`} className="matrix-cell" type="number" step="any" value={n} readOnly={!onChange} onChange={e => onChange?.(value.map((r, ri) => r.map((v, ci) => ri === i && ci === j ? Number(e.target.value) : v)))} />))}
      </div>
    </div>
  </div>
}

function App() {
  const [matrixA, setMatrixA] = useState<Matrix>(initialA)
  const [matrixB, setMatrixB] = useState<Matrix>(initialB)
  const [tool, setTool] = useState<Tool>('multiply')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const [showPlayground, setShowPlayground] = useState(false)

  const result = useMemo(() => {
    try {
      if (tool === 'multiply') return multiply(matrixA, matrixB)
      if (tool === 'add') return add(matrixA, matrixB)
      if (tool === 'transpose') return transpose(matrixA)
      if (tool === 'determinant') return [[determinant(matrixA)]]
      return inverse(matrixA)
    } catch { return null }
  }, [matrixA, matrixB, tool])

  const toolLabels: { id: Tool; label: string; symbol: string }[] = [
    { id: 'multiply', label: 'Multiply', symbol: 'AB' },
    { id: 'add', label: 'Add', symbol: 'A+B' },
    { id: 'transpose', label: 'Transpose', symbol: 'Aᵀ' },
    { id: 'determinant', label: 'Determinant', symbol: 'det' },
    { id: 'inverse', label: 'Inverse', symbol: 'A⁻¹' },
  ]

  const reset = () => { setMatrixA(initialA); setMatrixB(initialB); setTool('multiply'); setNotice('Workspace reset to the starter example.') }
  const scrollToLab = () => { setShowPlayground(true); document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return <div className="site-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Vectora home"><span className="brand-mark"><span /><span /><span /><span /></span><span>vectora<span className="brand-period">.</span></span></a>
      <nav className={mobileMenu ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        <a href="#explore" onClick={() => setMobileMenu(false)}>Explore</a><a href="#playground" onClick={() => setMobileMenu(false)}>Workspace</a><a href="#roadmap" onClick={() => setMobileMenu(false)}>Learning paths</a>
        <a className="nav-github" href="https://github.com/souma888/Vectora" target="_blank" rel="noreferrer"><Github size={15} /> GitHub <MoveUpRight size={13} /></a>
      </nav>
      <button className="mobile-toggle icon-button" aria-label={mobileMenu ? 'Close menu' : 'Open menu'} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button>
      <button className="nav-cta" onClick={scrollToLab}>Open workspace <ArrowUpRight size={15} /></button>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> THE VISUAL MATHEMATICS WORKSPACE</div>
          <h1>See the <span className="gradient-text">structure.</span><br />Feel the math.</h1>
          <p className="hero-description">Linear algebra is more than symbols on a page. Explore the hidden geometry behind matrices, transformations, and the ideas powering modern AI.</p>
          <div className="hero-actions"><button className="button-primary" onClick={scrollToLab}>Enter the workspace <ArrowRight size={17} /></button><a className="button-quiet" href="#explore"><span className="play-ring"><Play size={12} fill="currentColor" /></span> Explore the toolkit</a></div>
          <div className="hero-meta"><div className="avatar-stack"><span>∑</span><span>∫</span><span>λ</span></div><span>Built for curious minds</span><i /> <span className="meta-mono">MATH · VISUALS · INTUITION</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract visualization of a matrix transforming a coordinate grid">
          <div className="art-label art-label-top"><span className="tiny-dot" /> TRANSFORMATION / 01</div>
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <svg className="transform-svg" viewBox="0 0 520 430" role="img" aria-label="A glowing coordinate grid with transformed vectors">
            <defs><linearGradient id="plane" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b5a0ff" stopOpacity=".85"/><stop offset="1" stopColor="#5de5d1" stopOpacity=".2"/></linearGradient><linearGradient id="vector" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#a48bff"/><stop offset="1" stopColor="#72f1d7"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            <g transform="translate(260 212) rotate(-29) skewX(-12)" fill="none" stroke="#8c83b5" strokeOpacity=".25" strokeWidth="1">
              {Array.from({length:13},(_,i)=><g key={i}><path d={`M ${(i-6)*23} -140 L ${(i-6)*23} 140`} /><path d={`M -145 ${(i-6)*23} L 145 ${(i-6)*23}`} /></g>)}
            </g>
            <g transform="translate(260 212) rotate(-29) skewX(-12)" fill="none" stroke="url(#plane)" strokeWidth="1.25">
              {Array.from({length:9},(_,i)=><g key={i}><path d={`M ${(i-4)*28} -118 L ${(i-4)*28} 118`} /><path d={`M -112 ${(i-4)*28} L 112 ${(i-4)*28}`} /></g>)}
            </g>
            <g filter="url(#glow)" strokeLinecap="round" fill="none"><path d="M 260 212 L 394 132" stroke="#7af0d9" strokeWidth="2.5"/><path d="M 260 212 L 190 105" stroke="#b8a3ff" strokeWidth="2.5"/><path d="M 260 212 L 354 277" stroke="#b8a3ff" strokeWidth="1.5" strokeDasharray="4 7"/><path d="M 260 212 L 260 80" stroke="#7af0d9" strokeOpacity=".5" strokeDasharray="3 6"/></g>
            <circle cx="260" cy="212" r="5" fill="#fff" filter="url(#glow)"/><circle cx="394" cy="132" r="4" fill="#7af0d9"/><circle cx="190" cy="105" r="4" fill="#b8a3ff"/>
            <g fontFamily="DM Mono, monospace" fontSize="12" fill="#c7c1df"><text x="401" y="126">v₂</text><text x="169" y="97">v₁</text><text x="272" y="230" fill="#8b83a9">O</text><text x="345" y="299" fill="#8c83ad" fontSize="10">T : ℝ² → ℝ²</text></g>
            <g transform="translate(44 48)"><rect width="110" height="54" rx="8" fill="#171622" stroke="#39334e"/><text x="13" y="19" fill="#9b8bcb" fontSize="9" fontFamily="DM Mono, monospace">MATRIX A</text><text x="13" y="40" fill="#f4f0ff" fontSize="14" fontFamily="DM Mono, monospace">[ 2  1 ]</text><text x="13" y="51" fill="#f4f0ff" fontSize="14" fontFamily="DM Mono, monospace">[ 1  3 ]</text></g>
          </svg>
          <div className="art-equation"><span className="equation-symbol">A</span><span>×</span><span className="equation-vector">v</span><span>=</span><span className="equation-result">Av</span><span className="equation-check"><Check size={12} /></span></div>
          <div className="art-label art-label-bottom"><span>FIG. 001</span><span>LINEAR TRANSFORMATION</span><span className="art-coordinate">x: 2.0&nbsp; y: 3.0</span></div>
        </div>
        <div className="hero-bottomline"><span>01 / A NEW WAY TO LEARN</span><span className="bottom-center"><span /> THINK IN DIMENSIONS</span><a href="#explore">SCROLL TO EXPLORE <ArrowDownRight size={14} /></a></div>
      </section>

      <section className="ticker" aria-label="Topics"><div className="ticker-track"><span>LINEAR ALGEBRA</span><i>✳</i><span>GEOMETRY</span><i>✳</i><span>NUMERICAL METHODS</span><i>✳</i><span>MACHINE LEARNING</span><i>✳</i><span>ROBOTICS</span><i>✳</i><span>LINEAR ALGEBRA</span><i>✳</i><span>GEOMETRY</span><i>✳</i><span>NUMERICAL METHODS</span><i>✳</i><span>MACHINE LEARNING</span><i>✳</i></div></section>

      <section className="section explore-section" id="explore">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-index">01</span> YOUR MATHEMATICAL PLAYGROUND</div><h2>From abstract to <span className="gradient-text">intuitive.</span></h2></div><p>Tools for the questions you can’t answer by memorizing a formula. Explore a concept, change a value, and see what happens.</p></div>
        <div className="feature-grid">
          <article className="feature-card feature-large"><div className="feature-top"><span className="feature-index">01 / CORE</span><span className="feature-icon"><Grid2X2 size={17} /></span></div><div className="feature-visual mini-matrix-visual"><div className="mini-matrix"><span>2</span><span>1</span><span>1</span><span>3</span></div><span className="visual-operator">×</span><div className="mini-matrix mini-matrix-muted"><span>1</span><span>2</span><span>0</span><span>1</span></div><ArrowRight size={20} className="visual-arrow" /><div className="mini-matrix mini-matrix-result"><span>2</span><span>5</span><span>1</span><span>5</span></div></div><h3>Matrix Lab</h3><p>Build matrices, perform operations, and inspect how the pieces fit together. Start with arithmetic; grow into systems and decompositions.</p><button className="text-link" onClick={scrollToLab}>Try the workspace <ArrowRight size={15} /></button></article>
          <article className="feature-card"><div className="feature-top"><span className="feature-index">02 / GEOMETRY</span><span className="feature-icon"><Compass size={17} /></span></div><div className="feature-visual vector-visual"><svg viewBox="0 0 250 140" aria-label="Vector arrows on a coordinate plane"><g stroke="#363344" strokeWidth="1">{Array.from({length:11},(_,i)=><g key={i}><path d={`M ${15+i*22} 12 V128`} /><path d={`M 8 ${12+i*11.5} H242`} /></g>)}</g><path d="M125 119 L211 35" stroke="#7aefda" strokeWidth="2.4"/><path d="M125 119 L77 30" stroke="#ad99ff" strokeWidth="2.4"/><path d="M125 119 L205 93" stroke="#ad99ff" strokeWidth="1.4" strokeDasharray="4 5"/><circle cx="125" cy="119" r="3" fill="#fff"/><path d="M204 34 L211 35 L211 42" fill="none" stroke="#7aefda" strokeWidth="2"/><path d="M72 37 L77 30 L83 35" fill="none" stroke="#ad99ff" strokeWidth="2"/><text x="217" y="31" fill="#7aefda" fontSize="10">v</text><text x="59" y="25" fill="#ad99ff" fontSize="10">u</text></svg></div><h3>Vector Space</h3><p>Explore directions, projections, dot products, and the geometry of linear combinations.</p><a className="text-link muted-link" href="#roadmap">Coming into focus <ArrowRight size={15} /></a></article>
          <article className="feature-card"><div className="feature-top"><span className="feature-index">03 / STRUCTURE</span><span className="feature-icon"><Layers3 size={17} /></span></div><div className="feature-visual decomposition-visual"><div className="decomp-equation"><span className="decomp-a">A</span><span>=</span><span className="decomp-u">U</span><span>·</span><span className="decomp-s">Σ</span><span>·</span><span className="decomp-v">Vᵀ</span></div><div className="decomp-lines"><span /><span /><span /><span /><span /></div></div><h3>Decomposition Lab</h3><p>Make eigenvectors, SVD, and matrix factorizations feel less like black boxes.</p><a className="text-link muted-link" href="#roadmap">On the roadmap <ArrowRight size={15} /></a></article>
          <article className="feature-card"><div className="feature-top"><span className="feature-index">04 / APPLICATIONS</span><span className="feature-icon"><Atom size={17} /></span></div><div className="feature-visual application-visual"><div className="app-orbit app-orbit-one" /><div className="app-orbit app-orbit-two" /><div className="app-core">x</div><span className="app-node node-one">AI</span><span className="app-node node-two">3D</span><span className="app-node node-three">R²</span><span className="app-node node-four">ML</span></div><h3>Where math meets the world</h3><p>Connect the ideas to PCA, graphics, optimization, and robotics coordinate frames.</p><a className="text-link muted-link" href="#roadmap">Explore the vision <ArrowRight size={15} /></a></article>
        </div>
      </section>

      <section className="workspace-section" id="playground">
        <div className="workspace-glow" />
        <div className="section-heading workspace-heading"><div><div className="eyebrow"><span className="eyebrow-index">02</span> INTERACTIVE PREVIEW</div><h2>Get your hands <span className="gradient-text">on the math.</span></h2></div><p>Change the numbers. Switch the operation. See the result update right here—no sign-up, no setup.</p></div>
        <div className="workspace-window">
          <div className="window-top"><div className="window-dots"><span /><span /><span /></div><div className="window-title"><Command size={12} /> VECTORa / MATRIX WORKSPACE</div><div className="window-status"><span /> LIVE PREVIEW</div></div>
          <div className="workspace-body">
            <aside className="workspace-sidebar"><div className="sidebar-label">WORKSPACE</div><div className="sidebar-item active"><Grid2X2 size={15} /> Matrix operations <span className="sidebar-count">01</span></div><div className="sidebar-item disabled"><Activity size={15} /> Vector geometry <span className="soon-dot" /></div><div className="sidebar-item disabled"><Layers3 size={15} /> Decompositions <span className="soon-dot" /></div><div className="sidebar-divider" /><div className="sidebar-label">EXPERIMENT</div><button className="sidebar-reset" onClick={reset}><RotateCcw size={13} /> Reset example</button><div className="sidebar-note"><Sparkles size={14} /><span>Change any cell to explore how a matrix operation behaves.</span></div></aside>
            <div className="matrix-workspace"><div className="workspace-toolbar"><div><span className="workspace-kicker">MATRIX PLAYGROUND</span><h3>Operations <span>↗</span></h3></div><span className="dimension-badge">R<span>2×2</span></span></div>
              <div className="operation-tabs" role="tablist" aria-label="Matrix operation">{toolLabels.map(item=><button key={item.id} role="tab" aria-selected={tool===item.id} className={tool===item.id?'operation-tab selected':'operation-tab'} onClick={()=>setTool(item.id)}><span>{item.symbol}</span><small>{item.label}</small></button>)}</div>
              <div className="matrix-equation-row"><MatrixGrid value={matrixA} onChange={setMatrixA} label="MATRIX A" accent />{(tool==='multiply'||tool==='add')&&<><span className="equation-op">{tool==='multiply'?'×':'+'}</span><MatrixGrid value={matrixB} onChange={setMatrixB} label="MATRIX B" /></>}{tool==='transpose'&&<span className="equation-op">ᵀ</span>}{tool==='determinant'&&<span className="equation-op">det</span>}{tool==='inverse'&&<span className="equation-op">⁻¹</span>}<span className="equation-op equals">=</span><div className="result-wrap"><div className="result-label">RESULT <span className="live-pulse" /></div>{result ? <MatrixGrid value={result} label="MATRIX C" accent /> : <div className="result-error">Incompatible dimensions.<br/><small>Check the shape of each matrix.</small></div>}</div></div>
              <div className="workspace-footer"><span><span className="green-dot" /> Result updates instantly</span><span className="footer-math">A ∈ ℝᵐˣⁿ</span><button onClick={()=>{const text=result?.map(row=>row.join('\t')).join('\n')??'No result'; void navigator.clipboard?.writeText(text).then(()=>setNotice('Result copied to clipboard.')).catch(()=>setNotice(text))}}><Copy size={13} /> Copy result</button></div>
              {notice&&<div className="inline-notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss notice"><X size={13}/></button></div>}
            </div>
          </div>
          <div className="window-bottom"><span><WandSparkles size={13} /> A SMALL STEP TOWARD BIGGER IDEAS</span><span>PROTOTYPE 0.1.0</span></div>
        </div>
        <p className="workspace-disclaimer">This is an early educational preview. It currently supports basic small-matrix operations; advanced solvers and numerical analysis are planned and will be independently tested.</p>
      </section>

      <section className="section philosophy-section" id="roadmap"><div className="philosophy-left"><div className="eyebrow"><span className="eyebrow-index">03</span> BUILT AROUND UNDERSTANDING</div><h2>Not just the <span className="gradient-text">what.</span><br/>The <em>why.</em></h2><p>Great mathematical tools do more than calculate. They help you build a mental model you can carry into the next problem.</p><a className="button-secondary" href="https://github.com/souma888/Vectora/blob/main/docs/ROADMAP.md" target="_blank" rel="noreferrer">See the roadmap <MoveUpRight size={15} /></a></div><div className="principles-list"><article><span className="principle-number">01</span><div><h3>Visual first</h3><p>Turn abstract operations into things you can see, manipulate, and reason about.</p></div><span className="principle-symbol">◉</span></article><article><span className="principle-number">02</span><div><h3>Understand every result</h3><p>Build intuition with definitions, assumptions, worked examples, and meaningful feedback.</p></div><span className="principle-symbol">∴</span></article><article><span className="principle-number">03</span><div><h3>Connect the disciplines</h3><p>Move from linear systems to machine learning, graphics, and robotics with confidence.</p></div><span className="principle-symbol">↗</span></article><article><span className="principle-number">04</span><div><h3>Learn by experimenting</h3><p>Change a value, challenge your intuition, and discover why the mathematics behaves as it does.</p></div><span className="principle-symbol">⌘</span></article></div></section>

      <section className="closing-cta"><div className="closing-grid" /><div className="closing-content"><span className="closing-kicker"><Sparkles size={14} /> THE FIRST ITERATION STARTS HERE</span><h2>Make the invisible<br/><span className="gradient-text">understandable.</span></h2><p>Start with a matrix. Follow the geometry. See where the ideas take you.</p><button className="button-primary" onClick={scrollToLab}>Explore Vectora <ArrowRight size={17} /></button></div><div className="closing-symbol">V<span>.</span></div></section>
    </main>
    <footer className="footer"><a className="brand footer-brand" href="#top"><span className="brand-mark"><span /><span /><span /><span /></span><span>vectora<span className="brand-period">.</span></span></a><span className="footer-tagline">A workspace for mathematical intuition.</span><div className="footer-links"><a href="#explore">Explore</a><a href="#playground">Workspace</a><a href="https://github.com/souma888/Vectora" target="_blank" rel="noreferrer">GitHub <MoveUpRight size={12}/></a></div><span className="footer-copy">© 2026 VECTORa · MADE FOR THE CURIOUS</span></footer>
  </div>
}

export default App
