import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
// 👁️ Photo dont les yeux s'ouvrent avec le défilement. force = 0 → photo normale (sans vagues) ; force = 9 → effet vagues.
// - src : la photo yeux ouverts (ella.jpg)
// - sprite : une longue image avec 6 photos côte à côte (yeux fermés → ouverts) = ella-yeux.jpg
// - ouverture : valeur de 0 (yeux fermés) à 1 (yeux ouverts), pilotée par le scroll
export default function PhotoVague({ src, sprite, frames = 6, ouverture, alt, force = 0, vitesse = 1.2 }) {
  const cv = useRef()
  const reduit = useReducedMotion()
  useEffect(() => {
    const c = cv.current, x = c.getContext('2d'), img = new Image(), spr = new Image()
    let raf, okImg = false, okSpr = false, visible = true, dernier = -1, dernierW = 0
    const t0 = performance.now()
    img.onload = () => { okImg = true }
    img.src = src
    if (sprite) { spr.onload = () => { okSpr = true }; spr.src = sprite }
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    obs.observe(c)
    const bandes = 90
    // dessine une image en fines bandes qui se décalent (effet vague)
    const tracer = (source, fx, fw, fh, w, h, tt, alpha) => {
      const ratio = Math.max(w / fw, h / fh) * 1.12
      const sw = w / ratio, sh = h / ratio, sx = fx + (fw - sw) / 2, sy = (fh - sh) * 0.2, bh = h / bandes
      x.globalAlpha = alpha
      if (force === 0) { x.drawImage(source, sx, sy, sw, sh, 0, 0, w, h); x.globalAlpha = 1; return } // photo normale : un seul dessin
      for (let i = 0; i < bandes; i++) {
        const dx = reduit ? 0 : Math.sin(tt * 1.6 + i * 0.18) * force + Math.sin(tt * 0.9 + i * 0.07) * force * 0.5
        x.drawImage(source, sx, sy + i * (sh / bandes), sw, sh / bandes + 1, dx - force * 1.5, i * bh, w + force * 3, bh + 1)
      }
      x.globalAlpha = 1
    }
    const dessiner = (t) => {
      raf = requestAnimationFrame(dessiner)
      if (!visible || (!okImg && !okSpr)) return
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2)
      const o = okSpr ? Math.min(Math.max(ouverture ? ouverture.get() : 1, 0), 1) : 1
      if (force === 0 && o === dernier && w === dernierW) return // rien n'a changé : on ne redessine pas
      dernier = o; dernierW = w
      if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr) }
      x.setTransform(dpr, 0, 0, dpr, 0, 0)
      x.clearRect(0, 0, w, h)
      const tt = ((t - t0) / 1000) * vitesse
      if (okSpr) {
        const pos = o * (frames - 1), i = Math.min(Math.floor(pos), frames - 1), f = pos - i, fw = spr.width / frames
        tracer(spr, i * fw, fw, spr.height, w, h, tt, 1)
        if (f > 0.01 && i < frames - 1) tracer(spr, (i + 1) * fw, fw, spr.height, w, h, tt, f) // fondu entre deux images
      } else tracer(img, 0, img.width, img.height, w, h, tt, 1)
    }
    raf = requestAnimationFrame(dessiner)
    return () => { cancelAnimationFrame(raf); obs.disconnect() }
  }, [src, sprite, frames, ouverture, force, vitesse, reduit])
  return <canvas ref={cv} role="img" aria-label={alt} className="h-full w-full" />
}