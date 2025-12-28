import { describe, expect, it } from 'vitest'
import { reorganizeItems, shouldRemovePage } from '@/lib/todo-utils'

describe('reorganizeItems', () => {
  it('should remove clicked item and maintain original array length', () => {
    const items = [
      { value: 'Task 1' },
      { value: 'Task 2' },
      { value: 'Task 3' },
    ]

    const result = reorganizeItems(items, 1)

    expect(result).toHaveLength(3)
  })

  it('should move non-empty items to the top after removal', () => {
    const items = [
      { value: 'Task 1' },
      { value: '' },
      { value: 'Task 3' },
      { value: '' },
      { value: 'Task 5' },
    ]

    const result = reorganizeItems(items, 0)

    expect(result[0].value).toBe('Task 3')
    expect(result[1].value).toBe('Task 5')
    expect(result[2].value).toBe('')
    expect(result[3].value).toBe('')
    expect(result[4].value).toBe('')
  })

  it('should add empty slot at the end when removing a filled item', () => {
    const items = [
      { value: 'Task 1' },
      { value: 'Task 2' },
      { value: 'Task 3' },
    ]

    const result = reorganizeItems(items, 0)

    expect(result[0].value).toBe('Task 2')
    expect(result[1].value).toBe('Task 3')
    expect(result[2].value).toBe('')
  })

  it('should handle removing the last item', () => {
    const items = [
      { value: 'Task 1' },
      { value: 'Task 2' },
      { value: 'Task 3' },
    ]

    const result = reorganizeItems(items, 2)

    expect(result[0].value).toBe('Task 1')
    expect(result[1].value).toBe('Task 2')
    expect(result[2].value).toBe('')
  })

  it('should handle single item array', () => {
    const items = [{ value: 'Only Task' }]

    const result = reorganizeItems(items, 0)

    expect(result).toHaveLength(1)
    expect(result[0].value).toBe('')
  })

  it('should compact items when removing from middle of mixed array', () => {
    const items = [
      { value: 'A' },
      { value: '' },
      { value: 'B' },
      { value: '' },
      { value: 'C' },
    ]

    const result = reorganizeItems(items, 2)

    expect(result[0].value).toBe('A')
    expect(result[1].value).toBe('C')
    expect(result[2].value).toBe('')
    expect(result[3].value).toBe('')
    expect(result[4].value).toBe('')
  })

  it('should treat whitespace-only values as empty', () => {
    const items = [{ value: 'Task 1' }, { value: '   ' }, { value: 'Task 3' }]

    const result = reorganizeItems(items, 0)

    expect(result[0].value).toBe('Task 3')
    expect(result[1].value).toBe('   ')
    expect(result[2].value).toBe('')
  })
})

describe('shouldRemovePage', () => {
  it('should return true when page is empty and there are multiple pages', () => {
    const items = [{ value: '' }, { value: '' }]

    const result = shouldRemovePage(items, 2)

    expect(result).toBe(true)
  })

  it('should return false when page is empty but is the only page', () => {
    const items = [{ value: '' }, { value: '' }]

    const result = shouldRemovePage(items, 1)

    expect(result).toBe(false)
  })

  it('should return false when page has non-empty items', () => {
    const items = [{ value: 'Task' }, { value: '' }]

    const result = shouldRemovePage(items, 2)

    expect(result).toBe(false)
  })

  it('should not count whitespace-only values as non-empty', () => {
    const items = [{ value: '   ' }, { value: '\t\n' }]

    const result = shouldRemovePage(items, 2)

    expect(result).toBe(true)
  })
})
