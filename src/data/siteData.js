// ✏️ TOUT ce que tu peux modifier est ici : textes, projets, liens.
export const site = {
  nom: 'ELLA MICHELLE',
  slogan: 'Magique par le code.',
  titre: 'DÉVELOPPEUSE FULL-STACK',
  cv: '/cv-ella.pdf',          // remplace public/cv-ella.pdf pour changer ton CV
  musique: '/musique.mp3',     // remplace public/musique.mp3 pour changer la musique
  nomMusique: "Musique d'Ella", // texte affiché sous « Son on » en bas à gauche
  photoAccueil: '/ella.jpg',        // photo de la page Accueil (yeux ouverts)
  photoAccueilYeux: '/ella-yeux.jpg', // les images de l'animation des yeux (fermés → ouverts)
  photoAPropos: '/ella3.jpg',       // photo de la page À propos (cadre photo)
  logo: '/logo-em.png',             // ton monogramme EM (mets ton image dans public avec ce nom)
  // Service d'envoi du formulaire : crée un formulaire gratuit sur formspree.io
  // et colle ici l'adresse reçue (ex : 'https://formspree.io/f/xxxxxxx')
  formEndpoint: '',
  linkedinNom: 'Ella Tiehi',      // nom affiché pour ton LinkedIn
  email: 'ellatiehi06@gmail.com',
  telephone: '0786603157',
  liens: {
    github: 'https://github.com/EllaDev2026', // vérifie que c'est bien ton pseudo
    // ⚠️ Lien provisoire : il ouvre une recherche « Ella Tiehi » sur LinkedIn.
    // Pour aller DIRECTEMENT sur ton profil : ouvre ton profil LinkedIn, copie l'adresse dans la barre du navigateur et colle-la ici.
    linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Ella%20Tiehi',
    whatsapp: 'https://wa.me/2250786603157',
  },
}
export const nav = [
  { label: 'Accueil', id: '#accueil' }, { label: 'À propos', id: '#apropos' },
  { label: 'Compétences', id: '#competences' }, { label: 'Projets', id: '#projets' },
  { label: 'Parcours', id: '#parcours' }, { label: 'Contact', id: '#contact' },
]
export const apropos = [
  "Étudiante en Licence 3 DASI (Développement d’Applications et Systèmes d’Information) à l’ESATIC.",
  "Je me spécialise dans le développement full-stack, de l’interface utilisateur jusqu’au serveur et à la gestion des données.",
  "Je suis passionnée par le développement web et mobile, et j’aime transformer une idée en application utile.",
  "Je cherche un stage de fin de cycle où je pourrai apprendre auprès d’une équipe, tout en apportant mon sérieux et ma motivation.",
]
const d = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/'
const dv = (n) => `${d}${n}/${n}-original.svg`
export const competences = [
  { cat: 'Front-end', items: [
    { n: 'React', i: dv('react') }, { n: 'Tailwind CSS', i: dv('tailwindcss') }, { n: 'JavaScript', i: dv('javascript') },
    { n: 'HTML', i: dv('html5') }, { n: 'CSS', i: dv('css3') } ] },
  { cat: 'Conception et design', items: [{ n: 'Figma', i: dv('figma') }] },
  { cat: 'Back-end et bases de données', items: [
    { n: 'PHP', i: dv('php') }, { n: 'Python', i: dv('python') }, { n: 'Java', i: dv('java') }, { n: 'Node.js', i: dv('nodejs') },
    { n: 'MongoDB', i: dv('mongodb') }, { n: 'MySQL', i: dv('mysql') }, { n: 'Kotlin', i: dv('kotlin') } ] },
  { cat: 'Outils et environnement de travail', items: [
    { n: 'GitHub', i: dv('github') }, { n: 'Visual Studio Code', i: dv('vscode') }, { n: 'Vercel', i: dv('vercel') },
    { n: 'Android Studio', i: dv('androidstudio') } ] },
  { cat: 'Bureautique', items: [
    { n: 'Microsoft Excel', office: ['X', '#1D6F42'] }, { n: 'Microsoft Word', office: ['W', '#2B579A'] },
    { n: 'Microsoft PowerPoint', office: ['P', '#D24726'] } ] },
]
// ➕ Pour ajouter un projet : copie un bloc { ... } et change les textes.
// image: '/projets/nom-du-fichier.png' → l'image doit être dans public/projets/ avec EXACTEMENT ce nom. Si elle est absente, la carte affiche les initiales.
export const projets = [
  { nom: 'AlertProbSci', type: 'Application de signalement',
    description: "Application de signalement des problèmes rencontrés dans les quartiers en Côte d'Ivoire : salubrité, lampadaires défectueux, infrastructures et autres problèmes communautaires.",
    techs: [], image: '/projets/alertprobsci.png', lien: '' },
  { nom: 'Ticket Vert', type: 'Solution de gestion de tickets numériques',
    description: "Un projet visant à faciliter la gestion et l'utilisation des tickets numériques, avec pour objectif de réduire le recours aux tickets papier.",
    contribution: "J'ai participé à la gestion de la partie front-end et à la présentation du projet auprès de la population, afin de faire connaître la solution et de faciliter son adoption.",
    techs: [], lien: 'https://ticketsvert.com/',
    // 🎞️ Vitrine animée : couleur d'accent, logo, mot géant en fond et captures d'écran (dans public/projets/ticket-vert/)
    couleur: '#0b5d3b', logo: '/projets/ticket-vert/logo.jpg', mot: 'Vert',
    ecrans: [
      { src: '/projets/ticket-vert/accueil.jpg', titre: 'Accueil', legende: 'vos tickets et vos papiers évités en un coup d’œil' },
      { src: '/projets/ticket-vert/tickets.jpg', titre: 'Tickets', legende: 'tout l’historique, retrouvé en un instant' },
      { src: '/projets/ticket-vert/impact.jpg', titre: 'Impact', legende: 'mesurer l’effet écologique de chaque ticket' },
      { src: '/projets/ticket-vert/parametres.jpg', titre: 'Paramètres', legende: 'vos données restent stockées sur votre téléphone' },
    ] },
  { nom: 'Gestion de la prise en charge scolaire', type: 'Site web · District autonome, Yamoussoukro · 2025 – 2026',
    description: "Développement d'un site de gestion de la prise en charge scolaire.",
    techs: [], image: '/projets/prise-en-charge.png', lien: '' },
]
export const formation = [
  { titre: 'Licence 3 – Développement d’applications et systèmes d’information', periode: '2026 – En cours', lieu: 'ESATIC, Abidjan',
    desc: 'Formation en cours. Je recherche un stage de fin de cycle pour valider ma Licence.' },
  { titre: 'Brevet de Technicien Supérieur – Informatique, option développeur d’applications', periode: '2023 – 2025', lieu: 'PIGIER, Yamoussoukro', desc: '' },
  { titre: 'Certification Microsoft – Word et Excel', periode: '2023', lieu: '', desc: '' },
  { titre: 'Baccalauréat série D', periode: '2022 – 2023', lieu: 'Lycée Moderne 2 de Divo', desc: '' },
]
export const experience = [
  { titre: 'Stage de validation du BTS', periode: '2025', lieu: '', desc: 'Stage effectué dans le cadre de la validation du BTS.' },
  { titre: 'Stage de perfectionnement', periode: '2026', lieu: 'INPHB, Yamoussoukro',
    desc: "Participation à la conception de l'interface d'une application, sensibilisation du public et accompagnement des utilisateurs pour l'installation et l'utilisation de l'application." },
]