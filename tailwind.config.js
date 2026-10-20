/** @type {import('tailwindcss').Config} */
// Los colores son variables CSS: al cambiar el tema, toda la web cambia sin tocar los componentes.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      colors: { paper: v('paper'), ink: v('ink'), mute: v('mute'), accent: v('accent'), accent2: v('accent2') },
    },
  },
  plugins: [],
}