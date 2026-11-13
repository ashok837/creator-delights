import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ArrowUpRight } from 'lucide-react'
import Tilt from './Tilt'
import { SERVICES, rv } from '../assets/data'

export default function Services() {
  const [sel, setSel] = useState(null)
  useEffect(() => {
    if (!sel) return
    const key = e => e.key === 'Escape' && setSel(null)
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key)
  }, [sel])
  const book = s => { window.dispatchEvent(new CustomEvent('pick', { detail: { service: s.name } })); setSel(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <section id="services" className="section alt">
      <div className="container">
        <motion.div className="head" {...rv}><p className="eyebrow">Services</p><h2 className="title">Every story, framed with care</h2></motion.div>
        <div className="grid3">
          {SERVICES.map((s, i) => (
            <motion.div key={s.name} {...rv} transition={{ ...rv.transition, delay: (i % 3) * 0.1 }}>
              <Tilt className="card glass" max={8}>
                <div className="card-img"><img src={s.src} alt={s.name} loading="lazy" /></div>
                <div className="card-body">
                  <h3>{s.name}</h3><p>{s.desc}</p>
                  <button className="btn btn-ghost sm" onClick={() => setSel(s)}>View Details <ArrowUpRight size={16} /></button>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {sel && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={sel.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div className="modal glass" initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <button className="lb-btn lb-x" onClick={() => setSel(null)} aria-label="Close"><X /></button>
              <img src={sel.src} alt={sel.name} />
              <div><h3>{sel.name}</h3><p>{sel.desc}</p>
                <ul className="ticks">{sel.more.map(m => <li key={m}><Check size={16} />{m}</li>)}</ul>
                <button className="btn btn-gold" onClick={() => book(sel)}>Book this service</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
