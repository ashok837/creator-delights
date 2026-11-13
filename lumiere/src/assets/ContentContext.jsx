import { createContext, useContext, useEffect, useState } from 'react'
import { PHOTOS, PLANS, REVIEWS } from './data'

const defaults = { photos: PHOTOS, plans: PLANS, reviews: REVIEWS }
const Ctx = createContext(defaults)
export const useContent = () => useContext(Ctx)

export function ContentProvider({ children }) {
  const [c, setC] = useState(defaults)
  useEffect(() => {
    fetch('/api/content').then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => setC({ photos: d.photos?.length ? d.photos : PHOTOS, plans: d.plans?.length ? d.plans : PLANS, reviews: d.reviews || REVIEWS }))
      .catch(() => {})
  }, [])
  return <Ctx.Provider value={c}>{children}</Ctx.Provider>
}
