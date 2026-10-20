// ✏️ Edit here and the whole site updates.
export const profile = {
  name: 'Ariadna Galván Navarro',
  initials: 'AG',
  roles: ['Software Developer', 'Java & SQL Specialist', 'Full-Stack & React Enthusiast'],
  bio: 'DAM student and software developer focused on robust backend logic, relational data structures, and clean architecture.',
  about: 'Developer, analyst, and a teacher at heart — the person behind the code. I enjoy turning complex problems into clear, logical steps. At IES Lomo de la Herradura I write Java for management systems and design relational databases with SQL. Beyond the degree, I build full-stack web applications with Laravel, PHP, and React. Backed by three years of experience as a private tutor, I excel at communicating technical concepts clearly and delivering projects on strict schedules.',
  email: 'ariadnagalnav2@gmail.com',
  phone: '667 022 698',
  github: 'https://github.com/ari2dev',    // e.g. 'https://github.com/username' — pega aquí tu URL real
  linkedin: 'https://www.linkedin.com/in/ariadna-galvan-navarro-807848335/',  // e.g. 'https://linkedin.com/in/username' — pega aquí tu URL real
  cv: '/cv-ariadna.pdf',
  headline: ['Software', 'Developer'],
  focus: 'Multiplatform development',
  stack: 'Java, PHP, SQL, React',
  intro: 'DAM student and software developer focused on robust backend logic, relational data structures, and clean architecture.',
  availability: 'Open to professional opportunities & junior roles. I am eager to contribute, learn fast, and deliver value from day one.',
  availabilityShort: 'Open to junior roles',
}

export const skills = [
  { name: 'Java', level: 'Advanced / Core', icon: 'Coffee' },
  { name: 'SQL & Relational DBs', level: 'Advanced', icon: 'Database' },
  { name: 'PHP & Laravel', level: 'Intermediate', icon: 'Layers' },
  { name: 'React & Frontend', level: 'Intermediate', icon: 'Atom' },
  { name: 'Node.js & npm', level: 'Intermediate', icon: 'Server' },
  { name: 'HTML5 & CSS3 / Tailwind', level: 'Advanced', icon: 'Code2' },
  { name: 'Computer Systems & OS', level: 'Solid', icon: 'Monitor' },
  { name: 'Clear Communication', level: 'Soft Skill', icon: 'Users' },
]

export const stats = [
  { value: 2, suffix: '', label: 'Years studying DAM' },
  { value: 4, suffix: '', label: 'Years of scientific training' },
  { value: 2025, suffix: '', label: 'First industry internship' },
  { value: 10, suffix: '+', label: 'Tools in the toolkit' },
]

export const principles = [
  { title: 'Think in steps', text: 'I break every problem into clear, logical steps before writing a line of code.' },
  { title: 'Explain simply', text: 'Three years of tutoring taught me to turn complex ideas into plain, clear language.' },
  { title: 'Deliver on time', text: 'Strict schedules as a tutor and a real company internship taught me to meet deadlines.' },
]

// Demo de código del About: pares de [texto, tipoDeToken]
export const javaDemo = [
  [['public class ', 'kw'], ['Ariadna ', 'ty'], ['{', 'pl']],
  [['  String ', 'ty'], ['role = ', 'pl'], ['"Software developer in training"', 'st'], [';', 'pl']],
  [['  String ', 'ty'], ['degree = ', 'pl'], ['"Higher Diploma in DAM"', 'st'], [';', 'pl']],
  [['  String[] ', 'ty'], ['stack = {', 'pl'], ['"Java"', 'st'], [', ', 'pl'], ['"PHP"', 'st'], [', ', 'pl'], ['"SQL"', 'st'], [', ', 'pl'], ['"Laravel"', 'st'], [', ', 'pl'], ['"React"', 'st'], ['};', 'pl']],
  [['  boolean ', 'ty'], ['learnsFast = ', 'pl'], ['true', 'kw'], [';', 'pl']],
  [['  boolean ', 'ty'], ['readyToWork = ', 'pl'], ['true', 'kw'], [';', 'pl']],
  [['}', 'pl']],
]

export const projects = [
  {
    icon: 'Coffee',
    title: 'Enterprise Management System (Java)',
    tech: ['Java', 'SQL', 'OOP'],
    desc: 'Core business logic implementation using Object-Oriented Programming principles and optimized SQL relational structures for data integrity.',
    status: 'High modularity and clean architectural patterns.',
  },
  {
    icon: 'Layers',
    title: 'Full-Stack Web App with Laravel',
    tech: ['Laravel', 'PHP', 'SQL', 'Tailwind'],
    desc: 'Robust web application featuring secure backend routing, Eloquent ORM database management, and a clean, responsive interface.',
    status: 'Scalable MVC architecture.',
  },
  {
    icon: 'Atom',
    title: 'Interactive React Dashboard',
    tech: ['React', 'JavaScript', 'REST APIs'],
    desc: 'Dynamic front-end dashboard built with modular React components, state management, and modern UI/UX practices.',
    status: 'Optimized render cycles and smooth UX.',
  },
]

export const journey = [
  { icon: 'Briefcase', title: 'IT intern', place: 'PC Seguridad', period: 'May – Jun 2025', desc: 'Gained hands-on experience in a professional tech environment, contributing to system maintenance and operational workflows.' },
  { icon: 'Code2', title: 'Higher Diploma in DAM (Multiplatform App Dev)', place: 'IES Lomo de la Herradura', period: '2025 — Present', desc: 'Intensive focus on advanced Java programming, software lifecycle, algorithms, and database optimization.' },
  { icon: 'Users', title: 'Private STEM Tutor', place: 'Self-employed', period: '2022 — 2025', desc: 'Developed strong analytical communication, translating complex technical ideas into structured learning plans on strict deadlines.' },
  { icon: 'Microscope', title: 'Degree in Biology (Analytical Track)', place: 'University of Granada', period: '2021 — 2025', desc: 'Built a rigorous methodological mindset, statistical data handling, and complex problem-solving capabilities.' },
]

export const competencies = [
  'Fast learner of new tools and environments',
  'Clear communication and commitment to quality',
  'Comfortable managing operating systems',
  'Driving licence B — own car',
  'Flexible schedule and geographic availability',
]

export const ticker = ['Java', 'PHP', 'Laravel', 'React', 'Node', 'SQL', 'HTML5', 'CSS3', 'Clean code', 'Problem solving']
