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
}

export function TodoInput({
  register,
  isFirst,
  isLast,
  placeholder,
  onKeyDown,
  onDone,
}: Readonly<TodoInputProps>) {
  return (
    <div
      class={`group flex flex-row items-center border-x border-t bg-card pl-1 ${
        isFirst ? 'rounded-t-md' : ''
      } ${isLast ? 'rounded-b-md border-b' : ''}`}
    >
      <input
        {...register}
        class={
          'flex-grow bg-card p-4 text-base text-foreground focus:outline-none'
        }
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type='text'
      />
      <Button
        class={`h-full rounded-none p-4 text-base opacity-0 transition-opacity group-hover:opacity-100 ${isLast ? 'rounded-br-sm' : ''} ${isFirst ? 'rounded-tr-sm' : ''}`}
        onClick={onDone}
        variant='ghost'
      >
        {m.done()}
      </Button>
    </div>
  )
}
