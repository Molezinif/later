import { useState } from 'react'
import { catTalk } from '../constants/cat-talk'
import type { CatEvent } from '../interfaces/cat-event'
import { isKnownProcrastinator } from '../lib/storage'
import { getRandomArrIndex } from '../lib/utils'

export function useCatEvents() {
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

  const hideAddPageRequest = () => {
    setCatEvent({
      ...catEvent,
      showAddPageRequest: false,
    })
  }

  const showMessage = (message: string) => {
    setCatEvent({
      ...catEvent,
      message,
      showAddPageRequest: false,
    })
  }

  const showRandomAddPageMessage = () => {
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(catTalk.addAPage),
      showAddPageRequest: false,
    })
  }

  const showRandomEnoughSpaceMessage = () => {
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(catTalk.enoughSpaceToAddPage),
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
    hideAddPageRequest,
    showMessage,
    showRandomAddPageMessage,
    showRandomEnoughSpaceMessage,
    clearMessage,
  }
}
