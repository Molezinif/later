import { describe, expect, it } from 'vitest'
import {
  countNonEmptyTasks,
  findFirstBlankTask,
  isPageFilled,
} from '@/lib/validation'
import type { TodoForm } from '@/types/form'

describe('findFirstBlankTask', () => {
  it('should find blank task in current page first', () => {
    const todos: TodoForm['todos'] = [
      {
        page: 1,
        items: [{ value: 'Task 1' }, { value: '' }, { value: 'Task 3' }],
      },
      { page: 2, items: [{ value: '' }, { value: '' }, { value: '' }] },
    ]

    const result = findFirstBlankTask(todos, 0)

    expect(result).toEqual({ pageIndex: 0, taskIndex: 1 })
  })

  it('should search other pages when current page is full', () => {
    const todos: TodoForm['todos'] = [
      {
        page: 1,
        items: [{ value: 'Task 1' }, { value: 'Task 2' }, { value: 'Task 3' }],
      },
      {
        page: 2,
        items: [{ value: 'Task 4' }, { value: '' }, { value: 'Task 6' }],
      },
    ]

    const result = findFirstBlankTask(todos, 0)

    expect(result).toEqual({ pageIndex: 1, taskIndex: 1 })
  })

  it('should return null when all tasks are filled', () => {
    const todos: TodoForm['todos'] = [
      { page: 1, items: [{ value: 'Task 1' }, { value: 'Task 2' }] },
      { page: 2, items: [{ value: 'Task 3' }, { value: 'Task 4' }] },
    ]

    const result = findFirstBlankTask(todos, 0)

    expect(result).toBeNull()
  })

  it('should treat whitespace-only values as blank', () => {
    const todos: TodoForm['todos'] = [
      {
        page: 1,
        items: [{ value: 'Task 1' }, { value: '   ' }, { value: '\t' }],
      },
    ]

    const result = findFirstBlankTask(todos, 0)

    expect(result).toEqual({ pageIndex: 0, taskIndex: 1 })
  })

  it('should handle empty todos array gracefully', () => {
    const result = findFirstBlankTask([], 0)

    expect(result).toBeNull()
  })

  it('should handle invalid page index gracefully', () => {
    const todos: TodoForm['todos'] = [{ page: 1, items: [{ value: '' }] }]

    const result = findFirstBlankTask(todos, 999)

    expect(result).toEqual({ pageIndex: 0, taskIndex: 0 })
  })
})

describe('isPageFilled', () => {
  it('should return true when single page is completely filled', () => {
    const page = { page: 1, items: [{ value: 'Task 1' }, { value: 'Task 2' }] }

    const result = isPageFilled(page, 1)

    expect(result).toBe(true)
  })

  it('should return false when page has empty items', () => {
    const page = { page: 1, items: [{ value: 'Task 1' }, { value: '' }] }

    const result = isPageFilled(page, 1)

    expect(result).toBe(false)
  })

  it('should return false when there are multiple pages even if current is filled', () => {
    const page = { page: 1, items: [{ value: 'Task 1' }, { value: 'Task 2' }] }

    const result = isPageFilled(page, 2)

    expect(result).toBe(false)
  })

  it('should treat whitespace-only values as empty', () => {
    const page = { page: 1, items: [{ value: 'Task 1' }, { value: '   ' }] }

    const result = isPageFilled(page, 1)

    expect(result).toBe(false)
  })
})

describe('countNonEmptyTasks', () => {
  it('should count all non-empty tasks across pages', () => {
    const todos: TodoForm['todos'] = [
      {
        page: 1,
        items: [{ value: 'Task 1' }, { value: '' }, { value: 'Task 3' }],
      },
      {
        page: 2,
        items: [{ value: 'Task 4' }, { value: 'Task 5' }, { value: '' }],
      },
    ]

    const result = countNonEmptyTasks(todos)

    expect(result).toBe(4)
  })

  it('should return zero for empty todos', () => {
    const result = countNonEmptyTasks([])

    expect(result).toBe(0)
  })

  it('should return zero when all tasks are empty', () => {
    const todos: TodoForm['todos'] = [
      { page: 1, items: [{ value: '' }, { value: '' }] },
    ]

    const result = countNonEmptyTasks(todos)

    expect(result).toBe(0)
  })

  it('should not count whitespace-only values', () => {
    const todos: TodoForm['todos'] = [
      {
        page: 1,
        items: [{ value: 'Task 1' }, { value: '   ' }, { value: '\n\t' }],
      },
    ]

    const result = countNonEmptyTasks(todos)

    expect(result).toBe(1)
  })
})
