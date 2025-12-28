import { useCallback, useEffect, useRef } from 'react'
import type { UseFormSetFocus } from 'react-hook-form'
import { LAST_ITEM_INDEX } from '../constants/todo'
import { getTodoPath } from '../lib/form-paths'
import type { TodoForm } from '../types/form'

interface UseTodoNavigationProps {
  currentPageIndex: number
  totalPages: number
  setFocus: UseFormSetFocus<TodoForm>
  goToPage: (page: number) => void
}

export function useTodoNavigation({
  currentPageIndex,
  totalPages,
  setFocus,
  goToPage,
}: UseTodoNavigationProps) {
  const pendingFocus = useRef<string | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: pendingFocus is a ref that triggers focus after page navigation - we intentionally react to currentPageIndex changes to focus the input after the new page renders
  useEffect(() => {
    if (pendingFocus.current) {
      const focusPath = pendingFocus.current
      pendingFocus.current = null
      requestAnimationFrame(() => {
        setFocus(focusPath as Parameters<typeof setFocus>[0])
      })
    }
  }, [currentPageIndex, setFocus])

  const handleInputKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') {
        return
      }

      const isLastItemOnPage = index === LAST_ITEM_INDEX
      const isLastPage = currentPageIndex + 1 === totalPages

      if (!isLastItemOnPage) {
        setFocus(getTodoPath(currentPageIndex, index + 1))
        return
      }

      const nextPage = isLastPage ? 1 : currentPageIndex + 2
      const nextFocusPath = isLastPage
        ? getTodoPath(0, 0)
        : getTodoPath(currentPageIndex + 1, 0)

      pendingFocus.current = nextFocusPath
      goToPage(nextPage)
    },
    [currentPageIndex, totalPages, setFocus, goToPage]
  )

  const focusOnBlankTask = useCallback(
    (pageIndex: number, taskIndex: number) => {
      const targetPage = pageIndex + 1
      const focusPath = getTodoPath(pageIndex, taskIndex)

      if (currentPageIndex + 1 !== targetPage) {
        pendingFocus.current = focusPath
        goToPage(targetPage)
      } else {
        requestAnimationFrame(() => {
          setFocus(focusPath)
        })
      }
    },
    [currentPageIndex, goToPage, setFocus]
  )

  return {
    handleInputKeyDown,
    focusOnBlankTask,
  }
}
