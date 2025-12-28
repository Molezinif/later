import { useCallback } from 'react'
import type { UseFormSetFocus } from 'react-hook-form'
import type { TodoForm } from '../types/form'

interface UseTodoNavigationProps {
  currentPageIndex: number
  totalPages: number
  setFocus: UseFormSetFocus<TodoForm>
  goToPage: (page: number) => void
  goToFirstPage: () => void
}

export function useTodoNavigation({
  currentPageIndex,
  totalPages,
  setFocus,
  goToPage,
  goToFirstPage,
}: UseTodoNavigationProps) {
  const handleInputKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') {
        return
      }

      const isLastItemOnPage = index === 4
      const isLastPage = currentPageIndex + 1 === totalPages

      if (!isLastItemOnPage) {
        const nextItemPath = `todos.${currentPageIndex}.items.${index + 1}.value`
        setFocus(nextItemPath as `todos.${number}.items.${number}.value`)
        return
      }

      const nextPage = isLastPage ? 1 : currentPageIndex + 2
      if (isLastPage) {
        goToFirstPage()
      } else {
        goToPage(nextPage)
      }

      const nextFocusPath = isLastPage
        ? 'todos.0.items.0.value'
        : `todos.${currentPageIndex + 1}.items.0.value`

      requestAnimationFrame(() => {
        setFocus(nextFocusPath as `todos.${number}.items.${number}.value`)
      })
    },
    [currentPageIndex, totalPages, setFocus, goToPage, goToFirstPage]
  )

  const focusOnBlankTask = useCallback(
    (pageIndex: number, taskIndex: number) => {
      const targetPage = pageIndex + 1
      if (currentPageIndex + 1 !== targetPage) {
        goToPage(targetPage)
      }
      requestAnimationFrame(() => {
        setFocus(
          `todos.${pageIndex}.items.${taskIndex}.value` as `todos.${number}.items.${number}.value`
        )
      })
    },
    [currentPageIndex, goToPage, setFocus]
  )

  return {
    handleInputKeyDown,
    focusOnBlankTask,
  }
}
