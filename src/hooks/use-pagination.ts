import { useEffect, useState } from 'react'
import type { FieldArrayWithId } from 'react-hook-form'
import type { TodoForm } from '../types/form'

interface PaginationState {
  currentPage: number
  totalPages: number
}

export function usePagination(
  fields: FieldArrayWithId<TodoForm, 'todos', 'id'>[]
) {
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: fields.length || 1,
  })

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalPages: fields.length || 1,
    }))
  }, [fields.length])

  const goToPage = (page: number, allowFuturePage = false) => {
    if (page < 1) {
      return
    }
    if (!allowFuturePage && page > pagination.totalPages) {
      return
    }
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
      totalPages:
        allowFuturePage && page > prev.totalPages ? page : prev.totalPages,
    }))
  }

  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      goToPage(pagination.currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (pagination.currentPage > 1) {
      goToPage(pagination.currentPage - 1)
    }
  }

  const goToFirstPage = () => {
    goToPage(1)
  }

  return {
    pagination,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
  }
}
