import type { TodoForm } from '../types/form'

/**
 * Reorganizes items after one is removed: moves non-empty items to the top,
 * empty items to the bottom, and adds a new empty slot to maintain count.
 */
export function reorganizeItems(
  items: TodoForm['todos'][0]['items'],
  itemIndex: number
): TodoForm['todos'][0]['items'] {
  const itemsWithoutClicked = items.filter((_, i) => i !== itemIndex)
  const nonEmpty = itemsWithoutClicked.filter(
    (item) => item.value.trim() !== ''
  )
  const empty = itemsWithoutClicked.filter((item) => item.value.trim() === '')
  return [...nonEmpty, ...empty, { value: '' }].slice(0, items.length)
}

/**
 * Checks if removing an item would leave the page empty.
 */
export function shouldRemovePage(
  items: TodoForm['todos'][0]['items'],
  totalPages: number
): boolean {
  const nonEmptyCount = items.filter((item) => item.value.trim() !== '').length
  return nonEmptyCount === 0 && totalPages > 1
}
