import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.tsx'
import { ErrorBoundary } from './components/error-boundary.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { getLocale, m } from './lib/i18n'

document.documentElement.lang = getLocale()

const metaDescription = document.querySelector('meta[name="description"]')
if (metaDescription) {
  metaDescription.setAttribute('content', m.app_metaDescription())
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme='light'>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
