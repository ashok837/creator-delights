import { useEffect, useState, useCallback } from 'react'
import { LayoutDashboard, CalendarCheck, Images, MessageSquareQuote, Tag, LogOut, Trash2, Globe, Star, Mail, MessageCircle, Aperture } from 'lucide-react'
import './admin.css'

const TOKEN = 'rowe_admin_token'
const STATUS = ['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled']
const CATS = ['Wedding', 'Portrait', 'Nature', 'Fashion', 'Travel', 'Event']
const RATIOS = [['3/4', 'Portrait'], ['4/5', 'Tall portrait'], ['1/1', 'Square'], ['4/3', 'Landscape']]

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN) || '')
  useEffect(() => {
    document.title = 'Admin | '
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m)
    return () => m.remove()
  }, [])
  const logout = useCallback(() => { localStorage.removeItem(TOKEN); setToken('') }, [])
  return token ? <Panel token={token} logout={logout} /> : <Login onLogin={t => { localStorage.setItem(TOKEN, t); setToken(t) }} />
}

function Login({ onLogin }) {
  const [f, setF] = useState({ username: '', password: '' })
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Cannot reach the server. Is it running?')
      onLogin(d.token)
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  return (
    <div className="a-login">
      <form className="a-box" onSubmit={submit}>
        <Aperture size={44} strokeWidth={1.2} />
        <h1>Studio admin</h1>
        <label>Username<input value={f.username} onChange={e => setF({ ...f, username: e.target.value })} autoComplete="username" required /></label>
        <label>Password<input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} autoComplete="current-password" required /></label>
        {err && <p className="a-err" role="alert">{err}</p>}
        <button className="a-btn" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
        <a href="/" className="a-link">Back to website</a>
      </form>
    </div>
  )
}

const TABS = [['dashboard', 'Dashboard', LayoutDashboard], ['bookings', 'Bookings', CalendarCheck], ['gallery', 'Gallery', Images], ['reviews', 'Reviews', MessageSquareQuote], ['plans', 'Packages', Tag]]

