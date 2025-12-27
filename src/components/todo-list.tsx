import { useMemo } from 'react'
import type { FieldArrayWithId } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { placeholderSuggestions } from '../constants/placeholder-suggestions'
import type { TodoForm } from '../interfaces/form'
import { getRandomArrIndex } from '../lib/utils'
import { TodoInput } from './todo-input'

interface TodoListProps {
  fields: FieldArrayWithId<TodoForm, 'todos', 'id'>[]
  currentPageIndex: number
  onInputKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void
}

export function TodoList({
  fields,
  currentPageIndex,
  onInputKeyDown,
}: Readonly<TodoListProps>) {
  const { register } = useFormContext<TodoForm>()
  const currentPage = fields[currentPageIndex]
  const placeholder = useMemo(
    () => getRandomArrIndex(placeholderSuggestions),
    []
  )

  if (!currentPage) {
    return null
  }

  return (
    <div class='flex w-[600px] flex-col gap-[1px] rounded-md bg-border'>
      {currentPage.items.map((_, index) => {
        const fieldRegister = register(
          `todos.${currentPageIndex}.items.${index}.value`
        )
        const isFirst = index === 0
        const isLast = index === currentPage.items.length - 1

        return (
          <TodoInput
            isFirst={isFirst}
            isLast={isLast}
            key={`todos.${currentPageIndex}.items.${
              // biome-ignore lint/suspicious/noArrayIndexKey: hook forms workaround
              index
            }.value`}
            onKeyDown={(e) => onInputKeyDown(index, e)}
            placeholder={index === 0 ? placeholder : ''}
            register={fieldRegister}
          />
        )
      })}
    </div>
  )
}
