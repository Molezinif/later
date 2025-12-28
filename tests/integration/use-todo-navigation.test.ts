import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useTodoNavigation } from '@/hooks/use-todo-navigation'

function createMockSetFocus() {
  return vi.fn()
}

function createMockGoToPage() {
  return vi.fn()
}

function createKeyboardEvent(
  key: string
): React.KeyboardEvent<HTMLInputElement> {
  return { key } as React.KeyboardEvent<HTMLInputElement>
}

describe('useTodoNavigation', () => {
  describe('handleInputKeyDown', () => {
    it('should do nothing when key is not Enter', () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 0,
          totalPages: 1,
          setFocus,
          goToPage,
        })
      )

      result.current.handleInputKeyDown(0, createKeyboardEvent('Tab'))

      expect(setFocus).not.toHaveBeenCalled()
      expect(goToPage).not.toHaveBeenCalled()
    })

    it('should focus next input on Enter when not on last item', () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 0,
          totalPages: 1,
          setFocus,
          goToPage,
        })
      )

      result.current.handleInputKeyDown(0, createKeyboardEvent('Enter'))

      expect(setFocus).toHaveBeenCalledWith('todos.0.items.1.value')
      expect(goToPage).not.toHaveBeenCalled()
    })

    it('should focus third input when pressing Enter on second input', () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 0,
          totalPages: 1,
          setFocus,
          goToPage,
        })
      )

      result.current.handleInputKeyDown(1, createKeyboardEvent('Enter'))

      expect(setFocus).toHaveBeenCalledWith('todos.0.items.2.value')
    })

    it('should navigate to next page when on last item of non-last page', () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 0,
          totalPages: 3,
          setFocus,
          goToPage,
        })
      )

      result.current.handleInputKeyDown(4, createKeyboardEvent('Enter'))

      expect(goToPage).toHaveBeenCalledWith(2)
    })

    it('should wrap to first page when on last item of last page', () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 2,
          totalPages: 3,
          setFocus,
          goToPage,
        })
      )

      result.current.handleInputKeyDown(4, createKeyboardEvent('Enter'))

      expect(goToPage).toHaveBeenCalledWith(1)
    })

    it('should handle middle page navigation correctly', () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 1,
          totalPages: 5,
          setFocus,
          goToPage,
        })
      )

      result.current.handleInputKeyDown(4, createKeyboardEvent('Enter'))

      expect(goToPage).toHaveBeenCalledWith(3)
    })
  })

  describe('focusOnBlankTask', () => {
    it('should navigate to different page before focusing', () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 0,
          totalPages: 3,
          setFocus,
          goToPage,
        })
      )

      result.current.focusOnBlankTask(2, 1)

      expect(goToPage).toHaveBeenCalledWith(3)
    })

    it('should not navigate when already on target page', () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 1,
          totalPages: 3,
          setFocus,
          goToPage,
        })
      )

      result.current.focusOnBlankTask(1, 2)

      expect(goToPage).not.toHaveBeenCalled()
    })

    it('should focus on correct task index', async () => {
      const setFocus = createMockSetFocus()
      const goToPage = createMockGoToPage()

      vi.useFakeTimers()

      const { result } = renderHook(() =>
        useTodoNavigation({
          currentPageIndex: 0,
          totalPages: 2,
          setFocus,
          goToPage,
        })
      )

      result.current.focusOnBlankTask(0, 3)

      await vi.runAllTimersAsync()

      expect(setFocus).toHaveBeenCalledWith('todos.0.items.3.value')

      vi.useRealTimers()
    })
  })
})