function Panel({ token, logout }) {
  const [tab, setTab] = useState('dashboard')
  const [d, setD] = useState({ bookings: [], photos: [], plans: [], reviews: [] })
  const [toast, setToast] = useState('')
  const flash = m => { setToast(m); setTimeout(() => setToast(''), 2800) }

  const api = useCallback(async (path, opt = {}) => {
    const plain = !opt.body || opt.body instanceof FormData
    const r = await fetch('/api' + path, { ...opt, headers: { ...(plain ? {} : { 'Content-Type': 'application/json' }), Authorization: 'Bearer ' + token } })
    if (r.status === 401) { logout(); throw new Error('Session expired') }
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Request failed')
    return r.json()
  }, [token, logout])

  const load = useCallback(async () => {
    const [c, bookings] = await Promise.all([fetch('/api/content').then(r => r.json()), api('/bookings')])
    setD({ ...c, bookings })
  }, [api])
  useEffect(() => { load().catch(e => flash(e.message)) }, [load])

  const act = async (fn, ok) => { try { await fn(); await load(); ok && flash(ok) } catch (e) { flash(e.message) } }
  const props = { d, api, act }
  const fresh = d.bookings.filter(b => b.status === 'New').length

  return (
    <div className="a-shell">
      <aside className="a-side">
        <div className="a-brand"><Aperture size={24} strokeWidth={1.4} /> Ro</div>
        <nav aria-label="Admin">
          {TABS.map(([k, l, I]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><I size={18} />{l}{k === 'bookings' && fresh > 0 && <i>{fresh}</i>}</button>)}
        </nav>
        <a href="/" target="_blank" rel="noreferrer" className="a-nav"><Globe size={18} /> View website</a>
        <button className="a-nav" onClick={logout}><LogOut size={18} /> Sign out</button>
      </aside>
      <main className="a-main">
        {tab === 'dashboard' && <Dashboard {...props} go={setTab} />}
        {tab === 'bookings' && <Bookings {...props} />}
        {tab === 'gallery' && <Gallery {...props} />}
        {tab === 'reviews' && <Reviews {...props} />}
        {tab === 'plans' && <Plans {...props} />}
      </main>
      {toast && <div className="a-toast" role="status">{toast}</div>}
    </div>
  )
}

const when = x => new Date(x).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

function Dashboard({ d, go }) {
  const stats = [['New bookings', d.bookings.filter(b => b.status === 'New').length], ['Total bookings', d.bookings.length], ['Gallery photos', d.photos.length], ['Reviews', d.reviews.length]]
  return (<>
    <h1>Dashboard</h1>
    <div className="a-stats">{stats.map(([l, n]) => <div className="a-card" key={l}><b>{n}</b><span>{l}</span></div>)}</div>
    <h2>Latest booking requests</h2>
    {d.bookings.slice(0, 5).map(b => <div className="a-row" key={b.id}><div><b>{b.name}</b><small>{b.service} &middot; {b.date || 'No date'}</small></div><span className={`pill ${b.status}`}>{b.status}</span></div>)}
    {!d.bookings.length && <p className="a-empty">No booking requests yet. They will appear here when someone uses the contact form.</p>}
    {d.bookings.length > 0 && <button className="a-btn ghost" onClick={() => go('bookings')}>View all bookings</button>}
  </>)
}

function Bookings({ d, api, act }) {
  const [filter, setFilter] = useState('All')
  const list = filter === 'All' ? d.bookings : d.bookings.filter(b => b.status === filter)
  return (<>
    <h1>Bookings</h1>
    <div className="a-tabs">{['All', ...STATUS].map(s => <button key={s} className={filter === s ? 'on' : ''} onClick={() => setFilter(s)}>{s}</button>)}</div>
    {!list.length && <p className="a-empty">No bookings in this view.</p>}
    {list.map(b => (
      <div className="a-card book" key={b.id}>
        <div className="top"><div><h3>{b.name}</h3><small>Received {when(b.createdAt)}</small></div>
          <select value={b.status} onChange={e => act(() => api('/bookings/' + b.id, { method: 'PATCH', body: JSON.stringify({ status: e.target.value }) }), 'Status updated')} aria-label={`Status for ${b.name}`}>{STATUS.map(s => <option key={s}>{s}</option>)}</select></div>
        <dl><dt>Service</dt><dd>{b.service}</dd><dt>Event date</dt><dd>{b.date}</dd><dt>Location</dt><dd>{b.location}</dd><dt>Email</dt><dd>{b.email}</dd><dt>Phone</dt><dd>{b.phone}</dd></dl>
        {b.message && <p className="msg">{b.message}</p>}
        <div className="acts">
          <a className="a-btn ghost sm" href={`mailto:${b.email}`}><Mail size={15} /> Email</a>
          <a className="a-btn ghost sm" target="_blank" rel="noreferrer" href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}><MessageCircle size={15} /> WhatsApp</a>
          <button className="a-btn danger sm" onClick={() => confirm('Delete this booking?') && act(() => api('/bookings/' + b.id, { method: 'DELETE' }), 'Booking deleted')}><Trash2 size={15} /> Delete</button>
        </div>
      </div>
    ))}
  </>)
}

