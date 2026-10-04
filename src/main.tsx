import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from '@/app/App'
import '@/common/theme/theme.css'

// The router works below the deployment path: a link to /react/reactState opens /lab/react/react/reactState.
// BASE_URL ends with a slash ("/lab/react/"); the basename is written without one.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
