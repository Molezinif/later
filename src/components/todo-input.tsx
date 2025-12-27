import type { UseFormRegisterReturn } from 'react-hook-form'

interface TodoInputProps {
  register: UseFormRegisterReturn
  isFirst: boolean
  isLast: boolean
  placeholder?: string
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function TodoInput({
  register,
  isFirst,
  isLast,
  placeholder,
  onKeyDown,
}: Readonly<TodoInputProps>) {
  return (
    <input
      {...register}
      class={`flex-grow border-x border-t bg-card p-3 text-zinc-950 outline-none focus:ring-1 focus:ring-blue-500 dark:text-gray-50 dark:focus:ring-gray-300 ${
        isFirst ? 'rounded-t-md' : ''
      } ${isLast ? 'rounded-b-md border-b' : ''}`}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      type='text'
    />
  )
}
