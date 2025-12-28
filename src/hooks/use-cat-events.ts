import { useState } from 'react'
import { getCatTalk } from '../constants/cat-talk'
import { isKnownProcrastinator } from '../lib/storage'
import { getRandomArrIndex } from '../lib/utils'
import type { CatEvent } from '../types/cat-event'

type CatTalkCategory =
  | 'addAPage'
  | 'enoughSpaceToAddPage'
  | 'taskCompleted'
  | 'taskAdded'
  | 'emptyTaskDeleted'

export function useCatEvents() {
  const catTalk = getCatTalk()
  const [catEvent, setCatEvent] = useState<CatEvent>({
    message: isKnownProcrastinator()
      ? catTalk.initialMessageForVeterans
      : catTalk.initialMessage,
    showAddPageRequest: false,
  })

  const showAddPageRequest = () => {
    setCatEvent({
      ...catEvent,
      showAddPageRequest: true,
    })
  }

  const showRandomMessage = (category: CatTalkCategory) => {
    const catTalk = getCatTalk()
    const messages = catTalk[category] as string[]
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(messages),
      showAddPageRequest: false,
    })
  }

  const clearMessage = () => {
    setCatEvent({
      ...catEvent,
      message: '',
      showAddPageRequest: false,
    })
  }

  return {
    catEvent,
    showAddPageRequest,
    showRandomAddPageMessage: () => showRandomMessage('addAPage'),
    showRandomEnoughSpaceMessage: () =>
      showRandomMessage('enoughSpaceToAddPage'),
    showRandomTaskCompletedMessage: () => showRandomMessage('taskCompleted'),
    showRandomTaskAddedMessage: () => showRandomMessage('taskAdded'),
    showRandomEmptyTaskDeletedMessage: () =>
      showRandomMessage('emptyTaskDeleted'),
    clearMessage,
  }
}
