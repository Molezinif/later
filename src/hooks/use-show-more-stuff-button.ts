import { useMemo } from 'react'
import type { FieldArrayWithId } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import type { TodoForm } from '../interfaces/form'
import { isPageFilled } from '../lib/validation'

interface UseShowMoreStuffButtonProps {
  fields: FieldArrayWithId<TodoForm, 'todos', 'id'>[]
  currentPageIndex: number
  totalPages: number
  control: ReturnType<
    typeof import('react-hook-form').useForm<TodoForm>
  >['control']
}

export function useShowMoreStuffButton({
  fields,
  currentPageIndex,
  totalPages,
  control,
}: UseShowMoreStuffButtonProps) {
  const todos = useWatch({
    control,
    name: 'todos',
  })

  return useMemo(() => {
    if (fields.length === 0 || !todos || !todos[currentPageIndex]) {
      return false
    }

    const currentPage = todos[currentPageIndex]
    return isPageFilled(currentPage, totalPages)
  }, [fields.length, currentPageIndex, totalPages, todos])
}
