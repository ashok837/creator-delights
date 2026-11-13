import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Aperture, Menu, X } from 'lucide-react'

export const LINKS = [['Home', 'home'], ['About', 'about'], ['Portfolio', 'portfolio'], ['Services', 'services'], ['Pricing', 'pricing'], ['Reviews', 'testimonials'], ['Contact', 'contact']]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    LINKS.forEach(([, id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav-solid glass' : ''}`}>
      <nav className="container nav-in" aria-label="Main navigation">
        <a href="#home" className="logo" aria-label="Melvin, home"><Aperture size={26} strokeWidth={1.4} /> <span>Creator Delights<em>&nbsp;Studio</em></span></a>
        <ul className="nav-links">
          {LINKS.map(([l, id]) => <li key={id}><a href={`#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined}>{l}</a></li>)}
        </ul>
        <a href="#contact" className="btn btn-gold nav-cta">Book now</a>
        <button className="burger" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul className="mobile glass" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {LINKS.map(([l, id]) => <li key={id}><a href={`#${id}`} onClick={() => setOpen(false)}>{l}</a></li>)}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
