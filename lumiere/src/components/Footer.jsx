import { Aperture, Instagram, Facebook, Youtube, Mail, Phone } from 'lucide-react'
import { CONTACT } from '../assets/data'

export default function Footer() {
  const social = [[Instagram, 'Instagram', 'https://instagram.com'], [Facebook, 'Facebook', 'https://facebook.com'], [Youtube, 'YouTube', 'https://youtube.com']]
  return (
    <footer className="footer">
      <div className="container foot">
        <div><a href="#home" className="logo"><Aperture size={26} strokeWidth={1.4} /> <span>Rowe<em>&nbsp;Studio</em></span></a>
          <p>Capturing moments, creating memories.</p></div>
        <div className="foot-links">
          <a href={`mailto:${CONTACT.email}`}><Mail size={16} /> {CONTACT.email}</a>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}><Phone size={16} /> {CONTACT.phone}</a>
        </div>
        <div className="social">{social.map(([I, n, h]) => <a key={n} href={h} target="_blank" rel="noreferrer" aria-label={n}><I size={20} /></a>)}</div>
      </div>
      <p className="copy">&copy; {new Date().getFullYear()} Melvin Photography. All rights reserved.</p>
    </footer>
  )
}
