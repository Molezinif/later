import './App.css'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { CatDialog } from './components/cat-dialog'
import { Header } from './components/header'
import { Button } from './components/ui/button'
import { catTalk } from './constants/cat-talk'
import { placeholderSuggestions } from './constants/placeholder-suggestions'
import type { CatEvent } from './interfaces/cat-event'
import type { TodoForm } from './interfaces/form'

import { getRandomArrIndex } from './lib/utils'

function App() {
  const { control, register, getValues, setFocus } = useForm<TodoForm>({
    defaultValues: {
      todos: localStorage.getItem('todos')
        ? JSON.parse(localStorage.getItem('todos') ?? '[]')
        : [
            {
              page: 1,
              items: new Array(5).fill({ value: '' }),
            },
          ],
    },
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'todos',
  })

  const [paginationProps, setPaginationProps] = useState({
    currentPage: 1,
    totalPages: fields.length || 1,
  })

  const [showMoreStuffToDoButton, setShowMoreStuffToDoButton] = useState(false)

  const [catEvent, setCatEvent] = useState<CatEvent>({
    message:
      localStorage.getItem('knownProcrastinator') === 'true'
        ? catTalk.initialMessageForVeterans
        : catTalk.initialMessage,
    showAddPageRequest: false,
  })

  useEffect(() => {
    if (!localStorage.getItem('knownProcrastinator')) {
      localStorage.setItem('knownProcrastinator', 'true')
    }
    const allFieldsFilled = fields[0].items.every(
      (todo: { value: string }) => todo.value
    )
    if (fields.length === 1 && allFieldsFilled) {
      setShowMoreStuffToDoButton(true)
    }
  }, [fields])

  const placeHolderSuggestion = useMemo(
    () => getRandomArrIndex(placeholderSuggestions),
    []
  )

  const handleAddPage = useCallback(() => {
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(catTalk.addAPage),
      showAddPageRequest: false,
    })

    const pageToAdd = paginationProps.totalPages + 1
    append({ page: pageToAdd, items: new Array(5).fill({ value: '' }) })

    setShowMoreStuffToDoButton(false)

    setPaginationProps({
      currentPage: pageToAdd,
      totalPages: pageToAdd,
    })

    localStorage.setItem('todos', JSON.stringify(getValues().todos))
  }, [paginationProps, catEvent, append, getValues])

  return (
    <div class='flex min-h-screen flex-col font-bit'>
      <Header />

      <main class='flex w-full flex-1 flex-col items-center justify-center gap-2'>
        <h2 class='text-center font-semibold text-2xl dark:text-slate-50'>
          what do you want to "do"?
        </h2>
        <div class='flex flex-col gap-1'>
          {fields.length > 1 && (
            <div class='mr-[40px] flex flex-1 justify-end bg-background'>
              <Button
                class='text-blue-400 hover:text-blue-400 hover:underline'
                onClick={() => {
                  const formValues = getValues().todos
                  let pageWithBlankTask = -1
                  let blankTaskIndex = -1

                  for (let i = formValues.length - 1; i >= 0; i--) {
                    const blankIndex = formValues[i].items.findIndex(
                      (item: { value: string }) => item.value.trim()
                    )
                    if (blankIndex !== -1) {
                      pageWithBlankTask = i
                      blankTaskIndex = blankIndex
                      break
                    }
                  }

                  if (pageWithBlankTask !== -1) {
                    setPaginationProps((prev) => ({
                      ...prev,
                      currentPage: pageWithBlankTask + 1,
                    }))

                    setTimeout(() => {
                      setFocus(
                        `todos.${pageWithBlankTask}.items.${blankTaskIndex}.value`
                      )
                    }, 1)

                    setCatEvent({
                      ...catEvent,
                      message: getRandomArrIndex(catTalk.enoughSpaceToAddPage),
                      showAddPageRequest: false,
                    })
                    return
                  }

                  setCatEvent({
                    ...catEvent,
                    showAddPageRequest: true,
                  })
                }}
                variant='ghost'
              >
                <Plus />
                Add page
              </Button>
            </div>
          )}

          <div class='flex flex-row items-center'>
            {fields.length > 1 && (
              <Button
                class='dark:text-gray-50'
                disabled={paginationProps.currentPage === 1}
                onClick={() => {
                  setPaginationProps((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                  setFocus(
                    `todos.${paginationProps.currentPage - 2}.items.0.value`
                  )
                }}
                variant='ghost'
              >
                <svg
                  fill='none'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <title>Previous page</title>
                  <path
                    d='M16 5v2h-2V5h2zm-4 4V7h2v2h-2zm-2 2V9h2v2h-2zm0 2H8v-2h2v2zm2 2v-2h-2v2h2zm0 0h2v2h-2v-2zm4 4v-2h-2v2h2z'
                    fill='currentColor'
                  />
                </svg>
              </Button>
            )}
            <div class='flex w-[600px] flex-col gap-[1px] rounded-md bg-border'>
              {fields[paginationProps.currentPage - 1].items.map(
                (field, index) => {
                  const fieldRegister = register(
                    `todos.${paginationProps.currentPage - 1}.items.${index}.value`
                  )
                  return (
                    <input
                      key={`${field.value}-${index}`}
                      {...fieldRegister}
                      class={`flex-grow border-x border-t bg-card p-3 text-zinc-950 outline-none focus:ring-1 focus:ring-blue-500 dark:text-gray-50 dark:focus:ring-gray-300 ${index === 0 ? 'rounded-t-md' : ''}
                  ${index === fields[paginationProps.currentPage - 1].items?.length - 1 ? 'rounded-b-md border-b' : ''}`}
                      onChange={(e) => {
                        fieldRegister.onChange(e)

                        const formValues = getValues()
                        localStorage.setItem(
                          'todos',
                          JSON.stringify(formValues.todos)
                        )

                        const currentPageFilled =
                          formValues.todos[
                            paginationProps.currentPage - 1
                          ].items.every((todo) => todo.value) &&
                          paginationProps.totalPages === 1

                        setShowMoreStuffToDoButton(currentPageFilled)
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') {
                          return
                        }

                        const isLastItemOnPage = index === 4
                        const isLastPage =
                          paginationProps.currentPage ===
                          paginationProps.totalPages

                        if (!isLastItemOnPage) {
                          const nextItemPath = `todos.${paginationProps.currentPage - 1}.items.${index + 1}.value`
                          setFocus(
                            nextItemPath as `todos.${number}.items.${number}.value`
                          )
                          return
                        }

                        const nextPage = isLastPage
                          ? 1
                          : paginationProps.currentPage + 1
                        setPaginationProps((prev) => ({
                          ...prev,
                          currentPage: nextPage,
                        }))

                        const nextFocusPath = isLastPage
                          ? 'todos.0.items.0.value'
                          : `todos.${paginationProps.currentPage}.items.0.value`

                        requestAnimationFrame(() => {
                          setFocus(
                            nextFocusPath as `todos.${number}.items.${number}.value`
                          )
                        })
                      }}
                      placeholder={index === 0 ? placeHolderSuggestion : ''}
                      type='text'
                    />
                  )
                }
              )}
            </div>

            {fields.length > 1 && (
              <Button
                class='dark:text-gray-50'
                disabled={
                  paginationProps.currentPage === paginationProps.totalPages
                }
                onClick={() => {
                  setPaginationProps((prev) => ({
                    ...prev,
                    currentPage: paginationProps.currentPage + 1,
                  }))
                  setFocus(
                    `todos.${paginationProps.currentPage - 2}.items.0.value`
                  )
                }}
                variant='ghost'
              >
                <svg
                  fill='none'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <title>Next page</title>
                  <path
                    d='M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z'
                    fill='currentColor'
                  />
                </svg>
              </Button>
            )}
          </div>

          {fields.length > 1 && (
            <div class='mr-[50px] flex flex-1 justify-end bg-background'>
              <p class='dark:text-slate-50'>
                Page {paginationProps.currentPage} of{' '}
                {paginationProps.totalPages}
              </p>
            </div>
          )}
        </div>
        {showMoreStuffToDoButton && (
          <Button
            class='text-blue-400 hover:text-blue-400 hover:underline'
            onClick={() => {
              setCatEvent({
                ...catEvent,
                showAddPageRequest: true,
              })
            }}
            variant='ghost'
          >
            MORE STUFF TO DO??
          </Button>
        )}
      </main>

      <footer class='flex justify-end p-4'>
        <CatDialog
          addPageCallback={handleAddPage}
          handleCloseDialog={() => {
            setCatEvent({
              ...catEvent,
              message: '',
              showAddPageRequest: false,
            })
          }}
          message={catEvent.message}
          showAddPageRequest={catEvent.showAddPageRequest}
          snowBallSize={getValues('todos').reduce((total, page) => {
            const nonEmptyInPage = page.items.filter(
              (item) => item.value.trim() !== ''
            ).length
            return total + nonEmptyInPage
          }, 0)}
        />
      </footer>
    </div>
  )
}

export default App
