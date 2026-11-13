import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ContentProvider } from './assets/ContentContext'
import './index.css'

const Admin = lazy(() => import('./admin/Admin'))
const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? <Suspense fallback={null}><Admin /></Suspense> : <ContentProvider><App /></ContentProvider>}
  </React.StrictMode>
)
