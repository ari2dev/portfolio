import Cursor from './components/Cursor'
import Backdrop from './components/Backdrop'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'

export default function App() {
  return (
    <>
      <Cursor />
      <Backdrop />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
      </main>
    </>
  )
}