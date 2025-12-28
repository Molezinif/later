import { act, renderHook } from '@testing-library/react'
import type { FieldArrayWithId } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { usePagination } from '@/hooks/use-pagination'
import type { TodoForm } from '@/types/form'

function createMockFields(
  count: number
): FieldArrayWithId<TodoForm, 'todos', 'id'>[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `field-${i}`,
    page: i + 1,
    items: [],
  }))
}

describe('usePagination', () => {
  describe('initial state', () => {
    it('should start at page 1 with correct total pages', () => {
      const fields = createMockFields(3)

      const { result } = renderHook(() => usePagination(fields))

      expect(result.current.pagination.currentPage).toBe(1)
      expect(result.current.pagination.totalPages).toBe(3)
    })

    it('should default to 1 total page when fields are empty', () => {
      const { result } = renderHook(() => usePagination([]))

      expect(result.current.pagination.totalPages).toBe(1)
    })
  })

  describe('goToPage', () => {
    it('should navigate to a valid page', () => {
      const fields = createMockFields(5)
      const { result } = renderHook(() => usePagination(fields))

      act(() => {
        result.current.goToPage(3)
      })

      expect(result.current.pagination.currentPage).toBe(3)
    })

    it('should not navigate to page less than 1', () => {
      const fields = createMockFields(3)
      const { result } = renderHook(() => usePagination(fields))

      act(() => {
        result.current.goToPage(0)
      })

      expect(result.current.pagination.currentPage).toBe(1)
    })

    it('should not navigate beyond total pages by default', () => {
      const fields = createMockFields(3)
      const { result } = renderHook(() => usePagination(fields))

      act(() => {
        result.current.goToPage(5)
      })

      expect(result.current.pagination.currentPage).toBe(1)
    })

    it('should allow future page navigation when allowFuturePage is true', () => {
      const fields = createMockFields(3)
      const { result } = renderHook(() => usePagination(fields))

      act(() => {
        result.current.goToPage(5, true)
      })

      expect(result.current.pagination.currentPage).toBe(5)
      expect(result.current.pagination.totalPages).toBe(5)
    })
  })

  describe('goToNextPage', () => {
    it('should move to the next page when not on last page', () => {
      const fields = createMockFields(3)
      const { result } = renderHook(() => usePagination(fields))

      act(() => {
        result.current.goToNextPage()
      })

      expect(result.current.pagination.currentPage).toBe(2)
    })

    it('should not move past the last page', () => {
      const fields = createMockFields(3)
      const { result } = renderHook(() => usePagination(fields))

      act(() => {
        result.current.goToPage(3)
      })

      act(() => {
        result.current.goToNextPage()
      })

      expect(result.current.pagination.currentPage).toBe(3)
    })
  })

  describe('goToPreviousPage', () => {
    it('should move to the previous page when not on first page', () => {
      const fields = createMockFields(3)
      const { result } = renderHook(() => usePagination(fields))

      act(() => {
        result.current.goToPage(3)
      })

      act(() => {
        result.current.goToPreviousPage()
      })

      expect(result.current.pagination.currentPage).toBe(2)
    })

    it('should not move before the first page', () => {
      const fields = createMockFields(3)
      const { result } = renderHook(() => usePagination(fields))

      act(() => {
        result.current.goToPreviousPage()
      })

      expect(result.current.pagination.currentPage).toBe(1)
    })
  })

  describe('dynamic field changes', () => {
    it('should update total pages when fields change', () => {
      const initialFields = createMockFields(2)
      const { result, rerender } = renderHook(
        ({ fields }) => usePagination(fields),
        { initialProps: { fields: initialFields } }
      )

      expect(result.current.pagination.totalPages).toBe(2)

      const newFields = createMockFields(5)
      rerender({ fields: newFields })

      expect(result.current.pagination.totalPages).toBe(5)
    })
  })
})
