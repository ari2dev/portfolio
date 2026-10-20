// Estructura de navegación compartida por Navbar y ProgressRail.
export const links = [
  ['About', 'about'],
  ['Projects', 'projects'],
  ['Journey', 'journey'],
  ['Contact', 'contact'],
]

// El hero no tiene enlace en la barra, pero sí sección en la página:
// navbar y raíl observan exactamente esta misma lista.
export const sectionIds = ['hero', ...links.map(([, id]) => id)]
