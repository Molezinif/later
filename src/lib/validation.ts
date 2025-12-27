import type { TodoForm } from '../types/form'

export function hasBlankTask(todos: TodoForm['todos']): {
  pageIndex: number
  taskIndex: number
} | null {
  for (let i = todos.length - 1; i >= 0; i--) {
    const blankIndex = todos[i].items.findIndex((item) => !item.value.trim())
    if (blankIndex !== -1) {
      return { pageIndex: i, taskIndex: blankIndex }
    }
  }
  return null
}

export function isPageFilled(
  page: TodoForm['todos'][0],
  totalPages: number
): boolean {
  return (
    page.items.every((item) => item.value.trim() !== '') && totalPages === 1
  )
}

export function countNonEmptyTasks(todos: TodoForm['todos']): number {
  return todos.reduce((total, page) => {
    const nonEmptyInPage = page.items.filter(
      (item) => item.value.trim() !== ''
    ).length
    return total + nonEmptyInPage
  }, 0)
}
