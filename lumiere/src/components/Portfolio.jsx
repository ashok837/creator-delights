import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import Tilt from './Tilt'
import { CATEGORIES, rv } from '../assets/data'
import { useContent } from '../assets/ContentContext'

export default function Portfolio() {
  const { photos: PHOTOS } = useContent()
  const [cat, setCat] = useState('All')
  const [sel, setSel] = useState(null)
  const list = cat === 'All' ? PHOTOS : PHOTOS.filter(p => p.cat === cat)
  const step = useCallback(d => setSel(s => (s + d + list.length) % list.length), [list.length])

  useEffect(() => {
    if (sel === null) return
    const key = e => { if (e.key === 'Escape') setSel(null); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1) }
    document.body.style.overflow = 'hidden'; window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', key) }
  }, [sel, step])

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <motion.div className="head" {...rv}>
          <p className="eyebrow">Portfolio</p>
          <h2 className="title">Selected work</h2>
        </motion.div>
        <div className="filters" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map(c => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <LayoutGroup>
          <motion.div layout className="masonry">
            <AnimatePresence>
              {list.map((p, i) => (
                <motion.div layout key={p.id} className="m-item" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
                  <Tilt max={7}>
                    <button className="photo" style={{ aspectRatio: p.ar }} onClick={() => setSel(i)} aria-label={`View ${p.title}, ${p.cat} photography`}>
                      <img src={p.src} alt={`${p.title} - ${p.cat} photography`} loading="lazy" />
                      <span className="ph-over"><Expand size={20} /><strong>{p.title}</strong><small>{p.cat}</small></span>
                    </button>
                  </Tilt>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>

      <AnimatePresence>
        {sel !== null && list[sel] && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Image preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <button className="lb-btn lb-x" onClick={() => setSel(null)} aria-label="Close preview"><X /></button>
            <button className="lb-btn lb-l" onClick={e => { e.stopPropagation(); step(-1) }} aria-label="Previous image"><ChevronLeft /></button>
            <button className="lb-btn lb-r" onClick={e => { e.stopPropagation(); step(1) }} aria-label="Next image"><ChevronRight /></button>
            <AnimatePresence mode="wait">
              <motion.figure key={list[sel].id} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }} onClick={e => e.stopPropagation()}>
                <img src={list[sel].full} alt={list[sel].title} />
                <figcaption>{list[sel].title} <span>{list[sel].cat} &middot; {sel + 1}/{list.length}</span></figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
