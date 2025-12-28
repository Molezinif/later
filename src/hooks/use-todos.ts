import { useCallback, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ITEMS_PER_PAGE } from '../constants/todo'
import {
  getTodosFromStorage,
  markAsKnownProcrastinator,
  saveTodosToStorage,
} from '../lib/storage'
import { reorganizeItems } from '../lib/todo-utils'
import type { TodoForm } from '../types/form'

export function useTodos() {
  const methods = useForm<TodoForm>({
    defaultValues: {
      todos: getTodosFromStorage(),
    },
  })

  const { control, getValues, setFocus, watch } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'todos',
  })

  useEffect(() => {
    markAsKnownProcrastinator()
  }, [])

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.todos && Array.isArray(value.todos)) {
        saveTodosToStorage(value.todos as TodoForm['todos'])
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const addPage = useCallback(() => {
    const newPage = fields.length + 1
    append({
      page: newPage,
      items: new Array(ITEMS_PER_PAGE).fill({ value: '' }),
    })
    return newPage
  }, [fields.length, append])

  const clearItem = useCallback(
    (pageIndex: number, itemIndex: number) => {
      const formValues = getValues()
      const currentItems = formValues.todos[pageIndex]?.items || []

      const clickedItem = currentItems[itemIndex]
      if (!clickedItem || clickedItem.value.trim() === '') {
        return { hadValue: false, pageRemoved: false }
      }

      const reorganizedItems = reorganizeItems(currentItems, itemIndex)

      methods.setValue(`todos.${pageIndex}.items`, reorganizedItems, {
        shouldValidate: true,
      })

      const nonEmptyCount = reorganizedItems.filter(
        (item) => item.value.trim() !== ''
      ).length
      const isPageEmpty = nonEmptyCount === 0
      const shouldRemovePage = isPageEmpty && fields.length > 1

      if (shouldRemovePage) {
        remove(pageIndex)
        return {
          hadValue: true,
          pageRemoved: true,
          removedPageIndex: pageIndex,
        }
      }

      return { hadValue: true, pageRemoved: false }
    },
    [methods, getValues, fields.length, remove]
  )

  return {
    methods,
    fields,
    getValues,
    setFocus,
    addPage,
    clearItem,
  }
}
