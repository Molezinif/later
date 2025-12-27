import { useEffect, useState } from 'react'
import type { FieldArrayWithId } from 'react-hook-form'
import type { TodoForm } from '../interfaces/form'

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

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) {
      return
    }
    setPagination((prev) => ({ ...prev, currentPage: page }))
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
