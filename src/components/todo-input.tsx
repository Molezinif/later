import type { UseFormRegisterReturn } from 'react-hook-form'
import { m } from '@/lib/i18n'
import { Button } from './ui/button'

interface TodoInputProps {
  register: UseFormRegisterReturn
  isFirst: boolean
  isLast: boolean
  placeholder?: string
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onDone: () => void
  index: number
}

export function TodoInput({
  register,
  isFirst,
  isLast,
  placeholder,
  onKeyDown,
  onDone,
  index,
}: Readonly<TodoInputProps>) {
  const fieldId = `todo-input-${index}`
  const doneButtonId = `todo-done-${index}`

  return (
    <div
      class={`group flex flex-row items-center border-x border-t bg-card pl-1 ${
        isFirst ? 'rounded-t-md' : ''
      } ${isLast ? 'rounded-b-md border-b' : ''}`}
    >
      <label class='sr-only' htmlFor={fieldId}>
        {m.app_task()} {index + 1}
      </label>
      <input
        {...register}
        aria-label={`${m.app_task()} ${index + 1}${placeholder ? `: ${placeholder}` : ''}`}
        autoComplete='off'
        class={
          'flex-grow bg-card p-4 text-base text-foreground focus:outline-none'
        }
        id={fieldId}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type='text'
      />
      <Button
        aria-label={`${m.done()} - ${m.app_task()} ${index + 1}`}
        class={`h-full rounded-none p-4 text-base opacity-0 transition-opacity focus:outline-none group-focus-within:opacity-100 group-hover:opacity-100 ${isLast ? 'rounded-br-sm' : ''} ${isFirst ? 'rounded-tr-sm' : ''}`}
        id={doneButtonId}
        onClick={onDone}
        variant='ghost'
      >
        {m.done()}
      </Button>
    </div>
  )
}
