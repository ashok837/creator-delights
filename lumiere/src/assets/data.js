export const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`
export const rv = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }

export const CATEGORIES = ['All', 'Wedding', 'Portrait', 'Nature', 'Fashion', 'Travel', 'Event']
export const PHOTOS = [
  { id: '1519741497674-611481863552', cat: 'Wedding', title: 'First Vows', ar: '4/5' },
  { id: '1494790108377-be9c29b29330', cat: 'Portrait', title: 'Golden Hour', ar: '3/4' },
  { id: '1506905925346-21bda4d32df4', cat: 'Nature', title: 'Above the Clouds', ar: '4/3' },
  { id: '1469334031218-e382a71b716b', cat: 'Fashion', title: 'Runway Light', ar: '3/4' },
  { id: '1488646953014-85cb44e25828', cat: 'Travel', title: 'Wandering', ar: '1/1' },
  { id: '1492684223066-81342ee5ff30', cat: 'Event', title: 'Night of Lights', ar: '4/3' },
  { id: '1511285560929-80b456fea0bc', cat: 'Wedding', title: 'The Aisle', ar: '3/4' },
  { id: '1507003211169-0a1dd7228f2d', cat: 'Portrait', title: 'Quiet Strength', ar: '4/5' },
  { id: '1441974231531-c6227db76b6e', cat: 'Nature', title: 'Forest Cathedral', ar: '3/4' },
  { id: '1534528741775-53994a69daeb', cat: 'Fashion', title: 'Editorial No. 4', ar: '4/5' },
  { id: '1476514525535-07fb3b4ae5f1', cat: 'Travel', title: 'Lake Mornings', ar: '4/3' },
  { id: '1530103862676-de8c9debad1d', cat: 'Event', title: 'Celebration', ar: '1/1' }
].map(p => ({ ...p, src: u(p.id, 900), full: u(p.id, 1800) }))

export const SERVICES = [
  { name: 'Wedding Photography', img: '1519741497674-611481863552', desc: 'Full-day coverage of your ceremony, rituals and reception, told as a story.', more: ['Two lead photographers', 'Ceremony to last dance', 'Private online gallery', 'Fine-art album option'] },
  { name: 'Pre-Wedding Photography', img: '1537633552985-df8429e8048b', desc: 'A relaxed shoot at a location you love, before the big day.', more: ['2-3 locations', 'Styling guidance', '40 retouched photos', 'Save-the-date designs'] },
  { name: 'Portrait Photography', img: '1494790108377-be9c29b29330', desc: 'Natural, confident portraits for individuals, families and professionals.', more: ['Studio or outdoor', 'Wardrobe consultation', 'Skin retouching', '48-hour preview'] },
  { name: 'Product Photography', img: '1523275335684-37898b6baf30', desc: 'Clean, high-detail images that help your products sell.', more: ['White and lifestyle sets', 'Colour-accurate editing', 'Web-ready exports', 'Fast turnaround'] },
  { name: 'Event Photography', img: '1492684223066-81342ee5ff30', desc: 'Corporate events, launches and parties captured candidly.', more: ['Flexible hours', 'Same-day highlights', 'Group and candid shots', 'Commercial usage rights'] },
  { name: 'Fashion Photography', img: '1469334031218-e382a71b716b', desc: 'Editorial and lookbook shoots with a bold creative direction.', more: ['Concept and moodboard', 'Model and studio support', 'High-end retouching', 'Magazine-ready files'] }
].map(s => ({ ...s, src: u(s.img, 800) }))

export const PLANS = [
  { name: 'Basic', price: 25000, photos: 50, hours: 3, extras: ['1 photographer', 'Online gallery', 'Basic colour grading'] },
  { name: 'Premium', price: 55000, photos: 150, hours: 6, extras: ['2 photographers', 'Online gallery + USB', 'Cinematic colour grading', 'Pre-shoot consultation'], featured: true },
  { name: 'Luxury', price: 95000, photos: 400, hours: 12, extras: ['Lead + assistant', 'Fine-art album', 'Drone coverage', 'Same-day highlights', 'Priority support'] }
]

export const REVIEWS = [
  { name: 'Priya & Arjun', role: 'Wedding clients', img: '1438761681033-6461ffad8d80', stars: 5, text: 'Alexander caught moments we did not even know happened. Every photo feels like a scene from a film. We cry happy tears each time we open the album.' },
  { name: 'Daniel Foster', role: 'Brand founder', img: '1500648767791-00dcc994a43e', stars: 5, text: 'Our product launch images were crisp, elegant and delivered ahead of schedule. Sales on the new line jumped within a week.' },
  { name: 'Sofia Martin', role: 'Fashion model', img: '1534528741775-53994a69daeb', stars: 5, text: 'He knows how to direct without making you feel stiff. My portfolio finally looks the way I always imagined it.' },
  { name: 'Rahul Menon', role: 'Event organiser', img: '1507003211169-0a1dd7228f2d', stars: 4, text: 'Calm, professional and invisible when needed. Guests loved the candid shots and we had highlights the same night.' }
].map(r => ({ ...r, src: u(r.img, 200) }))

export const CONTACT = { email: 'hello@alexanderrowe.com', phone: '+91 98765 43210', wa: '919876543210' }
