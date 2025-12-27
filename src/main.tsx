import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app-page.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ThemeProvider defaultTheme='light'>
      <App />
    </ThemeProvider>
  </StrictMode>
)
