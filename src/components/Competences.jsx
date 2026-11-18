import { useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { competences } from '../data/siteData'
import { Titre } from './Reveal'
// Les 4 cadres : le titre, et les catégories de siteData.js qu'ils regroupent
const CARTES = [
  { titre: 'FRONT-END', cats: ['Front-end'] },
  { titre: 'BACK-END ET BASES DE DONNÉES', cats: ['Back-end et bases de données'] },
  { titre: 'OUTILS ET ENVIRONNEMENT DE TRAVAIL', cats: ['Outils et environnement de travail', 'Conception et design'] },
  { titre: 'BUREAUTIQUE', cats: ['Bureautique'] },
]
const SYMBOLES = ['</>', '$_', '01', '{ }', ';', '=>', '[ ]', '//', '10', '( )']
const DIRECTIONS = [[0, -1], [0, 1], [-1, 0], [1, 0], [.7, -.7], [-.7, -.7], [.7, .7], [-.7, .7]]
const hasard = (graine) => () => { let t = (graine += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
// Fabrique les symboles : 3 couches de profondeur (loin = petit, flou, lent ; près = grand, net, rapide)
function creer(mobile) {
  const r = hasard(11)
  const flottants = Array.from({ length: mobile ? 12 : 26 }, (_, i) => {
    const couche = i % 3, d = DIRECTIONS[Math.floor(r() * DIRECTIONS.length)], dist = (120 + r() * 160) * (1 + couche * .3)
    return { i, c: SYMBOLES[Math.floor(r() * SYMBOLES.length)], l: r() * 96, t: r() * 92, s: [11, 15, 22][couche] + Math.floor(r() * 3), o: [.16, .26, .38][couche],
      par: [6, 16, 32][couche], blur: couche === 0 ? 1 : 0, dx: Math.round(d[0] * dist), dy: Math.round(d[1] * dist), rot: Math.round((r() - .5) * 70),
      dur: [38, 28, 20][couche] + r() * 10, delai: r() * 40 }
  })
  const orbites = Array.from({ length: mobile ? 3 : 5 }, (_, i) => ({ i, c: SYMBOLES[Math.floor(r() * SYMBOLES.length)], l: 10 + r() * 80, t: 10 + r() * 80,
    rayon: 70 + r() * 140, s: 14 + Math.floor(r() * 8), o: .22 + r() * .14, dur: 40 + r() * 50 }))
  return { flottants, orbites }
}
// 💻 Fragments de code qui flottent derrière les cadres (animations CSS = légères) et bougent un peu avec la souris
function FondCode({ reduit }) {
  const fond = useRef()
  const { flottants, orbites } = useMemo(() => creer(typeof innerWidth !== 'undefined' && innerWidth < 768), [])
  useEffect(() => {
    if (reduit) return
    const zone = fond.current.parentElement
    let raf
    const bouge = (e) => {
      const r = zone.getBoundingClientRect(), mx = ((e.clientX - r.left) / r.width) * 2 - 1, my = ((e.clientY - r.top) / r.height) * 2 - 1
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => { fond.current.style.setProperty('--mx', mx); fond.current.style.setProperty('--my', my) })
    }
    zone.addEventListener('mousemove', bouge)
    return () => { zone.removeEventListener('mousemove', bouge); cancelAnimationFrame(raf) }
  }, [reduit])
  return (
    <div ref={fond} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden font-mono text-violet">
      <style>{`
        @keyframes cf-flotte { 0% { transform: translate3d(0,0,0) rotate(0); opacity: 0 } 15% { opacity: var(--o) } 85% { opacity: var(--o) } 100% { transform: translate3d(var(--dx),var(--dy),0) rotate(var(--r)); opacity: 0 } }
        @keyframes cf-tourne { to { transform: rotate(360deg) } }
        @keyframes cf-contre { from { transform: translateX(var(--r)) rotate(0deg) } to { transform: translateX(var(--r)) rotate(-360deg) } }
        @media (prefers-reduced-motion: reduce) { .cf-p, .cf-o, .cf-t { animation: none !important } .cf-p { opacity: var(--o) } }
      `}</style>
      {flottants.map((p) => (
        <span key={p.i} className="absolute" style={{ left: `${p.l}%`, top: `${p.t}%`, '--p': p.par, transition: 'transform .6s ease-out',
          transform: 'translate(calc(var(--mx, 0) * var(--p) * 1px), calc(var(--my, 0) * var(--p) * 1px))' }}>
          <span className="cf-p block will-change-transform" style={{ fontSize: p.s, '--o': p.o, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--r': `${p.rot}deg`,
            animation: `cf-flotte ${p.dur}s linear ${-p.delai}s infinite`, filter: p.blur ? `blur(${p.blur}px)` : undefined }}>{p.c}</span>
        </span>
      ))}
      {orbites.map((o) => (
        <span key={o.i} className="cf-t absolute h-0 w-0" style={{ left: `${o.l}%`, top: `${o.t}%`, animation: `cf-tourne ${o.dur}s linear infinite`, animationDirection: o.i % 2 ? 'reverse' : 'normal' }}>
          <span className="cf-o absolute block will-change-transform" style={{ fontSize: o.s, opacity: o.o, '--r': `${o.rayon}px`, animation: `cf-contre ${o.dur}s linear infinite`, animationDirection: o.i % 2 ? 'reverse' : 'normal' }}>{o.c}</span>
        </span>
      ))}
    </div>
  )
}
const Office = ({ l, c }) => <span className="flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold text-white" style={{ background: c }}>{l}</span>
// Un cadre : flotte doucement, s'incline en 3D avec la souris, halo lumineux qui suit le curseur
function Carte({ titre, items, index, reduit }) {
  const ref = useRef()
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 150, damping: 18 }), sy = useSpring(ry, { stiffness: 150, damping: 18 })
  const bouge = (e) => {
    if (reduit) return
    const r = ref.current.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    ry.set((px - .5) * 12); rx.set((.5 - py) * 12)
    ref.current.style.setProperty('--hx', `${px * 100}%`); ref.current.style.setProperty('--hy', `${py * 100}%`)
  }
  const quitte = () => { rx.set(0); ry.set(0) }
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: .7, delay: index * .12, ease: [.22, 1, .36, 1] }} className="[perspective:900px]">
      <motion.div animate={reduit ? {} : { y: [0, -7, 0] }} transition={{ duration: 5 + index * .7, repeat: Infinity, ease: 'easeInOut' }} className="h-full">
        <motion.div ref={ref} onMouseMove={bouge} onMouseLeave={quitte} whileHover={reduit ? {} : { scale: 1.025 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }}
          className="group relative h-full overflow-hidden rounded-3xl border border-violet/25 bg-white/50 p-6 shadow-lg shadow-violet/10 backdrop-blur-md transition-shadow duration-500 hover:shadow-2xl hover:shadow-violet/30">
          <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: 'radial-gradient(circle at var(--hx, 50%) var(--hy, 50%), rgba(139,120,255,.18), transparent 55%)' }} />
          <div className="relative mb-5 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-violet" />
            <h3 className="text-xs font-semibold tracking-[.25em] text-violet">{titre}</h3>
            <span className="h-px flex-1 bg-violet/20" />
          </div>
          <ul className="relative flex flex-wrap gap-2.5">
            {items.map((it, i) => (
              <motion.li key={it.n} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .25 + i * .06, duration: .45 }}
                whileHover={reduit ? {} : { y: -3 }}
                className="flex items-center gap-2.5 rounded-full border border-violet/20 bg-violet/10 py-1.5 pl-1.5 pr-4 text-sm text-texte">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                  {it.office ? <Office l={it.office[0]} c={it.office[1]} /> : <img src={it.i} alt="" width="20" height="20" loading="lazy" />}
                </span>
                {it.n}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
export default function Competences() {
  const reduit = useReducedMotion()
  const cartes = CARTES.map((c) => ({ titre: c.titre, items: competences.filter((g) => c.cats.includes(g.cat)).flatMap((g) => g.items) }))
  return (
    <section id="competences" className="relative overflow-hidden">
      <FondCode reduit={reduit} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12">
        <Titre label="Le kit que j'utilise">Mes compétences</Titre>
        <div className="grid gap-6 md:grid-cols-2">
          {cartes.map((c, i) => <Carte key={c.titre} titre={c.titre} items={c.items} index={i} reduit={reduit} />)}
        </div>
      </div>
    </section>
  )
}