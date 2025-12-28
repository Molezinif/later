import { useCallback } from 'react'
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
      goToPage(nextPage)

      const nextFocusPath = isLastPage
        ? getTodoPath(0, 0)
        : getTodoPath(currentPageIndex + 1, 0)

      requestAnimationFrame(() => {
        setFocus(nextFocusPath)
      })
    },
    [currentPageIndex, totalPages, setFocus, goToPage]
  )

  const focusOnBlankTask = useCallback(
    (pageIndex: number, taskIndex: number) => {
      const targetPage = pageIndex + 1
      if (currentPageIndex + 1 !== targetPage) {
        goToPage(targetPage)
      }
      requestAnimationFrame(() => {
        setFocus(getTodoPath(pageIndex, taskIndex))
      })
    },
    [currentPageIndex, goToPage, setFocus]
  )

  return {
    handleInputKeyDown,
    focusOnBlankTask,
  }
}
