import { useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/siteData'
import { rejouerIntro } from '../utils/goTo'
// Bulle en bas à gauche : « Son on » + nom ; le « + » ouvre pause/lecture et volume. Bouton « Rejouer l'intro » en bas à droite.
export default function PanneauSon({ audio }) {
  const [ouvert, setOuvert] = useState(false)
  const on = audio.playing && !audio.muted
  return (
    <>
      <div className="fixed bottom-4 left-4 z-40 overflow-hidden rounded-3xl border border-violet/25 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={audio.toggleSon} className="flex items-center gap-3 text-left" aria-label="Activer ou couper le son">
            <span className="flex h-6 items-center gap-[3px] text-violet" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <motion.span key={i} className="w-[3px] rounded bg-violet" animate={on ? { height: [6, 22, 10, 18, 6] } : { height: 6 }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * .15 }} />
              ))}
            </span>
            <span className="leading-tight">
              <span className="block text-sm text-texte">Son {on ? 'on' : 'off'}</span>
              <span className="block text-[11px] text-texte/60">{site.nomMusique}</span>
            </span>
          </button>
          <button onClick={() => setOuvert(!ouvert)} aria-expanded={ouvert} aria-label="Réglages du son" className="text-xl text-texte/80 transition hover:text-violet">{ouvert ? '−' : '+'}</button>
        </div>
        {ouvert && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex items-center gap-4 border-t border-violet/15 px-4 py-3">
            <button onClick={audio.togglePause} className="rounded-full border border-violet/30 px-4 py-1.5 text-xs text-violet transition hover:bg-violet hover:text-white">{audio.playing ? 'Pause' : 'Lecture'}</button>
            <input type="range" min="0" max="1" step="0.05" value={audio.volume} onChange={(e) => audio.setVolume(+e.target.value)} aria-label="Volume" className="w-28 accent-[#8f7dff]" />
          </motion.div>
        )}
      </div>
      <button onClick={rejouerIntro} className="fixed bottom-4 right-4 z-40 rounded-full border border-violet/25 bg-white/60 px-5 py-3 text-sm text-texte backdrop-blur-md transition hover:bg-violet hover:text-white">Rejouer l'intro ✦</button>
    </>
  )
}