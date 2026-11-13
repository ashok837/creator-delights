import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue } from 'framer-motion'
import { Aperture } from 'lucide-react'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function Loader() {
  return (
    <motion.div className="loader" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} role="status" aria-label="Loading">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.2, ease: 'linear', repeat: Infinity }}><Aperture size={72} strokeWidth={1} /></motion.div>
      <p>Creator delight</p>
      <div className="bar"><motion.i initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, ease: 'easeInOut' }} /></div>
    </motion.div>
  )
}

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 400, damping: 30 }), sy = useSpring(y, { stiffness: 400, damping: 30 })
  const [big, setBig] = useState(false)
  useEffect(() => {
    const m = e => { x.set(e.clientX); y.set(e.clientY); setBig(!!e.target.closest?.('a,button,input,select,textarea')) }
    window.addEventListener('mousemove', m); return () => window.removeEventListener('mousemove', m)
  }, [x, y])
  return <motion.div className="cursor" style={{ x: sx, y: sy }} animate={{ scale: big ? 2.4 : 1 }} aria-hidden="true" />
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  useEffect(() => { const t = setTimeout(() => setLoading(false), 2300); return () => clearTimeout(t) }, [])
  return (
    <>
      <AnimatePresence>{loading && <Loader key="l" />}</AnimatePresence>
      <motion.div className="progress" style={{ scaleX }} />
      <Cursor />
      <Navbar />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: loading ? 0 : 1 }} transition={{ duration: 0.8 }}><Home /></motion.div>
    </>
  )
}
