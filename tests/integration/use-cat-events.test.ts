import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCatEvents } from '@/hooks/use-cat-events'

vi.mock('@/constants/cat-talk', () => ({
  getCatTalk: () => ({
    initialMessage: 'Welcome, new procrastinator!',
    initialMessageForVeterans: 'Back again?',
    addAPage: ['Add page message 1', 'Add page message 2'],
    enoughSpaceToAddPage: ['Enough space message 1'],
    taskCompleted: ['Task done message 1', 'Task done message 2'],
    taskAdded: ['Task added message 1'],
    emptyTaskDeleted: ['Empty deleted message 1'],
  }),
}))

describe('useCatEvents', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should show initial message for new users', () => {
      const { result } = renderHook(() => useCatEvents())

      expect(result.current.catEvent.message).toBe(
        'Welcome, new procrastinator!'
      )
      expect(result.current.catEvent.showAddPageRequest).toBe(false)
    })

    it('should show veteran message for returning users', () => {
      localStorage.setItem('knownProcrastinator', 'true')

      const { result } = renderHook(() => useCatEvents())

      expect(result.current.catEvent.message).toBe('Back again?')
    })
  })

  describe('showAddPageRequest', () => {
    it('should set showAddPageRequest to true', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.showAddPageRequest()
      })

      expect(result.current.catEvent.showAddPageRequest).toBe(true)
    })

    it('should preserve current message when showing add page request', () => {
      const { result } = renderHook(() => useCatEvents())
      const initialMessage = result.current.catEvent.message

      act(() => {
        result.current.showAddPageRequest()
      })

      expect(result.current.catEvent.message).toBe(initialMessage)
    })
  })

  describe('random message functions', () => {
    it('should show random add page message', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.showRandomAddPageMessage()
      })

      expect(['Add page message 1', 'Add page message 2']).toContain(
        result.current.catEvent.message
      )
      expect(result.current.catEvent.showAddPageRequest).toBe(false)
    })

    it('should show random task completed message', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.showRandomTaskCompletedMessage()
      })

      expect(['Task done message 1', 'Task done message 2']).toContain(
        result.current.catEvent.message
      )
    })

    it('should show random task added message', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.showRandomTaskAddedMessage()
      })

      expect(result.current.catEvent.message).toBe('Task added message 1')
    })

    it('should show random enough space message', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.showRandomEnoughSpaceMessage()
      })

      expect(result.current.catEvent.message).toBe('Enough space message 1')
    })

    it('should show random empty task deleted message', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.showRandomEmptyTaskDeletedMessage()
      })

      expect(result.current.catEvent.message).toBe('Empty deleted message 1')
    })

    it('should reset showAddPageRequest when showing random message', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.showAddPageRequest()
      })

      expect(result.current.catEvent.showAddPageRequest).toBe(true)

      act(() => {
        result.current.showRandomTaskCompletedMessage()
      })

      expect(result.current.catEvent.showAddPageRequest).toBe(false)
    })
  })

  describe('clearMessage', () => {
    it('should clear the message', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.clearMessage()
      })

      expect(result.current.catEvent.message).toBe('')
    })

    it('should reset showAddPageRequest when clearing', () => {
      const { result } = renderHook(() => useCatEvents())

      act(() => {
        result.current.showAddPageRequest()
      })

      act(() => {
        result.current.clearMessage()
      })

      expect(result.current.catEvent.showAddPageRequest).toBe(false)
    })
  })
})