function Gallery({ d, api, act }) {
  const [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); const form = e.target, fd = new FormData(form); setBusy(true)
    await act(async () => { await api('/photos', { method: 'POST', body: fd }); form.reset() }, 'Photos uploaded')
    setBusy(false)
  }
  const edit = (p, patch) => act(() => api('/photos/' + p.id, { method: 'PUT', body: JSON.stringify(patch) }), 'Photo updated')
  return (<>
    <h1>Gallery</h1>
    <form className="a-card a-form" onSubmit={submit}>
      <h3>Upload photos</h3>
      <label>Images (JPG, PNG or WebP, up to 12 MB each)<input type="file" name="image" accept="image/jpeg,image/png,image/webp" multiple required /></label>
      <div className="cols">
        <label>Title (optional)<input name="title" maxLength="80" /></label>
        <label>Category<select name="cat">{CATS.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Shape in gallery<select name="ar">{RATIOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      </div>
      <button className="a-btn" disabled={busy}>{busy ? 'Uploading...' : 'Upload'}</button>
    </form>
    <div className="a-photos">
      {d.photos.map(p => (
        <div className="a-card ph" key={p.id}>
          <img src={p.src} alt={p.title} loading="lazy" />
          <input defaultValue={p.title} aria-label="Title" onBlur={e => e.target.value !== p.title && edit(p, { title: e.target.value })} />
          <div className="cols">
            <select value={p.cat} onChange={e => edit(p, { cat: e.target.value })} aria-label="Category">{CATS.map(c => <option key={c}>{c}</option>)}</select>
            <select value={p.ar} onChange={e => edit(p, { ar: e.target.value })} aria-label="Shape">{RATIOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </div>
          <button className="a-btn danger sm" onClick={() => confirm('Delete this photo?') && act(() => api('/photos/' + p.id, { method: 'DELETE' }), 'Photo deleted')}><Trash2 size={15} /> Delete</button>
        </div>
      ))}
    </div>
  </>)
}

function Reviews({ d, api, act }) {
  const submit = e => { e.preventDefault(); const form = e.target; act(async () => { await api('/reviews', { method: 'POST', body: new FormData(form) }); form.reset() }, 'Review added') }
  return (<>
    <h1>Reviews</h1>
    <form className="a-card a-form" onSubmit={submit}>
      <h3>Add a review</h3>
      <div className="cols"><label>Client name<input name="name" required maxLength="80" /></label><label>Role or occasion<input name="role" maxLength="80" placeholder="Wedding client" /></label>
        <label>Stars<select name="stars" defaultValue="5">{[5, 4, 3, 2, 1].map(n => <option key={n}>{n}</option>)}</select></label></div>
      <label>Review<textarea name="text" rows="3" required maxLength="600" /></label>
      <label>Client photo (optional)<input type="file" name="image" accept="image/jpeg,image/png,image/webp" /></label>
      <button className="a-btn">Add review</button>
    </form>
    {d.reviews.map(r => (
      <div className="a-card rev" key={r.id}>
        {r.src ? <img src={r.src} alt="" /> : <span className="av">{r.name[0]}</span>}
        <div><b>{r.name}</b> <small>{r.role}</small><div className="st">{Array.from({ length: r.stars }, (_, i) => <Star key={i} size={14} fill="currentColor" />)}</div><p>{r.text}</p></div>
        <button className="a-btn danger sm" onClick={() => confirm('Delete this review?') && act(() => api('/reviews/' + r.id, { method: 'DELETE' }), 'Review deleted')} aria-label={`Delete review by ${r.name}`}><Trash2 size={15} /></button>
      </div>
    ))}
  </>)
}

function Plans({ d, api, act }) {
  const [p, setP] = useState(d.plans)
  useEffect(() => setP(d.plans), [d.plans])
  const up = (i, k, v) => setP(p.map((x, j) => (j === i ? { ...x, [k]: v } : x)))
  return (<>
    <h1>Packages</h1>
    <div className="a-grid">
      {p.map((x, i) => (
        <div className="a-card a-form" key={x.name}>
          <h3>{x.name} Package</h3>
          <label>Price (INR)<input type="number" min="0" value={x.price} onChange={e => up(i, 'price', e.target.value)} /></label>
          <div className="cols"><label>Edited photos<input type="number" min="0" value={x.photos} onChange={e => up(i, 'photos', e.target.value)} /></label>
            <label>Hours<input type="number" min="0" value={x.hours} onChange={e => up(i, 'hours', e.target.value)} /></label></div>
          <label>Additional services (one per line)<textarea rows="5" value={(x.extras || []).join('\n')} onChange={e => up(i, 'extras', e.target.value.split('\n'))} /></label>
          <label className="chk"><input type="checkbox" checked={!!x.featured} onChange={e => up(i, 'featured', e.target.checked)} /> Highlight as most booked</label>
        </div>
      ))}
    </div>
    <button className="a-btn" onClick={() => act(() => api('/plans', { method: 'PUT', body: JSON.stringify(p) }), 'Packages saved')}>Save packages</button>
  </>)
}
