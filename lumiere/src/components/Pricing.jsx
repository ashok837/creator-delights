import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Tilt from './Tilt'
import { rv } from '../assets/data'
import { useContent } from '../assets/ContentContext'

export default function Pricing() {
  const { plans: PLANS } = useContent()
  const pick = p => { window.dispatchEvent(new CustomEvent('pick', { detail: { message: `I'm interested in the ${p.name} package.` } })); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }
  return (
    <section id="pricing" className="section">
      <div className="container">
        <motion.div className="head" {...rv}><p className="eyebrow">Pricing</p><h2 className="title">Packages for every occasion</h2></motion.div>
        <div className="grid3 plans">
          {PLANS.map((p, i) => (
            <motion.div key={p.name} {...rv} transition={{ ...rv.transition, delay: i * 0.12 }}>
              <Tilt className={`plan glass ${p.featured ? 'feat' : ''}`} max={6}>
                {p.featured && <span className="badge">Most booked</span>}
                <h3>{p.name} Package</h3>
                <div className="price"><sup>₹</sup>{p.price.toLocaleString('en-IN')}</div>
                <ul className="ticks">
                  <li><Check size={16} /><b>{p.photos}</b>&nbsp;edited photos</li>
                  <li><Check size={16} /><b>{p.hours}</b>&nbsp;hours of photography</li>
                  {p.extras.map(e => <li key={e}><Check size={16} />{e}</li>)}
                </ul>
                <button className={`btn ${p.featured ? 'btn-gold' : 'btn-ghost'}`} onClick={() => pick(p)}>Choose {p.name}</button>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
