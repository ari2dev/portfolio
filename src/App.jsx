import Cursor from './components/Cursor'
import Backdrop from './components/Backdrop'
import ProgressRail from './components/ProgressRail'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Marquee from './components/Marquee'
import Journey from './components/Journey'
import Contact from './components/Contact'
import { ticker } from './data/content'

export default function App() {
  return (
    <>
      <Cursor />
      <Backdrop />
      <ProgressRail />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Marquee items={ticker} />
        <Journey />
        <Contact />
      </main>
    </>
  )
}