import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CatDialog } from '@/components/cat-dialog'
import { ThemeProvider } from '@/components/theme-provider'

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider defaultTheme='light' storageKey='test-theme'>
      {ui}
    </ThemeProvider>
  )
}

describe('CatDialog', () => {
  const defaultProps = {
    handleCloseDialog: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('without message or addPageRequest', () => {
    it('should render only the cat character', () => {
      const { container } = renderWithTheme(<CatDialog {...defaultProps} />)

      expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
    })
  })

  describe('with message', () => {
    it('should render dialog with message', () => {
      renderWithTheme(<CatDialog {...defaultProps} message='Test message' />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should render close button', () => {
      renderWithTheme(<CatDialog {...defaultProps} message='Test message' />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should call handleCloseDialog when close button is clicked', async () => {
      const user = userEvent.setup()
      const handleCloseDialog = vi.fn()

      renderWithTheme(
        <CatDialog
          {...defaultProps}
          handleCloseDialog={handleCloseDialog}
          message='Test message'
        />
      )

      await user.click(screen.getByRole('button'))

      expect(handleCloseDialog).toHaveBeenCalledTimes(1)
    })

    it('should have correct aria attributes', () => {
      renderWithTheme(<CatDialog {...defaultProps} message='Test message' />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'cat-message-title')
      expect(dialog).toHaveAttribute(
        'aria-describedby',
        'cat-message-description'
      )
    })
  })

  describe('with showAddPageRequest', () => {
    it('should render add page request dialog', () => {
      renderWithTheme(
        <CatDialog
          {...defaultProps}
          showAddPageRequest={true}
          snowBallSize={5}
        />
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should render action buttons', () => {
      renderWithTheme(
        <CatDialog
          {...defaultProps}
          addPageCallback={vi.fn()}
          showAddPageRequest={true}
          snowBallSize={5}
        />
      )

      expect(screen.getByTestId('complete-tasks-button')).toBeInTheDocument()
      expect(screen.getByTestId('procrastinate-button')).toBeInTheDocument()
    })

    it('should call addPageCallback when procrastinate button is clicked', async () => {
      const user = userEvent.setup()
      const addPageCallback = vi.fn()

      renderWithTheme(
        <CatDialog
          {...defaultProps}
          addPageCallback={addPageCallback}
          showAddPageRequest={true}
          snowBallSize={5}
        />
      )

      await user.click(screen.getByTestId('procrastinate-button'))

      expect(addPageCallback).toHaveBeenCalledTimes(1)
    })

    it('should call handleCloseDialog when complete tasks button is clicked', async () => {
      const user = userEvent.setup()
      const handleCloseDialog = vi.fn()

      renderWithTheme(
        <CatDialog
          {...defaultProps}
          handleCloseDialog={handleCloseDialog}
          showAddPageRequest={true}
          snowBallSize={5}
        />
      )

      await user.click(screen.getByTestId('complete-tasks-button'))

      expect(handleCloseDialog).toHaveBeenCalledTimes(1)
    })

    it('should have correct aria attributes for add page dialog', () => {
      renderWithTheme(
        <CatDialog
          {...defaultProps}
          showAddPageRequest={true}
          snowBallSize={5}
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'cat-dialog-title')
      expect(dialog).toHaveAttribute(
        'aria-describedby',
        'cat-dialog-description'
      )
    })
  })
})
