import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { site, nav } from '../data/siteData'
import { goTo } from '../utils/goTo'
import Monogramme from './Monogramme'
const P = {
  son: 'M11 5 6 9H2v6h4l5 4V5zm4.5 3.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13',
  mute: 'M11 5 6 9H2v6h4l5 4V5zm5 4 6 6m0-6-6 6',
  pause: 'M8 5v14M16 5v14', lune: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  soleil: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4', play: 'M7 4l13 8-13 8V4z', menu: 'M3 6h18M3 12h18M3 18h18', close: 'M6 6l12 12M18 6 6 18',
}
const Ico = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
)
export default function Header({ audio, theme }) {
  const [actif, setActif] = useState('#accueil')
  const [ouvert, setOuvert] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActif('#' + e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    nav.forEach((n) => { const el = document.querySelector(n.id); el && obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  const aller = (id) => { setOuvert(false); setTimeout(() => goTo(id), 50) }
  const rond = 'flex h-10 w-10 items-center justify-center rounded-full border border-violet/20 bg-white/60 text-violet transition hover:bg-violet hover:text-white'
  return (
    <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .8 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-violet/15 bg-white/60 backdrop-blur-md">
      <div className="flex items-center justify-between px-5 py-3 md:px-12">
        <button onClick={() => aller('#accueil')} className="flex items-center gap-3 text-left" aria-label="Accueil">
          <Monogramme className="h-12 w-12" />
          <span className="hidden text-sm leading-tight text-texte/80 sm:block">
            {site.nom}<br />{site.slogan}
          </span>
        </button>
        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {nav.map((n) => (
            <a key={n.id} href={n.id} onClick={(e) => { e.preventDefault(); goTo(n.id) }} className={`nav-link ${actif === n.id ? 'actif' : ''}`}>{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={theme.toggle} className={rond} aria-label={theme.dark ? 'Passer en mode jour' : 'Passer en mode nuit'}><Ico d={theme.dark ? P.soleil : P.lune} /></button>
          <button onClick={audio.toggleSon} className={rond} aria-label="Activer ou couper le son"><Ico d={audio.muted || !audio.playing ? P.mute : P.son} /></button>
          <button onClick={audio.togglePause} className={rond} aria-label="Pause ou lecture de la musique"><Ico d={audio.playing ? P.pause : P.play} /></button>
          <motion.a href="#contact" onClick={(e) => { e.preventDefault(); goTo('#contact') }} whileHover={{ scale: 1.05 }}
            className="hidden rounded-full border border-violet/30 px-6 py-2.5 text-sm text-violet transition hover:bg-violet hover:text-white md:block">Parlons-en ↗</motion.a>
          <button onClick={() => setOuvert(!ouvert)} className={`${rond} lg:hidden`} aria-label="Menu"><Ico d={ouvert ? P.close : P.menu} /></button>
        </div>
      </div>
      {ouvert && (
        <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 px-5 pb-5 lg:hidden">
          {[...nav, { label: 'Parlons-en ↗', id: '#contact' }].map((n) => (
            <button key={n.label} onClick={() => aller(n.id)} className="rounded-xl px-4 py-3 text-left text-violet hover:bg-violet/10">{n.label}</button>
          ))}
        </motion.nav>
      )}
    </motion.header>
  )
}