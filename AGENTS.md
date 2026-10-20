# Proyecto: portfolio de Ariadna Galván Navarro

Portfolio personal de una desarrolladora junior (estudia DAM). Debe verse como obra de una diseñadora web experta: sobrio, preciso, con un solo gesto memorable por pantalla.

## Stack (no cambiar sin preguntar)
- React 19 + Vite, JavaScript (JSX), sin TypeScript.
- Tailwind CSS 3.4 (NO la v4). Config en tailwind.config.js.
- Framer Motion para animación, lucide-react para iconos.
- three + @react-three/fiber (v9) para 3D. No añadir librerías pesadas sin preguntar.

## Contenido
- Todo el texto va en inglés.
- Todo el contenido personal vive en src/data/content.js. Los componentes no llevan texto personal escrito a mano.
- Solo se habla de informática: Java, SQL, HTML5/CSS3, sistemas informáticos. NO mencionar Biología ni inventar tecnologías o proyectos que no estén en el CV.

## Diseño
- Tema claro y oscuro con data-theme="dark|light" en <html>. Los colores son variables CSS en src/index.css y se usan con las clases bg-paper, text-ink, text-mute, bg-accent, bg-accent2.
- Paleta: acento coral (255 77 109) y ámbar (255 176 77). NADA de azul.
- Tipografía: Archivo (variable) y Instrument Serif cursiva como acento.
- El movimiento debe responder a la acción de la persona (cursor, scroll), no animar todo por animar.

## Rendimiento y accesibilidad
- 60 fps. Versión simplificada en móvil/táctil (hook useIsTouch).
- Respetar prefers-reduced-motion.
- Cargar Three.js con lazy.

## Estructura
src/components: Navbar, Hero, FlexWord, Magnetic, Badge, About, Section, Cursor, Backdrop, Weave, ProgressRail
src/hooks: useIsTouch, useTheme, useTypewriter, useDecode, useActiveSection
src/data: content.js (contenido personal), sections.js (navegación)

## Reglas de trabajo
- Antes de cambiar nada, lee los archivos afectados.
- Cambios pequeños y revisables.
- Al terminar, ejecuta npm run build y corrige los errores.
- Di qué NO has podido comprobar.