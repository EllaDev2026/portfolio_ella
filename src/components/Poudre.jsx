import { useEffect, useRef } from 'react'
// ✨ Poudre d'étoiles multicolore :
//  - elle sort de la grande étoile quand on fait défiler la page
//  - elle jaillit quand le curseur tourne autour de la grande étoile
const COULEURS = ['#493be5', '#c9b5ff', '#9fe3c8', '#7ce7ff', '#d7cbff', '#a78bfa'] // ← change les couleurs ici
export default function Poudre({ cibleRef }) {
  const cv = useRef()
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = cv.current, x = c.getContext('2d')
    let ps = [], raf, dernierY = scrollY
    const taille = () => { c.width = innerWidth; c.height = innerHeight }
    taille(); addEventListener('resize', taille)
    const centre = () => {
      const r = cibleRef.current?.getBoundingClientRect()
      return r && r.bottom > 0 && r.top < innerHeight ? { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 } : null
    }
    const emettre = (px, py, n, force) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, v = Math.random() * force
        ps.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v + .3, l: 1, d: .012 + Math.random() * .02, s: Math.random() * 2.5 + 1, c: COULEURS[(Math.random() * COULEURS.length) | 0] })
      }
      if (ps.length > 450) ps.splice(0, ps.length - 450)
    }
    const bouge = (e) => { const s = centre(); if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) < s.r * 1.8) emettre(e.clientX, e.clientY, 4, 2.2) }
    const defile = () => {
      const dy = Math.abs(scrollY - dernierY); dernierY = scrollY
      const s = centre(); if (s && dy > 0) emettre(s.x + (Math.random() - .5) * s.r, s.y + (Math.random() - .5) * s.r, Math.min(12, 2 + dy / 8), 2.6)
    }
    addEventListener('mousemove', bouge); addEventListener('scroll', defile, { passive: true })
    const boucle = () => {
      const s = centre()
      if (s && Math.random() < .35) emettre(s.x + (Math.random() - .5) * s.r, s.y + (Math.random() - .5) * s.r, 1, .8)
      x.clearRect(0, 0, c.width, c.height)
      ps = ps.filter((p) => p.l > 0)
      ps.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += .02; p.l -= p.d
        x.globalAlpha = Math.max(p.l, 0); x.fillStyle = p.c
        x.beginPath(); x.arc(p.x, p.y, p.s, 0, 6.283); x.fill()
      })
      raf = requestAnimationFrame(boucle)
    }
    boucle()
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', bouge); removeEventListener('scroll', defile); removeEventListener('resize', taille) }
  }, [cibleRef])
  return <canvas ref={cv} className="pointer-events-none fixed inset-0 z-[55]" />
}