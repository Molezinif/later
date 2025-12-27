import type { TodoForm } from '../interfaces/form'

const STORAGE_KEY = 'todos'
const KNOWN_PROCRASTINATOR_KEY = 'knownProcrastinator'

export function getTodosFromStorage(): TodoForm['todos'] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return [{ page: 1, items: new Array(5).fill({ value: '' }) }]
  }
  try {
    return JSON.parse(stored)
  } catch {
    return [{ page: 1, items: new Array(5).fill({ value: '' }) }]
  }
}

export function saveTodosToStorage(todos: TodoForm['todos']): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function isKnownProcrastinator(): boolean {
  return localStorage.getItem(KNOWN_PROCRASTINATOR_KEY) === 'true'
}

export function markAsKnownProcrastinator(): void {
  localStorage.setItem(KNOWN_PROCRASTINATOR_KEY, 'true')
}
