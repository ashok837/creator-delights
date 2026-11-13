import express from 'express'
import multer from 'multer'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PHOTOS, PLANS, REVIEWS } from '../src/assets/data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(__dirname, 'data'), UP = path.join(DATA, 'uploads'), DB = path.join(DATA, 'db.json'), DIST = path.join(__dirname, '../dist')
const USER = process.env.ADMIN_USER || 'admin', PASS = process.env.ADMIN_PASS || 'admin123'
const SECRET = process.env.JWT_SECRET || 'change-this-secret', PORT = process.env.PORT || 4000
if (!process.env.ADMIN_PASS) console.warn('⚠  Using default admin login (admin / admin123). Set ADMIN_USER, ADMIN_PASS and JWT_SECRET before going live.')
fs.mkdirSync(UP, { recursive: true })

const db = fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, 'utf8')) : {
  photos: PHOTOS.map(({ id, cat, title, ar, src, full }) => ({ id, cat, title, ar, src, full })),
  plans: PLANS, reviews: REVIEWS.map((r, i) => ({ ...r, id: 'r' + i })), bookings: []
}
const save = () => fs.writeFileSync(DB, JSON.stringify(db, null, 2))
save()

const hash = s => crypto.createHash('sha256').update(String(s)).digest()
const sign = p => { const b = Buffer.from(JSON.stringify(p)).toString('base64url'); return b + '.' + crypto.createHmac('sha256', SECRET).update(b).digest('base64url') }
const verify = t => {
  try {
    const [b, s] = t.split('.'), e = crypto.createHmac('sha256', SECRET).update(b).digest('base64url')
    return s.length === e.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(e)) && JSON.parse(Buffer.from(b, 'base64url')).exp > Date.now()
  } catch { return false }
}
const auth = (req, res, next) => verify((req.headers.authorization || '').slice(7)) ? next() : res.status(401).json({ error: 'Please sign in again' })

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }
const upload = multer({
  storage: multer.diskStorage({ destination: UP, filename: (_, f, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${EXT[f.mimetype]}`) }),
  fileFilter: (_, f, cb) => cb(null, !!EXT[f.mimetype]), limits: { fileSize: 12 * 1024 * 1024 }
})
const rmFile = src => { if (src?.startsWith('/uploads/')) fs.rm(path.join(UP, path.basename(src)), () => {}) }
const clean = (v, n = 500) => String(v ?? '').trim().slice(0, n)

const app = express()
app.use(express.json({ limit: '100kb' }))
app.use('/uploads', express.static(UP, { maxAge: '7d' }))

// ---- public
app.get('/api/content', (_, res) => res.json({ photos: db.photos, plans: db.plans, reviews: db.reviews }))
app.post('/api/bookings', (req, res) => {
  const b = req.body || {}
  if (!clean(b.name) || !/^\S+@\S+\.\S+$/.test(clean(b.email)) || !clean(b.phone)) return res.status(400).json({ error: 'Name, valid email and phone are required' })
  db.bookings.unshift({ id: crypto.randomUUID(), name: clean(b.name, 100), email: clean(b.email, 120), phone: clean(b.phone, 30), service: clean(b.service, 80), date: clean(b.date, 20), location: clean(b.location, 150), message: clean(b.message, 2000), status: 'New', createdAt: new Date().toISOString() })
  save(); res.status(201).json({ ok: true })
})
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {}
  const ok = crypto.timingSafeEqual(hash(username), hash(USER)) & crypto.timingSafeEqual(hash(password), hash(PASS))
  if (!ok) { await new Promise(r => setTimeout(r, 600)); return res.status(401).json({ error: 'Wrong username or password' }) }
  res.json({ token: sign({ u: USER, exp: Date.now() + 12 * 3600e3 }) })
})

// ---- admin
app.get('/api/bookings', auth, (_, res) => res.json(db.bookings))
app.patch('/api/bookings/:id', auth, (req, res) => {
  const b = db.bookings.find(x => x.id === req.params.id); if (!b) return res.sendStatus(404)
  if (['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'].includes(req.body.status)) b.status = req.body.status
  save(); res.json(b)
})
app.delete('/api/bookings/:id', auth, (req, res) => { db.bookings = db.bookings.filter(x => x.id !== req.params.id); save(); res.json({ ok: true }) })

app.post('/api/photos', auth, upload.array('image', 20), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'Choose a JPG, PNG or WebP image' })
  for (const f of req.files) {
    const src = '/uploads/' + f.filename
    db.photos.unshift({ id: crypto.randomUUID(), cat: clean(req.body.cat, 20) || 'Portrait', ar: clean(req.body.ar, 5) || '3/4', title: clean(req.body.title, 80) || path.parse(f.originalname).name.slice(0, 60), src, full: src })
  }
  save(); res.status(201).json({ ok: true })
})
app.put('/api/photos/:id', auth, (req, res) => {
  const p = db.photos.find(x => x.id === req.params.id); if (!p) return res.sendStatus(404)
  if (req.body.title) p.title = clean(req.body.title, 80)
  if (req.body.cat) p.cat = clean(req.body.cat, 20)
  if (req.body.ar) p.ar = clean(req.body.ar, 5)
  save(); res.json(p)
})
app.delete('/api/photos/:id', auth, (req, res) => {
  const p = db.photos.find(x => x.id === req.params.id); if (p) rmFile(p.src)
  db.photos = db.photos.filter(x => x.id !== req.params.id); save(); res.json({ ok: true })
})

app.post('/api/reviews', auth, upload.single('image'), (req, res) => {
  const { name, role, text, stars } = req.body
  if (!clean(name) || !clean(text)) return res.status(400).json({ error: 'Name and review text are required' })
  db.reviews.unshift({ id: crypto.randomUUID(), name: clean(name, 80), role: clean(role, 80), text: clean(text, 600), stars: Math.min(5, Math.max(1, +stars || 5)), src: req.file ? '/uploads/' + req.file.filename : '' })
  save(); res.status(201).json({ ok: true })
})
app.delete('/api/reviews/:id', auth, (req, res) => {
  const r = db.reviews.find(x => x.id === req.params.id); if (r) rmFile(r.src)
  db.reviews = db.reviews.filter(x => x.id !== req.params.id); save(); res.json({ ok: true })
})
app.put('/api/plans', auth, (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Invalid data' })
  db.plans = req.body.slice(0, 6).map(p => ({ name: clean(p.name, 40), price: Math.max(0, +p.price || 0), photos: Math.max(0, +p.photos || 0), hours: Math.max(0, +p.hours || 0), extras: (p.extras || []).map(s => clean(s, 80)).filter(Boolean), featured: !!p.featured }))
  save(); res.json(db.plans)
})

app.use((err, _req, res, _next) => res.status(400).json({ error: err.message || 'Something went wrong' }))
if (fs.existsSync(DIST)) { app.use(express.static(DIST)); app.get('*', (_, res) => res.sendFile(path.join(DIST, 'index.html'))) }
app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`))
