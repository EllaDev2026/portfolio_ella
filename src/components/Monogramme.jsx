import { motion } from 'framer-motion'
// 🪄 Monogramme « EM » dans un anneau ouvert, avec une étoile ✦ de magie qui s'échappe de l'ouverture.
// anime = les traits se dessinent un à un (utilisé dans l'intro). couleur / etoile : change les couleurs ici ou depuis l'appelant.
const trait = { fill: 'none', strokeWidth: 3.4, strokeLinecap: 'round', strokeLinejoin: 'round' }
export default function Monogramme({ className = '', couleur = 'var(--color-violet)', etoile = 'var(--color-violet-doux)', anime = false, delai = 0 }) {
  const dessin = (i) => anime
    ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.1, delay: delai + i * 0.28, ease: 'easeInOut' } }
    : {}
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="Monogramme EM" className={className} stroke={couleur} style={{ overflow: 'visible' }}>
      <motion.path d="M79.1 29.6 A38 38 0 1 1 56.6 16.6" {...trait} {...dessin(0)} />
      <motion.path d="M41 41 H29 V67 H41 M29 54 H39" {...trait} {...dessin(2)} />
      <motion.path d="M48 67 V41 L60.5 57 L73 41 V67" {...trait} {...dessin(3)} />
      <motion.path d="M74 10.5 L76.6 17.4 L83.5 20 L76.6 22.6 L74 29.5 L71.4 22.6 L64.5 20 L71.4 17.4Z" fill={etoile} stroke="none"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        {...(anime ? { initial: { scale: 0, rotate: -90, opacity: 0 }, animate: { scale: 1, rotate: 0, opacity: 1 }, transition: { duration: 0.8, delay: delai + 1.5, ease: [0.22, 1, 0.36, 1] } } : {})} />
    </svg>
  )
}
