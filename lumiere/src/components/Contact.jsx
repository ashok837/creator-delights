import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Phone, CheckCircle2 } from 'lucide-react'
import { SERVICES, CONTACT, rv } from '../assets/data'

const empty = { name: '', email: '', phone: '', service: SERVICES[0].name, date: '', location: '', message: '' }

export default function Contact() {
  const [f, setF] = useState(empty)
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = k => e => setF(v => ({ ...v, [k]: e.target.value }))

  useEffect(() => {
    const h = e => setF(v => ({ ...v, ...e.detail })); window.addEventListener('pick', h)
    return () => window.removeEventListener('pick', h)
  }, [])

  const text = `Hello Alexander, I'd like to book a photoshoot.\nName: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone}\nService: ${f.service}\nDate: ${f.date}\nLocation: ${f.location}\n${f.message}`
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      const r = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      if (!r.ok) throw new Error()
      setSent(true)
    } catch { setErr('Could not send your request. Please use WhatsApp or email instead.') }
    finally { setBusy(false) }
  }
  const wa = `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(f.name ? text : "Hello Alexander, I'd like to know more about your photography services.")}`

  return (
    <section id="contact" className="section">
      <div className="container contact-grid">
        <motion.div {...rv}>
          <p className="eyebrow">Booking</p>
          <h2 className="title">Let's plan your photoshoot</h2>
          <p>Tell me about your day, and I will reply within 24 hours with availability and a tailored quote.</p>
          <div className="direct">
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn-gold"><MessageCircle size={18} /> Chat on WhatsApp</a>
            <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost"><Mail size={18} /> Email me</a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="line"><Phone size={16} /> {CONTACT.phone}</a>
          </div>
        </motion.div>
        <motion.form className="form glass" onSubmit={submit} {...rv}>
          {sent ? (
            <div className="done"><CheckCircle2 size={44} /><h3>Request received</h3><p>Thank you! I will reply within 24 hours. For a faster answer, message me on WhatsApp.</p>
              <button type="button" className="btn btn-ghost" onClick={() => { setSent(false); setF(empty) }}>Start a new request</button></div>
          ) : (<>
            <label>Full name<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <div className="row">
              <label>Email address<input required type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
              <label>Phone number<input required type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
            </div>
            <div className="row">
              <label>Photography service<select value={f.service} onChange={set('service')}>{SERVICES.map(s => <option key={s.name}>{s.name}</option>)}</select></label>
              <label>Event date<input required type="date" value={f.date} onChange={set('date')} /></label>
            </div>
            <label>Location<input required value={f.location} onChange={set('location')} /></label>
            <label>Message<textarea rows="4" value={f.message} onChange={set('message')} /></label>
            {err && <p role="alert" className="err">{err}</p>}<button className="btn btn-gold" type="submit" disabled={busy}>{busy ? 'Sending...' : 'Request booking'}</button>
          </>)}
        </motion.form>
      </div>
    </section>
  )
}
