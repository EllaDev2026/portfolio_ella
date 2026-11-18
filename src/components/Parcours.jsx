import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formation, experience } from '../data/siteData'
import { Titre } from './Reveal'
export default function Parcours() {
  const [onglet, setOnglet] = useState('Formation')
  const liste = onglet === 'Formation' ? formation : experience
  return (
    <section id="parcours" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <Titre label="Parcours">Formation & expérience</Titre>
      <div className="mx-auto mb-12 flex w-fit rounded-full border border-violet/20 bg-white/60 p-1.5">
        {['Expérience', 'Formation'].map((o) => (
          <button key={o} onClick={() => setOnglet(o)} className={`relative rounded-full px-8 py-2.5 text-sm transition-colors ${onglet === o ? 'text-white' : 'text-violet'}`}>
            {onglet === o && <motion.span layoutId="pilule" className="absolute inset-0 rounded-full bg-violet" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
            <span className="relative">{o}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.ul key={onglet} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .45 }}>
          {liste.map((l) => (
            <li key={l.titre} className="grid gap-4 border-b border-violet/15 py-8 md:grid-cols-[1.3fr_.6fr_1.1fr] md:items-center">
              <div>
                <h3 className="font-titre text-xl font-bold text-texte md:text-2xl">{l.titre}</h3>
                {l.lieu && <p className="mt-1 font-medium text-rose">{l.lieu}</p>}
              </div>
              <p className="font-titre text-xl text-violet">{l.periode}</p>
              {l.desc && <p className="border-l-2 border-rose pl-5 text-sm leading-relaxed text-texte/80">{l.desc}</p>}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </section>
  )
}
