import { useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import { site } from './data/siteData'
import Curseur from './components/Curseur'
import Header from './components/Header'
import Accueil from './components/Accueil'
import APropos from './components/APropos'
import Competences from './components/Competences'
import Projets from './components/Projets'
import Parcours from './components/Parcours'
import Contact from './components/Contact'
import Rideau from './components/Rideau'
import PanneauSon from './components/PanneauSon'
export default function App() {
  const audio = useRef(null)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const dernierAuto = useRef(0) // moment du dernier démarrage automatique de la musique
  const [st, setSt] = useState({ playing: false, muted: false, volume: 0.5 })
  // Défilement fluide (désactivé si la personne préfère moins d'animations)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis(); window.__lenis = lenis
    let raf; const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null }
  }, [])
  // Suivi de l'état de la musique
  useEffect(() => {
    const a = audio.current, s = () => setSt({ playing: !a.paused, muted: a.muted, volume: a.volume })
    a.volume = 0.5 // volume doux au départ
    const ev = ['play', 'pause', 'volumechange']
    ev.forEach((e) => a.addEventListener(e, s))
    // 🎵 Musique automatique : on essaie dès l'ouverture. Si le navigateur refuse (c'est une règle de sécurité),
    // la musique démarre au tout premier clic, toucher ou touche du clavier.
    a.play().catch(() => {})
    const premier = () => { if (a.paused) { dernierAuto.current = performance.now(); a.play().catch(() => {}) } quitter() }
    const types = ['pointerdown', 'keydown', 'touchstart']
    const quitter = () => types.forEach((t) => removeEventListener(t, premier))
    types.forEach((t) => addEventListener(t, premier))
    return () => { ev.forEach((e) => a.removeEventListener(e, s)); quitter() }
  }, [])
  // Le 1er clic qui lance la musique automatiquement ne la coupe pas aussitôt
  const toggleSon = () => { if (performance.now() - dernierAuto.current < 700) return; const a = audio.current; if (a.paused) { a.muted = false; a.play().catch(() => {}) } else a.muted = !a.muted }
  const togglePause = () => { if (performance.now() - dernierAuto.current < 700) return; const a = audio.current; a.paused ? a.play().catch(() => {}) : a.pause() }
  const setVolume = (v) => { audio.current.volume = v }
  // 🌙 Bouton lune : bascule jour/nuit avec un cercle de lumière qui part du bouton
  const toggle = (e) => {
    const r = e.currentTarget.getBoundingClientRect(), root = document.documentElement
    root.style.setProperty('--x', r.left + r.width / 2 + 'px'); root.style.setProperty('--y', r.top + r.height / 2 + 'px')
    const change = () => {
      const d = !root.classList.contains('dark'); root.classList.toggle('dark', d); setDark(d)
      try { localStorage.setItem('theme', d ? 'dark' : 'light') } catch {}
    }
    document.startViewTransition ? document.startViewTransition(change) : change()
  }
  return (
    <MotionConfig reducedMotion="user">
      <audio ref={audio} src={site.musique} loop preload="auto" />
      <div className="ciel" aria-hidden="true" />
      <Rideau />
      <Curseur />
      <Header audio={{ ...st, toggleSon, togglePause }} theme={{ dark, toggle }} />
      <PanneauSon audio={{ ...st, toggleSon, togglePause, setVolume }} />
      <main><Accueil /><APropos /><Competences /><Projets /><Parcours /><Contact /></main>
    </MotionConfig>
  )
}