import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TodoInput } from '@/components/todo-input'

const mockRegister = {
  name: 'todos.0.items.0.value' as const,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
}

describe('TodoInput', () => {
  const defaultProps = {
    register: mockRegister,
    isFirst: false,
    isLast: false,
    onKeyDown: vi.fn(),
    onDone: vi.fn(),
    index: 0,
  }

  it('should render input with correct aria-label', () => {
    render(<TodoInput {...defaultProps} />)

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('1')
    )
  })

  it('should render with placeholder when provided', () => {
    render(<TodoInput {...defaultProps} placeholder='Enter your task' />)

    expect(screen.getByPlaceholderText('Enter your task')).toBeInTheDocument()
  })

  it('should call onKeyDown when key is pressed', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()

    render(<TodoInput {...defaultProps} onKeyDown={onKeyDown} />)

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.keyboard('a')

    expect(onKeyDown).toHaveBeenCalled()
  })

  it('should call onDone when done button is clicked', async () => {
    const user = userEvent.setup()
    const onDone = vi.fn()

    render(<TodoInput {...defaultProps} onDone={onDone} />)

    const doneButton = screen.getByRole('button')
    await user.click(doneButton)

    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('should have rounded top corners when isFirst is true', () => {
    const { container } = render(<TodoInput {...defaultProps} isFirst={true} />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('rounded-t-md')
  })

  it('should have rounded bottom corners and bottom border when isLast is true', () => {
    const { container } = render(<TodoInput {...defaultProps} isLast={true} />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('rounded-b-md')
    expect(wrapper.className).toContain('border-b')
  })

  it('should display correct task number in accessibility label', () => {
    render(<TodoInput {...defaultProps} index={4} />)

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('5')
    )
  })

  it('should have autocomplete off', () => {
    render(<TodoInput {...defaultProps} />)

    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'off')
  })
})
