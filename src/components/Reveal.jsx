import { motion } from 'framer-motion'
// Fait apparaître le contenu en glissant vers le haut quand on arrive dessus
export function Reveal({ children, delay = 0, className = '', y = 40 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}
export function Titre({ label, children }) {
  return (
    <Reveal className="mb-12">
      <p className="mb-3 text-xs uppercase tracking-[.3em] text-violet/70">{label}</p>
      <h2 className="font-titre text-4xl text-violet md:text-6xl">{children}</h2>
    </Reveal>
  )
}
