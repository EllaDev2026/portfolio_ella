// Icônes LinkedIn et Mail dessinées dans le code (aucun téléchargement nécessaire).
// cut = couleur des lettres « in » découpées dans le carré.
export const IconeLinkedin = ({ cut = '#fff', ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="3.5" />
    <circle cx="7.2" cy="7.6" r="1.6" style={{ fill: cut }} />
    <rect x="5.9" y="10.2" width="2.6" height="7.6" style={{ fill: cut }} />
    <path d="M10.6 10.2h2.5v1.1c.5-.8 1.4-1.3 2.6-1.3 2.1 0 3 1.3 3 3.5v4.3h-2.6v-3.9c0-1.1-.4-1.7-1.3-1.7-1 0-1.6.7-1.6 1.8v3.8h-2.6z" style={{ fill: cut }} />
  </svg>
)
export const IconeMail = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7.2 8.5 6.3 8.5-6.3" />
  </svg>
)