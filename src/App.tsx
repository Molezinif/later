import './App.css'
import { Header } from './components/header'
import { CatDialog } from './components/cat-dialog'
import { useFieldArray, useForm } from 'react-hook-form'
import { placeholderSuggestions } from './constants/placeholder-suggestions'
import { getRandomArrIndex } from './lib/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from './components/ui/button'
import { catTalk } from './constants/cat-talk'
import { Plus } from 'lucide-react'

interface TodoForm {
  todos: { page: number; items: { value: string }[] }[]
}

function App() {
  const { control, register, getValues, setFocus } = useForm<TodoForm>({
    defaultValues: {
      todos: localStorage.getItem('todos')
        ? JSON.parse(localStorage.getItem('todos')!)
        : [
            {
              page: 1,
              items: Array(5).fill({ value: '' })
            }
          ]
    }
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'todos'
  })

  const [paginationProps, setPaginationProps] = useState({
    currentPage: 1,
    totalPages: fields.length || 1
  })

  const [showMoreStuffToDoButton, setShowMoreStuffToDoButton] = useState(false)

  const [catEvent, setCatEvent] = useState<any>({
    message:
      localStorage.getItem('knownProcrastinator') === 'true'
        ? catTalk.initialMessageForVeterans
        : catTalk.initialMessage,
    showAddPageRequest: false
  })

  useEffect(() => {
    if (!localStorage.getItem('knownProcrastinator')) {
      localStorage.setItem('knownProcrastinator', 'true')
    }
    const allFieldsFilled = fields[0].items.every((todo) => todo.value)
    if (fields.length === 1 && allFieldsFilled) {
      setShowMoreStuffToDoButton(true)
    }
  }, [])

  const placeHolderSuggestion = useMemo(() => getRandomArrIndex(placeholderSuggestions), [])

  const handleAddPage = useCallback(() => {
    setCatEvent({
      ...catEvent,
      message: getRandomArrIndex(catTalk.addAPage),
      showAddPageRequest: false
    })

    const pageToAdd = paginationProps.totalPages + 1
    append({ page: pageToAdd, items: Array(5).fill({ value: '' }) })

    setShowMoreStuffToDoButton(false)

    setPaginationProps({
      currentPage: pageToAdd,
      totalPages: pageToAdd
    })

    localStorage.setItem('todos', JSON.stringify(getValues().todos))
  }, [paginationProps, catEvent, append, getValues])

  return (
    <div className='font-bit min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1 flex flex-col items-center justify-center w-full gap-2'>
        <h2 className='text-2xl font-semibold text-center dark:text-slate-50'>what do you want to "do"?</h2>
        <div className='flex flex-col gap-1'>
          {fields.length > 1 && (
            <div className='flex-1 flex justify-end bg-background mr-[40px]'>
              <Button
                variant='ghost'
                className='text-blue-400 hover:underline hover:text-blue-400'
                onClick={() => {
                  const formValues = getValues().todos
                  let pageWithBlankTask = -1
                  let blankTaskIndex = -1

                  for (let i = formValues.length - 1; i >= 0; i--) {
                    const blankIndex = formValues[i].items.findIndex((item) => !item.value.trim())
                    if (blankIndex !== -1) {
                      pageWithBlankTask = i
                      blankTaskIndex = blankIndex
                      break
                    }
                  }

                  if (pageWithBlankTask !== -1) {
                    setPaginationProps((prev) => ({
                      ...prev,
                      currentPage: pageWithBlankTask + 1
                    }))

                    setTimeout(() => {
                      setFocus(`todos.${pageWithBlankTask}.items.${blankTaskIndex}.value`)
                    }, 1)

                    setCatEvent({
                      ...catEvent,
                      message: getRandomArrIndex(catTalk.enoughSpaceToAddPage),
                      showAddPageRequest: false
                    })
                    return
                  }

                  setCatEvent({
                    ...catEvent,
                    showAddPageRequest: true
                  })
                }}
              >
                <Plus />
                Add page
              </Button>
            </div>
          )}

          <div className='flex flex-row items-center'>
            {fields.length > 1 && (
              <Button
                variant='ghost'
                className='dark:text-gray-50'
                onClick={() => {
                  setPaginationProps((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
                  setFocus(`todos.${paginationProps.currentPage - 2}.items.0.value`)
                }}
                disabled={paginationProps.currentPage === 1}
              >
                <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path
                    d='M16 5v2h-2V5h2zm-4 4V7h2v2h-2zm-2 2V9h2v2h-2zm0 2H8v-2h2v2zm2 2v-2h-2v2h2zm0 0h2v2h-2v-2zm4 4v-2h-2v2h2z'
                    fill='currentColor'
                  />
                </svg>
              </Button>
            )}
            <div className='flex flex-col gap-[1px] bg-border rounded-md  w-[600px]'>
              {fields[paginationProps.currentPage - 1].items.map((field, index) => {
                const fieldRegister = register(`todos.${paginationProps.currentPage - 1}.items.${index}.value`)
                return (
                  <input
                    key={`${field.value}-${index}`}
                    {...fieldRegister}
                    onChange={(e) => {
                      fieldRegister.onChange(e)

                      const formValues = getValues()
                      localStorage.setItem('todos', JSON.stringify(formValues.todos))

                      const currentPageFilled =
                        formValues.todos[paginationProps.currentPage - 1].items.every((todo) => todo.value) &&
                        paginationProps.totalPages === 1

                      setShowMoreStuffToDoButton(currentPageFilled)
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return

                      const isLastItemOnPage = index === 4
                      const isLastPage = paginationProps.currentPage === paginationProps.totalPages

                      if (!isLastItemOnPage) {
                        const nextItemPath = `todos.${paginationProps.currentPage - 1}.items.${index + 1}.value`
                        setFocus(nextItemPath as `todos.${number}.items.${number}.value`)
                        return
                      }

                      const nextPage = isLastPage ? 1 : paginationProps.currentPage + 1
                      setPaginationProps((prev) => ({ ...prev, currentPage: nextPage }))

                      const nextFocusPath = isLastPage
                        ? 'todos.0.items.0.value'
                        : `todos.${paginationProps.currentPage}.items.0.value`

                      requestAnimationFrame(() => {
                        setFocus(nextFocusPath as `todos.${number}.items.${number}.value`)
                      })
                    }}
                    type='text'
                    placeholder={index === 0 ? placeHolderSuggestion : ''}
                    className={`flex-grow p-3 bg-card border outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-gray-300 dark:text-gray-50 text-zinc-950
                  ${index === 0 ? 'rounded-t-md' : ''}
                  ${index === fields[paginationProps.currentPage - 1].items?.length - 1 ? 'rounded-b-md' : ''}`}
                  />
                )
              })}
            </div>

            {fields.length > 1 && (
              <Button
                variant='ghost'
                className='dark:text-gray-50'
                onClick={() => {
                  setPaginationProps((prev) => ({ ...prev, currentPage: paginationProps.currentPage + 1 }))
                  setFocus(`todos.${paginationProps.currentPage - 2}.items.0.value`)
                }}
                disabled={paginationProps.currentPage === paginationProps.totalPages}
              >
                <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path
                    d='M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z'
                    fill='currentColor'
                  />
                </svg>
              </Button>
            )}
          </div>

          {fields.length > 1 && (
            <div className='flex-1 flex justify-end bg-background mr-[50px]'>
              <p className='dark:text-slate-50'>
                Page {paginationProps.currentPage} of {paginationProps.totalPages}
              </p>
            </div>
          )}
        </div>
        {showMoreStuffToDoButton && (
          <Button
            variant='ghost'
            className='text-blue-400 hover:underline hover:text-blue-400'
            onClick={() => {
              setCatEvent({
                ...catEvent,
                showAddPageRequest: true
              })
            }}
          >
            MORE STUFF TO DO??
          </Button>
        )}
      </main>

      <footer className='flex p-4 justify-end'>
        <CatDialog
          message={catEvent.message}
          handleCloseDialog={() => {
            setCatEvent({ ...catEvent, message: '', showAddPageRequest: false })
          }}
          showAddPageRequest={catEvent.showAddPageRequest}
          addPageCallback={handleAddPage}
          snowBallSize={getValues('todos').reduce((total, page) => {
            const nonEmptyInPage = page.items.filter((item) => item.value.trim() !== '').length
            return total + nonEmptyInPage
          }, 0)}
        />
      </footer>
    </div>
  )
}

export default App
