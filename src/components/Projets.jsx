import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { projets } from '../data/siteData'
import { Titre, Reveal } from './Reveal'

const avecEcrans = projets.filter((p) => p.ecrans?.length)
// Cartes masquées tant que les captures d'AlertProbSci et de la prise en charge ne sont pas prêtes.
// Pour les remettre : remplace [] par  projets.filter((p) => !p.ecrans?.length)
const autres = []

// Un segment de la barre de progression : se remplit pendant qu'on regarde l'écran correspondant
function Segment({ p, i, n, couleur }) {
  const w = useTransform(p, [i / n, (i + 1) / n], ['0%', '100%'])
  return (
    <span className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: couleur + '33' }}>
      <motion.span style={{ width: w, background: couleur }} className="block h-full" />
    </span>
  )
}

// 🎞️ Vitrine : la section reste fixe, et en défilant chaque écran du téléphone passe au premier plan.
// Cliquer sur un écran ouvre le site du projet.
function Vitrine({ pr }) {
  const ref = useRef(null)
  const n = pr.ecrans.length
  const c = (n - 1) / 2
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [idx, setIdx] = useState(0)
  useMotionValueEvent(p, 'change', (v) => setIdx(Math.min(n - 1, Math.max(0, Math.floor(v * n)))))
  const barre = useTransform(p, [0, 1], [0, 1])
  const mot = useTransform(p, [0, 1], ['8%', '-8%'])
  const e = pr.ecrans[idx]
  return (
    <div ref={ref} style={{ height: `${n * 90 + 70}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center px-3 pb-4 pt-20 md:px-8">
        <div className="relative flex h-full w-full overflow-hidden rounded-[2rem] border border-violet/10"
          style={{ background: `linear-gradient(135deg, ${pr.couleur}26, ${pr.couleur}0d 60%, transparent)` }}>
          {/* barre de progression du haut */}
          <motion.div style={{ scaleX: barre, background: pr.couleur }} className="absolute inset-x-0 top-0 z-20 h-[3px] origin-left" />
          {/* mot géant en fond qui glisse doucement */}
          <motion.span aria-hidden="true" style={{ x: mot, color: pr.couleur }}
            className="pointer-events-none absolute -bottom-[4vw] left-1/4 select-none font-titre text-[34vw] italic leading-none opacity-[.08] md:text-[22vw]">{pr.mot}</motion.span>

          <div className="relative z-10 grid w-full grid-rows-[auto_1fr] items-center gap-2 p-5 md:grid-cols-[minmax(0,.85fr)_minmax(0,1.5fr)] md:grid-rows-1 md:gap-6 md:p-12">
            {/* texte à gauche */}
            <div>
              <div className="flex items-center gap-3">
                {pr.logo && <img src={pr.logo} alt={`Logo ${pr.nom}`} className="h-10 w-10 rounded-xl bg-white object-contain p-1 shadow md:h-12 md:w-12" />}
                <span className="rounded-full border px-3 py-0.5 text-xs" style={{ borderColor: pr.couleur, color: pr.couleur }}>Étude de cas</span>
              </div>
              <h3 className="mt-3 font-titre text-4xl text-violet md:mt-5 md:text-7xl">{pr.nom}</h3>
              <div className="mt-2 min-h-[3.5rem] md:mt-5 md:min-h-[4.5rem]">
                <AnimatePresence mode="wait">
                  <motion.p key={idx} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }}
                    className="text-base text-texte md:text-xl"><b>{e.titre}</b> : {e.legende}</motion.p>
                </AnimatePresence>
              </div>
              <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-texte/70 md:block">{pr.description}</p>
              <div className="mt-3 flex gap-2 md:mt-6 md:max-w-md">
                {pr.ecrans.map((_, i) => <Segment key={i} p={p} i={i} n={n} couleur={pr.couleur} />)}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 md:mt-7">
                <a href={pr.lien} target="_blank" rel="noreferrer" style={{ background: pr.couleur }}
                  className="rounded-full px-6 py-2.5 text-sm font-semibold !text-white transition hover:brightness-125 md:px-7 md:py-3">Voir le site ↗</a>
                <span className="hidden text-xs uppercase tracking-widest text-violet/60 lg:block">Clique sur un écran</span>
              </div>
            </div>

            {/* téléphones en éventail à droite */}
            <motion.div initial="cache" whileInView="montre" viewport={{ once: true, amount: 0.3 }} className="flex items-center justify-center md:justify-start lg:justify-center">
              {pr.ecrans.map((s, i) => {
                const d = i - c, actif = i === idx
                return (
                  <motion.div key={s.src} custom={d} style={{ zIndex: actif ? 20 : 10 - Math.round(Math.abs(d)) }}
                    variants={{ cache: (k) => ({ opacity: 0, y: 160, rotate: k * 16 }), montre: { opacity: 1, y: 0, rotate: 0, transition: { delay: i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}
                    className={i ? '-ml-[5vw] md:-ml-[1.5vw]' : ''}>
                    <motion.a href={pr.lien} target="_blank" rel="noreferrer" aria-label={`Ouvrir ${pr.nom} : écran ${s.titre}`}
                      animate={actif ? { y: -18, scale: 1.1, rotate: 0, opacity: 1 } : { y: Math.abs(d) * 10, scale: 1, rotate: d * 4, opacity: 0.8 }}
                      whileHover={{ y: -28, scale: 1.14, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                      className="block aspect-[9/20] h-[min(40vh,56vw)] overflow-hidden rounded-[1.4rem] border-[5px] border-neutral-900 bg-neutral-900 shadow-2xl md:h-[min(60vh,28vw)] md:rounded-[1.8rem]"
                      style={{ boxShadow: actif ? `0 25px 60px ${pr.couleur}66` : '0 15px 35px rgba(0,0,0,.25)' }}>
                      <img src={s.src} alt={`Écran ${s.titre} de ${pr.nom}`} loading="lazy" className="h-full w-full object-cover" />
                    </motion.a>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Carte({ p }) {
  const [ouvert, setOuvert] = useState(false)
  return (
    <motion.article whileHover={{ y: -8 }} className="group flex w-full flex-col overflow-hidden rounded-3xl border border-white bg-white/70 shadow-lg shadow-violet/10">
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-violet via-violet-doux to-lavande-fonce md:h-44">
        {p.image
          ? <img src={p.image} alt={`Capture du projet ${p.nom}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
          : <span className="flex h-full items-center justify-center font-titre text-6xl text-white/80 transition duration-700 group-hover:scale-125 group-hover:-rotate-3">{p.nom.slice(0, 2)}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-widest text-rose">{p.type}</p>
        <h3 className="mt-1 font-titre text-2xl text-violet">{p.nom}</h3>
        <p className="mt-2 text-sm leading-relaxed text-texte/80">{p.description}</p>
        <AnimatePresence>
          {ouvert && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <p className="mt-3 border-l-2 border-rose pl-4 text-sm text-texte/80"><b className="text-violet">Ma contribution : </b>{p.contribution || 'À compléter.'}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          <button onClick={() => setOuvert(!ouvert)} aria-expanded={ouvert} className="rounded-full bg-violet px-5 py-2 text-sm text-white transition hover:bg-violet-doux">{ouvert ? 'Réduire' : 'Découvrir le projet'}</button>
          {p.lien && <a href={p.lien} target="_blank" rel="noreferrer" className="rounded-full border border-violet/40 px-5 py-2 text-sm text-violet transition hover:bg-violet hover:text-white">Voir le projet ↗</a>}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projets() {
  return (
    <section id="projets" className="relative">
      <div className="px-6 pt-24 md:px-12">
        <Titre label="Réalisations">Des idées, <em className="text-rose not-italic">devenues réelles.</em></Titre>
      </div>
      {avecEcrans.map((pr) => <Vitrine key={pr.nom} pr={pr} />)}
      {autres.length > 0 && (
        <div className="px-6 pb-24 pt-16 md:px-12">
          <Reveal><p className="mb-6 text-xs uppercase tracking-[.3em] text-violet/70">Autres réalisations</p></Reveal>
          <div className="grid gap-6 md:grid-cols-2">{autres.map((pr) => <Reveal key={pr.nom}><Carte p={pr} /></Reveal>)}</div>
        </div>
      )}
    </section>
  )
}
