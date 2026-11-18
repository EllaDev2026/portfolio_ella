import { useEffect, useRef } from 'react'
// Curseur lumineux + petites étoiles violettes/lavande qui suivent la souris
function etoile(x, px, py, r) {
  x.beginPath()
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2, b = a + Math.PI / 4
    x.lineTo(px + Math.cos(a) * r * 2, py + Math.sin(a) * r * 2)
    x.lineTo(px + Math.cos(b) * r * 0.5, py + Math.sin(b) * r * 0.5)
  }
  x.closePath(); x.fill()
}
export default function Curseur() {
  const dot = useRef(), cv = useRef()
  useEffect(() => {
    if (matchMedia('(hover: none)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = cv.current, x = c.getContext('2d')
    let ps = [], mx = 0, my = 0, dx = 0, dy = 0, raf
    const size = () => { c.width = innerWidth; c.height = innerHeight }
    size(); addEventListener('resize', size)
    const move = (e) => {
      mx = e.clientX; my = e.clientY
      for (let i = 0; i < 2; i++) ps.push({ x: mx, y: my, vx: (Math.random() - .5) * 1.5, vy: Math.random() * 1.2 + .2, l: 1, s: Math.random() * 3 + 2, col: Math.random() > .7 ? '#c9b5ff' : '#8b78ff' })
    }
    addEventListener('mousemove', move)
    const loop = () => {
      dx += (mx - dx) * .18; dy += (my - dy) * .18
      dot.current.style.transform = `translate(${dx}px,${dy}px)`
      x.clearRect(0, 0, c.width, c.height)
      ps = ps.filter((p) => p.l > 0)
      ps.forEach((p) => { p.x += p.vx; p.y += p.vy; p.l -= .02; x.globalAlpha = p.l; x.fillStyle = p.col; etoile(x, p.x, p.y, p.s * p.l) })
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', move); removeEventListener('resize', size) }
  }, [])
  return (
    <>
      <canvas ref={cv} className="curseur pointer-events-none fixed inset-0 z-[60]" />
      <div ref={dot} className="curseur pointer-events-none fixed left-0 top-0 z-[61] -ml-3 -mt-3 h-6 w-6 rounded-full bg-violet/30 ring-2 ring-violet-doux shadow-[0_0_20px_#8b78ff]" />
    </>
  )
}