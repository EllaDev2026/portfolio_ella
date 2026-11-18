import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { site } from '../data/siteData'
import { goTo } from '../utils/goTo'
import Poudre from './Poudre'
import PhotoVague from './PhotoVague'
import { IconeLinkedin, IconeMail } from './Icones'
const D = 3.6 // on attend la fin de l'intro EM avant d'animer (en secondes)
const S = 'https://cdn.simpleicons.org/'
const reseaux = [
  { n: 'GitHub', url: site.liens.github, i: S + 'github/181717' },
  { n: 'WhatsApp', url: site.liens.whatsapp, i: S + 'whatsapp/25D366' },
  { n: 'LinkedIn', url: site.liens.linkedin, Svg: IconeLinkedin, couleur: '#0A66C2' },
  { n: 'E-mail', url: `mailto:${site.email}`, Svg: IconeMail, couleur: '#EA4335' },
].filter((r) => r.url) // un réseau sans lien n'est pas affiché
// Une ligne de titre dont les mots montent un par un
const Ligne = ({ texte, delai, italique }) => (
  <span className="block">
    {texte.split(' ').map((m, i) => (
      <span key={i} className="mr-[.25em] inline-block overflow-hidden pb-[.12em] align-bottom">
        <motion.span className={`inline-block ${italique ? 'italic text-rose' : ''}`} initial={{ y: '110%' }} animate={{ y: 0 }}
          transition={{ delay: delai + i * .12, duration: .9, ease: [.22, 1, .36, 1] }}>{m}</motion.span>
      </span>
    ))}
  </span>
)
// Grande étoile « 3D » avec son anneau
const EtoileSvg = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_0_25px_rgba(196,181,253,.8)]">
    <defs>
      <linearGradient id="gEtoile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f1ebff" /><stop offset=".5" stopColor="#c9b5ff" /><stop offset="1" stopColor="#8f7dff" />
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="100" rx="95" ry="36" fill="none" stroke="url(#gEtoile)" strokeWidth="5" opacity=".55" transform="rotate(-25 100 100)" />
    <path d="M100 8 Q112 88 192 100 Q112 112 100 192 Q88 112 8 100 Q88 88 100 8Z" fill="url(#gEtoile)" />
    <path d="M100 22 Q106 80 100 100 Q94 80 100 22Z" fill="#fff" opacity=".55" />
    <path d="M10 100 A95 36 0 0 0 190 100" fill="none" stroke="url(#gEtoile)" strokeWidth="5" transform="rotate(-25 100 100)" />
  </svg>
)
export default function Accueil() {
  const ref = useRef(), etoile = useRef()
  const reduit = useReducedMotion()
  // p = progression du défilement dans la page d'accueil (0 en haut → 1 à la fin)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Distance de déplacement de la photo vers la gauche (calculée selon l'écran)
  const dx = useMotionValue(-500), dy = useMotionValue(0), fin = useMotionValue(.96)
  useEffect(() => {
    const f = () => { const w = innerWidth, h = innerHeight, m = w < 1024; dx.set(m ? -.1 * w : -.55 * w); dy.set(m ? -.22 * h : 0); fin.set(m ? .78 : .96) }
    f(); addEventListener('resize', f); return () => removeEventListener('resize', f)
  }, [dx, dy, fin])
  const ease = (v) => { const t = Math.min(Math.max(v / .5, 0), 1); return t * t * (3 - 2 * t) }
  const x = useTransform([p, dx], ([v, d]) => ease(v) * d)        // ← la photo va à gauche quand on descend, et revient à droite quand on remonte
  const y = useTransform([p, dy], ([v, d]) => ease(v) * d)
  const sc = useTransform([p, fin], ([v, s]) => 1 + (s - 1) * ease(v))
  const rot = useTransform(p, [0, .5], [0, -6])
  const ouverture = useTransform(p, [.08, .42], [0, 1])           // ← 0 = yeux fermés, 1 = yeux ouverts
  const texteO = useTransform(p, [0, .28], [1, 0]), texteX = useTransform(p, [0, .3], [0, -100])
  const panneauO = useTransform(p, [.38, .62], [0, 1]), panneauX = useTransform(p, [.38, .62], [90, 0])
  const clic = useTransform(p, (v) => (v > .4 ? 'auto' : 'none'))
  const aideO = useTransform(p, [0, .1], [1, 0])
  const etoileRot = useTransform(p, [0, 1], [0, 540])
  // 🎛️ Interaction 3D + parallaxe avec la souris
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 14 }), sy = useSpring(my, { stiffness: 90, damping: 14 })
  const rotY = useTransform(sx, [-.5, .5], [-16, 16])
  const rotX = useTransform(sy, [-.5, .5], [14, -14])
  const photoX = useTransform(sx, [-.5, .5], [14, -14]), photoY = useTransform(sy, [-.5, .5], [14, -14])
  const cerclesX = useTransform(sx, [-.5, .5], [-26, 26]), cerclesY = useTransform(sy, [-.5, .5], [-26, 26])
  const starX = useTransform(sx, [-.5, .5], [-44, 44]), starY = useTransform(sy, [-.5, .5], [-44, 44])
  const bouge = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - .5); my.set((e.clientY - r.top) / r.height - .5) }
  const quitte = () => { mx.set(0); my.set(0) }
  return (
    <section id="accueil" ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Poudre cibleRef={etoile} />
        <div className="relative mx-auto h-full max-w-7xl px-6 md:px-12">
          {/* 1) Au début : le titre à gauche */}
          <motion.div style={{ opacity: texteO, x: texteX }} className="pointer-events-none absolute left-6 right-6 top-28 lg:right-auto lg:top-1/2 lg:max-w-[54%] lg:-translate-y-1/2 md:left-12">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D }} className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[.25em] text-texte/80">
              <span className="h-2 w-2 rounded-full bg-violet" /> {site.nom} <span className="opacity-50">—</span> {site.titre}
            </motion.p>
            <h1 className="font-titre text-4xl leading-[1.02] text-violet sm:text-5xl lg:text-7xl xl:text-8xl" aria-label="Pensée avec soin, magique par le code.">
              <Ligne texte="Pensée avec soin," delai={D} />
              <Ligne texte="magique par le code." delai={D + .4} italique />
            </h1>
          </motion.div>
          {/* 2) Quand on descend : boutons + réseaux, à droite */}
          <div className="absolute z-20 inset-x-6 bottom-8 md:inset-x-12 lg:inset-x-auto lg:bottom-auto lg:right-12 lg:top-1/2 lg:w-[38%] lg:-translate-y-1/2">
            <motion.div style={{ opacity: panneauO, x: panneauX, pointerEvents: clic }}>
              <h2 className="font-titre text-4xl leading-tight sm:text-5xl lg:text-6xl">Créons quelque chose <em className="text-rose">d'utile.</em></h2>
              <div className="mt-6 flex flex-wrap gap-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} onClick={() => goTo('#projets')} className="rounded-full bg-violet px-7 py-3 text-white shadow-lg shadow-violet/30">Voir mes projets</motion.button>
                <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} href={site.cv} download className="rounded-full border border-violet/40 bg-white/60 px-7 py-3 text-violet">Télécharger mon CV</motion.a>
              </div>
              <div className="mt-6 flex gap-4">
                {reseaux.map((r) => (
                  <a key={r.n} href={r.url} target={r.url.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer" aria-label={r.n} className="social flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md">{r.Svg ? <r.Svg className="h-6 w-6" style={{ color: r.couleur }} /> : <img src={r.i} alt={r.n} width="26" height="26" />}</a>
                ))}
              </div>
            </motion.div>
          </div>
          {/* La photo : à droite au début, glisse à gauche en descendant, les yeux s'ouvrent */}
          <div className="pointer-events-none absolute z-10 left-1/2 top-[62%] w-60 -translate-x-1/2 -translate-y-1/2 sm:w-72 lg:left-auto lg:right-[8%] lg:top-1/2 lg:w-[34%] lg:max-w-md lg:translate-x-0">
            <motion.div onMouseMove={bouge} onMouseLeave={quitte} initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: D + .2, duration: 1.1 }}>
              <motion.div style={{ perspective: 1100, x, y, rotate: rot, scale: sc }} className="pointer-events-auto relative aspect-[4/5] w-full">
                <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="absolute inset-0">
                  <motion.div style={{ x: cerclesX, y: cerclesY, z: -60 }} className="absolute inset-0">
                    <div className="absolute -inset-10 rounded-full border border-violet/20" />
                    <div className="absolute -inset-4 rounded-full border border-violet/15" />
                    <div className="absolute -inset-2 rotate-[-25deg] rounded-full border-[22px] border-[#c9b5ff] border-b-transparent border-r-transparent opacity-90" />
                  </motion.div>
                  <motion.div style={{ x: photoX, y: photoY }} className="absolute inset-5">
                    <motion.div animate={reduit ? {} : { y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative h-full w-full overflow-hidden rounded-[50%] shadow-2xl shadow-violet/40">
                      <PhotoVague src={site.photoAccueil} sprite={site.photoAccueilYeux} ouverture={ouverture} alt="Portrait d'Ella Michelle" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-violet/20 via-transparent to-white/10" />
                    </motion.div>
                  </motion.div>
                  <motion.div ref={etoile} style={{ x: starX, y: starY, z: 120, rotate: etoileRot }} className="absolute -right-6 top-2 h-32 w-32 md:h-44 md:w-44">
                    <motion.div className="h-full w-full" animate={reduit ? {} : { rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}><EtoileSvg /></motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          <motion.p style={{ opacity: aideO }} className="absolute bottom-6 left-6 text-xs uppercase tracking-[.3em] text-texte/70 md:left-12">↓ Fais défiler</motion.p>
        </div>
      </div>
    </section>
  )
}