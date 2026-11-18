import { useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/siteData'
import { Reveal } from './Reveal'
import { goTo, rejouerIntro } from '../utils/goTo'
import { IconeLinkedin, IconeMail } from './Icones'
const S = 'https://cdn.simpleicons.org/'
const reseaux = [
  { n: 'LinkedIn', url: site.liens.linkedin, Svg: IconeLinkedin, couleur: '#0A66C2' },
  { n: 'GitHub', url: site.liens.github, i: S + 'github/181717' },
  { n: 'WhatsApp', url: site.liens.whatsapp, i: S + 'whatsapp/25D366' },
  { n: 'E-mail', url: `mailto:${site.email}`, Svg: IconeMail, couleur: '#EA4335' },
].filter((r) => r.url) // un réseau sans lien n'est pas affiché
const champ = 'w-full rounded-2xl border border-violet/20 bg-white/80 px-5 py-3.5 outline-none transition focus:border-violet focus:ring-4 focus:ring-violet/15'
export default function Contact() {
  const [etat, setEtat] = useState(null) // null | envoi | ok | erreur | nonconfigure
  const envoyer = async (e) => {
    e.preventDefault()
    if (!site.formEndpoint) return setEtat('nonconfigure')
    setEtat('envoi')
    try {
      const r = await fetch(site.formEndpoint, { method: 'POST', body: new FormData(e.target), headers: { Accept: 'application/json' } })
      if (r.ok) { setEtat('ok'); e.target.reset() } else setEtat('erreur')
    } catch { setEtat('erreur') }
  }
  const msg = { envoi: 'Envoi en cours…', ok: 'Message envoyé, merci !', erreur: "L'envoi a échoué. Écris-moi directement par e-mail.",
    nonconfigure: `Le formulaire n'est pas encore relié à un service d'envoi. Écris-moi à ${site.email}.` }[etat]
  return (
    <section id="contact" className="bg-white/40 px-6 pb-10 pt-24 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
        <div>
          <Reveal><p className="mb-3 text-xs uppercase tracking-[.3em] text-violet/70">Contact</p>
            <h2 className="font-titre text-5xl leading-tight text-violet md:text-7xl">Travaillons <em className="text-rose not-italic">ensemble.</em></h2>
            <p className="mt-6 max-w-md text-texte/80">Un projet, un stage, une idée ? Écris-moi, je réponds avec plaisir.</p></Reveal>
          <Reveal delay={.15} className="mt-8 space-y-2 text-texte">
            <p>✉ <a className="hover:text-violet" href={`mailto:${site.email}`}>{site.email}</a></p>
            <p>☎ <a className="hover:text-violet" href={`tel:${site.telephone}`}>{site.telephone}</a></p>
            {site.liens.linkedin && <p>in <a className="hover:text-violet" href={site.liens.linkedin} target="_blank" rel="noreferrer">LinkedIn : {site.linkedinNom}</a></p>}
          </Reveal>
          <Reveal delay={.25} className="mt-8 flex gap-5">
            {reseaux.map((r) => (
              <a key={r.n} href={r.url} target={r.url.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer" aria-label={r.n} className="social group">
                {r.Svg
                  ? <r.Svg cut="var(--color-lavande)" className="h-[34px] w-[34px] text-texte/55 transition duration-300 group-hover:scale-110 group-hover:[color:var(--c)]" style={{ '--c': r.couleur }} />
                  : <img src={r.i} alt={r.n} width="34" height="34" />}
              </a>
            ))}
          </Reveal>
        </div>
        <Reveal delay={.2}>
          <form onSubmit={envoyer} className="space-y-4">
            <input name="nom" required placeholder="Ton nom" className={champ} />
            <input name="email" type="email" required placeholder="Ton adresse e-mail" className={champ} />
            <input name="objet" required placeholder="Objet" className={champ} />
            <textarea name="message" required rows="5" placeholder="Ton message" className={champ} />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} disabled={etat === 'envoi'}
              className="group flex items-center gap-3 rounded-full bg-violet px-9 py-3.5 text-white shadow-lg shadow-violet/30">
              Envoyer <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </motion.button>
            {msg && <p role="status" className="text-sm text-violet">{msg}</p>}
          </form>
        </Reveal>
      </div>
      <div className="mt-16 flex flex-col items-center justify-between gap-3 text-xs tracking-widest text-texte/60 md:flex-row">
        <button onClick={rejouerIntro} className="hover:text-violet">REJOUER L'INTRO ✦</button>
        <p>© {new Date().getFullYear()} {site.nom} · {site.slogan}</p>
        <button onClick={() => goTo('#accueil')} className="hover:text-violet">RETOUR EN HAUT ↑</button>
      </div>
    </section>
  )
}