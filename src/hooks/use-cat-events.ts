import { useEffect, useState } from 'react'
import { getCatTalk } from '../constants/cat-talk'
import { isKnownProcrastinator } from '../lib/storage'
import { getRandomArrIndex } from '../lib/utils'
import type { CatEvent } from '../types/cat-event'

export function useCatEvents() {
  const catTalk = getCatTalk()
  const [catEvent, setCatEvent] = useState<CatEvent>({
    message: isKnownProcrastinator()
      ? catTalk.initialMessageForVeterans
      : catTalk.initialMessage,
    showAddPageRequest: false,
  })

  useEffect(() => {
    const updatedCatTalk = getCatTalk()
    setCatEvent((prev) => ({
      ...prev,
      message: isKnownProcrastinator()
        ? updatedCatTalk.initialMessageForVeterans
        : updatedCatTalk.initialMessage,
    }))
  }, [])

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
    const updatedCatTalk = getCatTalk()
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(updatedCatTalk.addAPage),
      showAddPageRequest: false,
    })
  }

  const showRandomEnoughSpaceMessage = () => {
    const updatedCatTalk = getCatTalk()
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(updatedCatTalk.enoughSpaceToAddPage),
      showAddPageRequest: false,
    })
  }

  const showRandomTaskCompletedMessage = () => {
    const updatedCatTalk = getCatTalk()
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(updatedCatTalk.taskCompleted),
      showAddPageRequest: false,
    })
  }

  const showRandomTaskAddedMessage = () => {
    const updatedCatTalk = getCatTalk()
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(updatedCatTalk.taskAdded),
      showAddPageRequest: false,
    })
  }

  const showRandomEmptyTaskDeletedMessage = () => {
    const updatedCatTalk = getCatTalk()
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(updatedCatTalk.emptyTaskDeleted),
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
    showRandomTaskCompletedMessage,
    showRandomTaskAddedMessage,
    showRandomEmptyTaskDeletedMessage,
    clearMessage,
  }
}
