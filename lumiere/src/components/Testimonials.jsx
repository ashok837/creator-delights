import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { rv } from '../assets/data'
import { useContent } from '../assets/ContentContext'

export default function Testimonials() {
  const { reviews: REVIEWS } = useContent()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (paused) return; const t = setInterval(() => setI(v => (v + 1) % REVIEWS.length), 5500); return () => clearInterval(t) }, [paused])
  const r = REVIEWS[i % REVIEWS.length]
  if (!r) return null
  return (
    <section id="testimonials" className="section alt">
      <div className="container">
        <motion.div className="head" {...rv}><p className="eyebrow">Kind words</p><h2 className="title">What clients say</h2></motion.div>
        <div className="slider glass" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-live="polite">
          <Quote className="q" size={48} strokeWidth={1} />
          <AnimatePresence mode="wait">
            <motion.div key={i} className="review" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }}>
              <div className="stars" aria-label={`${r.stars} out of 5 stars`}>{[1, 2, 3, 4, 5].map(n => <Star key={n} size={18} fill={n <= r.stars ? 'currentColor' : 'none'} />)}</div>
              <p>{r.text}</p>
              <div className="who">{r.src ? <img src={r.src} alt={`Photo of ${r.name}`} loading="lazy" /> : <span className="av">{r.name[0]}</span>}<div><b>{r.name}</b><span>{r.role}</span></div></div>
            </motion.div>
          </AnimatePresence>
          <div className="dots">{REVIEWS.map((x, k) => <button key={x.name} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Show review ${k + 1}`} />)}</div>
        </div>
      </div>
    </section>
  )
}
