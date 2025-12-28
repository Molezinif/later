import { beforeEach, describe, expect, it } from 'vitest'
import { ITEMS_PER_PAGE } from '@/constants/todo'
import {
  getTodosFromStorage,
  isKnownProcrastinator,
  markAsKnownProcrastinator,
  saveTodosToStorage,
} from '@/lib/storage'

describe('getTodosFromStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return default empty page when storage is empty', () => {
    const result = getTodosFromStorage()

    expect(result).toHaveLength(1)
    expect(result[0].page).toBe(1)
    expect(result[0].items).toHaveLength(ITEMS_PER_PAGE)
    expect(result[0].items.every((item) => item.value === '')).toBe(true)
  })

  it('should return stored todos when they exist', () => {
    const storedTodos = [
      { page: 1, items: [{ value: 'Task 1' }, { value: 'Task 2' }] },
    ]
    localStorage.setItem('todos', JSON.stringify(storedTodos))

    const result = getTodosFromStorage()

    expect(result).toEqual(storedTodos)
  })

  it('should return default when stored data is invalid JSON', () => {
    localStorage.setItem('todos', 'not-valid-json{')

    const result = getTodosFromStorage()

    expect(result).toHaveLength(1)
    expect(result[0].page).toBe(1)
  })
})

describe('saveTodosToStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save todos to localStorage', () => {
    const todos = [{ page: 1, items: [{ value: 'Task 1' }] }]

    saveTodosToStorage(todos)

    const stored = localStorage.getItem('todos')
    expect(stored).toBe(JSON.stringify(todos))
  })

  it('should overwrite existing todos', () => {
    localStorage.setItem('todos', JSON.stringify([{ page: 1, items: [] }]))
    const newTodos = [{ page: 1, items: [{ value: 'New Task' }] }]

    saveTodosToStorage(newTodos)

    const stored = JSON.parse(localStorage.getItem('todos') || '[]')
    expect(stored[0].items[0].value).toBe('New Task')
  })
})

describe('procrastinator tracking', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return false for new users', () => {
    const result = isKnownProcrastinator()

    expect(result).toBe(false)
  })

  it('should return true after marking user as procrastinator', () => {
    markAsKnownProcrastinator()

    const result = isKnownProcrastinator()

    expect(result).toBe(true)
  })

  it('should persist procrastinator status across calls', () => {
    expect(isKnownProcrastinator()).toBe(false)

    markAsKnownProcrastinator()

    expect(isKnownProcrastinator()).toBe(true)
    expect(isKnownProcrastinator()).toBe(true)
  })
})
