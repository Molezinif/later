import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ITEMS_PER_PAGE } from '@/constants/todo'
import { useTodos } from '@/hooks/use-todos'

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initialization', () => {
    it('should initialize with empty page from storage when no data exists', () => {
      const { result } = renderHook(() => useTodos())

      expect(result.current.fields).toHaveLength(1)
      expect(result.current.fields[0].items).toHaveLength(ITEMS_PER_PAGE)
    })

    it('should load existing todos from storage', () => {
      const existingTodos = [
        {
          page: 1,
          items: [
            { value: 'Task 1' },
            { value: 'Task 2' },
            { value: '' },
            { value: '' },
            { value: '' },
          ],
        },
      ]
      localStorage.setItem('todos', JSON.stringify(existingTodos))

      const { result } = renderHook(() => useTodos())

      const values = result.current.getValues()
      expect(values.todos[0].items[0].value).toBe('Task 1')
      expect(values.todos[0].items[1].value).toBe('Task 2')
    })

    it('should mark user as known procrastinator on mount', () => {
      renderHook(() => useTodos())

      expect(localStorage.getItem('knownProcrastinator')).toBe('true')
    })
  })

  describe('addPage', () => {
    it('should add a new page with empty items', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addPage()
      })

      expect(result.current.fields).toHaveLength(2)
    })

    it('should return the new page number', () => {
      const { result } = renderHook(() => useTodos())

      let newPageNumber = 0
      act(() => {
        newPageNumber = result.current.addPage()
      })

      expect(newPageNumber).toBe(2)
    })

    it('should add multiple pages correctly', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addPage()
        result.current.addPage()
        result.current.addPage()
      })

      expect(result.current.fields).toHaveLength(4)
    })
  })

  describe('clearItem', () => {
    it('should return hadValue false when clearing empty item', () => {
      const { result } = renderHook(() => useTodos())

      let clearResult = { hadValue: false, pageRemoved: false }
      act(() => {
        clearResult = result.current.clearItem(0, 0)
      })

      expect(clearResult.hadValue).toBe(false)
      expect(clearResult.pageRemoved).toBe(false)
    })

    it('should clear item and reorganize remaining items', () => {
      const existingTodos = [
        {
          page: 1,
          items: [
            { value: 'Task 1' },
            { value: 'Task 2' },
            { value: 'Task 3' },
            { value: '' },
            { value: '' },
          ],
        },
      ]
      localStorage.setItem('todos', JSON.stringify(existingTodos))

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.clearItem(0, 0)
      })

      const values = result.current.getValues()
      expect(values.todos[0].items[0].value).toBe('Task 2')
      expect(values.todos[0].items[1].value).toBe('Task 3')
      expect(values.todos[0].items[2].value).toBe('')
    })

    it('should return hadValue true when clearing filled item', () => {
      const existingTodos = [
        {
          page: 1,
          items: [
            { value: 'Task 1' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
          ],
        },
      ]
      localStorage.setItem('todos', JSON.stringify(existingTodos))

      const { result } = renderHook(() => useTodos())

      let clearResult = { hadValue: false, pageRemoved: false }
      act(() => {
        clearResult = result.current.clearItem(0, 0)
      })

      expect(clearResult.hadValue).toBe(true)
    })

    it('should remove page when it becomes empty and there are multiple pages', () => {
      const existingTodos = [
        {
          page: 1,
          items: [
            { value: 'Task 1' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
          ],
        },
        {
          page: 2,
          items: [
            { value: 'Task 2' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
          ],
        },
      ]
      localStorage.setItem('todos', JSON.stringify(existingTodos))

      const { result } = renderHook(() => useTodos())

      let clearResult = { hadValue: false, pageRemoved: false }
      act(() => {
        clearResult = result.current.clearItem(0, 0)
      })

      expect(clearResult.pageRemoved).toBe(true)
      expect(result.current.fields).toHaveLength(1)
    })

    it('should not remove page when it becomes empty but is the only page', () => {
      const existingTodos = [
        {
          page: 1,
          items: [
            { value: 'Task 1' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
          ],
        },
      ]
      localStorage.setItem('todos', JSON.stringify(existingTodos))

      const { result } = renderHook(() => useTodos())

      let clearResult = { hadValue: false, pageRemoved: false }
      act(() => {
        clearResult = result.current.clearItem(0, 0)
      })

      expect(clearResult.pageRemoved).toBe(false)
      expect(result.current.fields).toHaveLength(1)
    })
  })

  describe('persistence', () => {
    it('should persist changes to localStorage when form values change', async () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.methods.setValue('todos.0.items.0.value', 'New Task')
      })

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      const stored = JSON.parse(localStorage.getItem('todos') || '[]')
      expect(stored[0].items[0].value).toBe('New Task')
    })
  })
})
