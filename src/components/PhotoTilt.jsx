import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
// Photo en arche. L'effet du SURVOL (inclinaison, lueur, étoile) se déclenche AUSSI quand on fait défiler la page.
export default function PhotoTilt({ src, alt, progress }) {
  const box = useRef()
  const { scrollYProgress: own } = useScroll({ target: box, offset: ['start end', 'end start'] })
  const sp = useSpring(progress ?? own, { stiffness: 80, damping: 20 })
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 15 }), sy = useSpring(my, { stiffness: 120, damping: 15 })
  const rx = useTransform([sy, sp], ([a, b]) => a * -20 + (b - .5) * -30)
  const ry = useTransform([sx, sp], ([a, b]) => a * 24 + (b - .5) * -50)
  const gx = useTransform([sx, sp], ([a, b]) => a * 50 + (b - .5) * 120)
  const gy = useTransform([sy, sp], ([a, b]) => a * 50 + (b - .5) * -80)
  const ex = useTransform([sx, sp], ([a, b]) => a * -40 + (b - .5) * -70)
  const sc = useTransform(sp, [0, .25, .5, .75, 1], [.88, 1, 1.04, 1, .92])
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - .5); my.set((e.clientY - r.top) / r.height - .5) }
  const leave = () => { mx.set(0); my.set(0) }
  return (
    <div ref={box} onMouseMove={move} onMouseLeave={leave} className="relative mx-auto w-full max-w-sm [perspective:900px]">
      <motion.div style={{ x: gx, y: gy }} className="absolute -inset-8 rounded-full bg-violet-doux/40 blur-3xl" />
      <motion.div style={{ scale: sc }}>
        <motion.div style={{ rotateX: rx, rotateY: ry }} animate={{ y: [0, -12, 0] }} transition={{ y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
          className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl border border-white/70 shadow-2xl shadow-violet/30">
          <img src={src} alt={alt} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/ella.jpg' }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-violet/20 via-transparent to-white/20" />
        </motion.div>
      </motion.div>
      <motion.svg style={{ x: ex }} animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-3 -right-3 h-14 w-14 text-rose drop-shadow-[0_0_10px_#8f7dff]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></motion.svg>
    </div>
  )
}