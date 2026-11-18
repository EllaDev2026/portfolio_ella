import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { site, apropos } from '../data/siteData'
import PhotoTilt from './PhotoTilt'
// Histoire en 3 chapitres : le texte change quand on fait défiler, la photo s'incline en même temps
const chapitres = [
  { lab: "L'étudiante", titre: ['Étudiante', 'en DASI.'], t: [apropos[0]] },
  { lab: 'La développeuse', titre: ['Full-stack,', "de l'interface au serveur."], t: [apropos[1]] },
  { lab: 'La passionnée', titre: ['Passionnée', 'et motivée.'], t: [apropos[2], apropos[3]] },
]
export default function APropos() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [i, setI] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setI(Math.min(2, Math.floor(v * 3))))
  const c = chapitres[i]
  return (
    <section id="apropos" ref={ref} className="relative h-[300vh] bg-white/40">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 pt-20 md:px-12">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[.3em] text-violet/70">À propos · Un peu de mon histoire</p>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: .5 }}>
                <p className="mb-2 text-sm tracking-widest text-rose">0{i + 1} · {c.lab.toUpperCase()}</p>
                <h2 className="font-titre text-4xl leading-tight text-violet md:text-6xl">{c.titre[0]} <em className="text-rose not-italic">{c.titre[1]}</em></h2>
                <div className="mt-5 space-y-3 text-base leading-relaxed text-texte/85 md:text-lg">{c.t.map((t) => <p key={t}>{t}</p>)}</div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex items-center gap-3 text-xs tracking-widest text-violet">
              {[0, 1, 2].map((k) => <span key={k} className={`transition ${k === i ? 'font-bold' : 'opacity-40'}`}>0{k + 1}</span>)}
              <span className="ml-3 opacity-60">DÉFILE POUR DÉPLIER ↓</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[200px] lg:max-w-none"><PhotoTilt src={site.photoAPropos} alt="Ella Michelle" progress={scrollYProgress} /></div>
        </div>
      </div>
    </section>
  )
}
