import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'

function renderWithTheme(
  ui: React.ReactElement,
  defaultTheme: 'light' | 'dark' = 'light'
) {
  return render(
    <ThemeProvider defaultTheme={defaultTheme} storageKey='test-theme'>
      {ui}
    </ThemeProvider>
  )
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render app title', () => {
    renderWithTheme(<Header />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should render language selector', () => {
    renderWithTheme(<Header />)

    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should render github button', () => {
    renderWithTheme(<Header />)

    expect(screen.getByTestId('github-button')).toBeInTheDocument()
  })

  it('should render theme toggle button', () => {
    renderWithTheme(<Header />)

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('should toggle theme when theme button is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />, 'light')

    const themeButton = screen.getByTestId('theme-toggle')
    await user.click(themeButton)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should have sticky positioning', () => {
    const { container } = renderWithTheme(<Header />)

    const header = container.querySelector('header')
    expect(header?.className).toContain('sticky')
    expect(header?.className).toContain('top-0')
  })

  it('should be accessible with correct landmark', () => {
    renderWithTheme(<Header />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
