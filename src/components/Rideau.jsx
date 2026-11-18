import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../data/siteData'
import { saut } from '../utils/goTo'
import Monogramme from './Monogramme'
// ✨ Intro / transition « Un peu de magie »
// mode 'intro' = à l'ouverture : un fond prune profond aux lueurs violettes, le monogramme se dessine, puis le rideau se lève.
// mode 'trans' = au clic sur le menu : un cercle prune s'ouvre là où tu as cliqué, une pluie d'étoiles jaillit, puis elle se referme.
const CORAIL = '#8b78ff', LILAS = '#c9b5ff', PECHE = '#9fe3c8' // violet clair, lavande, menthe
// [gauche %, haut %, taille px, couleur]
const ETINCELLES = [[12, 22, 16, LILAS], [24, 70, 12, PECHE], [34, 30, 10, CORAIL], [66, 24, 14, PECHE], [78, 66, 18, LILAS], [88, 34, 12, CORAIL],
  [18, 48, 10, PECHE], [42, 82, 14, LILAS], [58, 76, 10, CORAIL], [72, 44, 8, LILAS], [50, 12, 12, PECHE], [92, 78, 10, PECHE], [8, 84, 14, CORAIL]]
const Etoile = ({ c, className = '' }) => (
  <svg viewBox="0 0 24 24" fill={c} className={className} style={{ filter: `drop-shadow(0 0 5px ${c})` }}><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
)
// Texte dont les lettres montent une à une
const Lettres = ({ t, d = 0, className = '' }) => (
  <span className={className} aria-label={t}>
    {[...t].map((ch, i) => (
      <span key={i} aria-hidden="true" className="inline-block -mb-[.15em] overflow-hidden pb-[.15em] align-bottom">
        <motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: .8, delay: d + i * .045, ease: [.22, 1, .36, 1] }}>{ch === ' ' ? ' ' : ch}</motion.span>
      </span>
    ))}
  </span>
)
function Compteur() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t0 = performance.now(); let r
    const f = (t) => { const k = Math.min(1, (t - t0) / 2900); setN(Math.round(k * 100)); if (k < 1) r = requestAnimationFrame(f) }
    r = requestAnimationFrame(f); return () => cancelAnimationFrame(r)
  }, [])
  return <>{String(n).padStart(3, '0')}</>
}
export default function Rideau() {
  const reduit = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const [mode, setMode] = useState(reduit ? null : 'intro')
  const [origine, setOrigine] = useState('50% 50%')
  const cible = useRef(null), clic = useRef('50% 50%')
  const fin = () => { setMode(null); document.documentElement.style.overflow = '' }
  useEffect(() => {
    const p = (e) => { clic.current = `${(e.clientX / innerWidth) * 100}% ${(e.clientY / innerHeight) * 100}%` }
    const h = (e) => { cible.current = e.detail.id; setOrigine(clic.current); setMode(e.detail.mode) }
    addEventListener('pointerdown', p); addEventListener('rideau', h)
    return () => { removeEventListener('pointerdown', p); removeEventListener('rideau', h) }
  }, [])
  useEffect(() => {
    if (!mode) return
    const t = []
    if (mode === 'intro') {
      document.documentElement.style.overflow = 'hidden'
      t.push(setTimeout(fin, 3500))
    } else {
      t.push(setTimeout(() => saut(cible.current, true), 700), setTimeout(fin, 1600))
    }
    return () => t.forEach(clearTimeout)
  }, [mode])
  const intro = mode === 'intro'
  return (
    <AnimatePresence>
      {mode && (
        <motion.div key={mode} role="status" aria-label="Chargement"
          initial={intro ? { y: 0 } : { clipPath: `circle(0% at ${origine})` }}
          animate={intro ? { y: 0 } : { clipPath: `circle(150% at ${origine})` }}
          exit={intro ? { y: '-108%' } : { clipPath: `circle(0% at ${origine})` }}
          transition={{ duration: intro ? 1 : .85, ease: [.76, 0, .24, 1] }}
          style={intro ? { borderRadius: '0 0 50% 50% / 0 0 14vh 14vh' } : undefined}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#2b1d4a_0%,#1a1230_55%,#120c20_100%)] text-[#f3ebff]">
          {intro ? (
            <>
              {/* lueurs douces qui dérivent */}
              <motion.div animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-[10vw] top-[5vh] h-[50vw] w-[50vw] rounded-full bg-[#493be5]/40 blur-3xl" />
              <motion.div animate={{ x: [0, -50, 0], y: [0, -50, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-[10vw] bottom-0 h-[55vw] w-[55vw] rounded-full bg-[#8b78ff]/25 blur-3xl" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-1/3 top-1/3 h-[30vw] w-[30vw] rounded-full bg-[#9fe3c8]/12 blur-3xl" />
              {ETINCELLES.map(([l, h, s, c], i) => (
                <motion.span key={i} className="absolute" style={{ left: `${l}%`, top: `${h}%`, width: s, height: s }}
                  animate={{ opacity: [.2, 1, .2], scale: [.6, 1.2, .6], y: [0, -14, 0] }} transition={{ duration: 2.6 + (i % 4) * .6, repeat: Infinity, delay: i * .18 }}>
                  <Etoile c={c} className="h-full w-full" />
                </motion.span>
              ))}
              <span className="absolute left-6 top-6 text-xs tracking-[.3em] text-[#c9b5ff]">{site.nom}</span>
              <button onClick={fin} className="absolute right-6 top-5 rounded-full border border-[#c9b5ff]/40 px-4 py-1.5 text-xs tracking-widest text-[#c9b5ff] transition hover:bg-[#c9b5ff] hover:text-[#20162c]">Passer l'intro ↗</button>
              <div className="relative flex flex-col items-center">
                <Monogramme anime delai={.2} couleur="#d7cbff" etoile="#9fe3c8" className="h-32 w-32 md:h-44 md:w-44" />
                <p className="mt-6 font-titre text-4xl sm:text-6xl md:text-7xl"><Lettres t="Un peu " d={1.1} /><em className="text-[#c9b5ff]"><Lettres t="de magie." d={1.5} /></em></p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="mt-4 text-[10px] tracking-[.3em] text-[#f3ebff]/70 md:text-xs">PRÉPARATION DE L'UNIVERS…</motion.p>
              </div>
              <span className="absolute bottom-8 right-6 font-titre text-2xl tabular-nums text-[#c9b5ff] md:right-12"><Compteur /></span>
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.9, ease: 'linear' }} className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[#8b78ff]" />
            </>
          ) : (
            <>
              {/* pluie d'étoiles qui jaillit du centre */}
              {Array.from({ length: 14 }, (_, i) => {
                const a = (i / 14) * Math.PI * 2, r = 150 + (i % 3) * 90
                return (
                  <motion.span key={i} className="absolute h-5 w-5" initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: Math.cos(a) * r, y: Math.sin(a) * r, scale: [0, 1.3, 0], opacity: [1, 1, 0] }} transition={{ duration: 1.1, delay: .3 + (i % 4) * .05, ease: 'easeOut' }}>
                    <Etoile c={i % 2 ? LILAS : PECHE} className="h-full w-full" />
                  </motion.span>
                )
              })}
              <Monogramme anime delai={.15} couleur="#f3ebff" etoile="#9fe3c8" className="h-28 w-28 md:h-36 md:w-36" />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
