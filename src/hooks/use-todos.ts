import { useCallback, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { TodoForm } from '../types/form'
import {
  getTodosFromStorage,
  markAsKnownProcrastinator,
  saveTodosToStorage,
} from '../lib/storage'

export function useTodos() {
  const methods = useForm<TodoForm>({
    defaultValues: {
      todos: getTodosFromStorage(),
    },
  })

  const { control, getValues, setFocus, watch } = methods

  const { fields, append } = useFieldArray({
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

  return {
    methods,
    fields,
    getValues,
    setFocus,
    addPage,
  }
}
