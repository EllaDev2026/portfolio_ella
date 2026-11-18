// Va vers une section avec la transition « EM + magie » (ou défilement simple si animations réduites)
const reduit = () => matchMedia('(prefers-reduced-motion: reduce)').matches
export const saut = (id, immediat) =>
  window.__lenis ? window.__lenis.scrollTo(id, { offset: -70, immediate: immediat })
    : document.querySelector(id)?.scrollIntoView({ behavior: immediat ? 'auto' : 'smooth' })
export const goTo = (id) => {
  if (reduit()) return saut(id, false)
  dispatchEvent(new CustomEvent('rideau', { detail: { mode: 'trans', id } }))
}
export const rejouerIntro = () => dispatchEvent(new CustomEvent('rideau', { detail: { mode: 'intro' } }))
