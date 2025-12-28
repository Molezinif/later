import { useCallback, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  getTodosFromStorage,
  markAsKnownProcrastinator,
  saveTodosToStorage,
} from '../lib/storage'
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
    append({ page: newPage, items: new Array(5).fill({ value: '' }) })
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

      const itemsWithoutClicked = currentItems.filter(
        (_, index) => index !== itemIndex
      )

      const nonEmptyItems = itemsWithoutClicked.filter(
        (item) => item.value.trim() !== ''
      )
      const emptyItems = itemsWithoutClicked.filter(
        (item) => item.value.trim() === ''
      )

      const totalItems = currentItems.length
      const reorganizedItems = [
        ...nonEmptyItems,
        ...emptyItems,
        { value: '' },
      ].slice(0, totalItems)

      methods.setValue(`todos.${pageIndex}.items`, reorganizedItems, {
        shouldValidate: true,
      })

      const isPageEmpty = nonEmptyItems.length === 0
      const totalPages = fields.length
      const shouldRemovePage = isPageEmpty && totalPages > 1

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
