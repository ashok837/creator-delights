import { Suspense, lazy, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from 'framer-motion'
import { useContent } from '../assets/ContentContext'
const Camera3D = lazy(() => import('./Camera3D'))

const WORDS = 'Capturing Moments, Creating Memories.'.split(' ')

function FloatImg({ k, sx, sy, photo }) {
  const x = useTransform(sx, v => v * (k % 2 ? -50 : 60) * (k + 1))
  const y = useTransform(sy, v => v * 40 * (k + 1))
  return (
    <motion.img className={`float f${k}`} src={photo.src} alt="" loading="lazy" style={{ x, y }}
      animate={{ translateY: [0, -14, 0] }} transition={{ duration: 5 + k, repeat: Infinity, ease: 'easeInOut' }} />
  )
}

export default function Hero() {
  const { photos } = useContent()
  const SLIDES = photos.slice(0, 5)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }), sy = useSpring(my, { stiffness: 60, damping: 18 })
  const { scrollY } = useScroll()
  const glowY = useTransform(scrollY, [0, 800], [0, 200])
  const g1x = useTransform(sx, v => v * -80)
  const g2x = useTransform(sx, v => v * 100), g2y = useTransform(sy, v => v * 60)
  const [i, setI] = useState(0)
  const cur = SLIDES[i % SLIDES.length]

  useEffect(() => { const t = setInterval(() => setI(v => (v + 1) % SLIDES.length), 4000); return () => clearInterval(t) }, [])
  const onMove = e => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5) }

  return (
    <section id="home" className="hero" onMouseMove={onMove}>
      <motion.div className="glow g1" style={{ x: g1x, y: glowY }} />
      <motion.div className="glow g2" style={{ x: g2x, y: g2y }} />
      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.p className="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>Melvin, award-winning photographer</motion.p>
          <h1 className="display" aria-label="Capturing Moments, Creating Memories.">
            {WORDS.map((w, k) => (
              <span key={k} className="mask" aria-hidden="true">
                <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 2.5 + k * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>{w}&nbsp;</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.1 }}>
            Fifteen years of weddings, portraits and travel stories, photographed with a quiet eye for light and honest emotion.
          </motion.p>
          <motion.div className="cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.3 }}>
            <a href="#portfolio" className="btn btn-gold">Explore Portfolio</a>
            <a href="#contact" className="btn btn-ghost">Book a Photoshoot</a>
          </motion.div>
        </div>

        <div className="stage">
          <Suspense fallback={null}><Camera3D /></Suspense>
          {[0, 1, 2].map(k => <FloatImg key={k} k={k} sx={sx} sy={sy} photo={photos[(k * 3 + 1) % photos.length]} />)}
        </div>
      </div>

      <div className="container">
        <div className="carousel glass" aria-roledescription="carousel" aria-label="Featured photographs">
          <div className="car-view">
            <AnimatePresence mode="wait">
              <motion.img key={i} src={cur.full} alt={`${cur.title} - ${cur.cat} photography`}
                initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
            </AnimatePresence>
            <div className="car-cap"><strong>{cur.title}</strong><span>{cur.cat}</span></div>
          </div>
          <div className="car-thumbs">
            {SLIDES.map((s, k) => (
              <button key={s.id} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Show ${s.title}`}><img src={s.src} alt="" loading="lazy" /></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
