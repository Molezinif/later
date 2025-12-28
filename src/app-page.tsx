import './app-styles.css'
import { Plus } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { FormProvider, useWatch } from 'react-hook-form'
import { CatDialog } from './components/cat-dialog'
import { Header } from './components/header'
import { TodoList } from './components/todo-list'
import { Button } from './components/ui/button'
import { useCatEvents } from './hooks/use-cat-events'
import { usePagination } from './hooks/use-pagination'
import { useShowMoreStuffButton } from './hooks/use-show-more-stuff-button'
import { useTodoNavigation } from './hooks/use-todo-navigation'
import { useTodos } from './hooks/use-todos'
import { m } from './lib/i18n'
import { countNonEmptyTasks, findFirstBlankTask } from './lib/validation'

function App() {
  const { methods, fields, getValues, setFocus, addPage, clearItem } =
    useTodos()
  const todos = useWatch({
    control: methods.control,
    name: 'todos',
  })
  const { pagination, goToPage, goToNextPage, goToPreviousPage } =
    usePagination(fields)
  const {
    catEvent,
    showAddPageRequest,
    showRandomAddPageMessage,
    showRandomEnoughSpaceMessage,
    showRandomTaskCompletedMessage,
    showRandomEmptyTaskDeletedMessage,
    clearMessage,
  } = useCatEvents()

  const showMoreStuffButton = useShowMoreStuffButton({
    fields,
    currentPageIndex: pagination.currentPage - 1,
    totalPages: pagination.totalPages,
    control: methods.control,
  })

  const { handleInputKeyDown, focusOnBlankTask } = useTodoNavigation({
    currentPageIndex: pagination.currentPage - 1,
    totalPages: pagination.totalPages,
    setFocus,
    goToPage,
    goToFirstPage: () => goToPage(1),
  })

  const handleAddPageClick = useCallback(() => {
    const formTodos = getValues().todos
    const currentPageIndex = pagination.currentPage - 1
    const blankTask = findFirstBlankTask(formTodos, currentPageIndex)

    if (blankTask) {
      focusOnBlankTask(blankTask.pageIndex, blankTask.taskIndex)
      showRandomEnoughSpaceMessage()
      return
    }

    showAddPageRequest()
  }, [
    getValues,
    pagination.currentPage,
    focusOnBlankTask,
    showAddPageRequest,
    showRandomEnoughSpaceMessage,
  ])

  const handleAddPage = useCallback(() => {
    showRandomAddPageMessage()
    const newPage = addPage()
    goToPage(newPage, true)
  }, [addPage, goToPage, showRandomAddPageMessage])

  const handlePreviousPage = useCallback(() => {
    goToPreviousPage()
    setFocus(
      `todos.${pagination.currentPage - 2}.items.0.value` as `todos.${number}.items.${number}.value`
    )
  }, [goToPreviousPage, pagination.currentPage, setFocus])

  const handleNextPage = useCallback(() => {
    goToNextPage()
    setFocus(
      `todos.${pagination.currentPage}.items.0.value` as `todos.${number}.items.${number}.value`
    )
  }, [goToNextPage, pagination.currentPage, setFocus])

  const snowBallSize = useMemo(
    () => (todos ? countNonEmptyTasks(todos) : 0),
    [todos]
  )

  return (
    <FormProvider {...methods}>
      <div class='flex min-h-screen flex-col font-bit'>
        <Header />

        <main class='flex w-full flex-1 flex-col items-center justify-center gap-2'>
          <h2 class='text-center font-semibold text-2xl text-foreground'>
            {m.app_subtitle()}
          </h2>
          <div class='flex flex-col gap-1'>
            {fields.length > 1 && (
              <div class='mr-[48px] flex flex-1 justify-end bg-background'>
                <Button
                  class='text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300'
                  onClick={handleAddPageClick}
                  variant='ghost'
                >
                  <Plus />
                  {m.app_addPage()}
                </Button>
              </div>
            )}

            <div class='flex flex-row items-center'>
              {fields.length > 1 && (
                <Button
                  class='text-foreground hover:bg-transparent'
                  disabled={pagination.currentPage === 1}
                  onClick={handlePreviousPage}
                  variant='ghost'
                >
                  <svg
                    fill='none'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <title>{m.app_previousPage()}</title>
                    <path
                      d='M16 5v2h-2V5h2zm-4 4V7h2v2h-2zm-2 2V9h2v2h-2zm0 2H8v-2h2v2zm2 2v-2h-2v2h2zm0 0h2v2h-2v-2zm4 4v-2h-2v2h2z'
                      fill='currentColor'
                    />
                  </svg>
                </Button>
              )}

              <TodoList
                currentPageIndex={pagination.currentPage - 1}
                fields={fields}
                onClearItem={(pageIndex, itemIndex) => {
                  const result = clearItem(pageIndex, itemIndex)
                  if (result.hadValue) {
                    showRandomTaskCompletedMessage()
                    if (result.pageRemoved) {
                      const newTotalPages = Math.max(1, fields.length - 1)
                      const currentPageNum = pagination.currentPage
                      if (pageIndex < currentPageNum - 1) {
                        goToPage(currentPageNum - 1)
                      } else if (currentPageNum > newTotalPages) {
                        goToPage(newTotalPages)
                      }
                    }
                  } else {
                    showRandomEmptyTaskDeletedMessage()
                  }
                }}
                onInputKeyDown={handleInputKeyDown}
              />

              {fields.length > 1 && (
                <Button
                  class='text-foreground hover:bg-transparent'
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={handleNextPage}
                  variant='ghost'
                >
                  <svg
                    fill='none'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <title>{m.app_nextPage()}</title>
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
                <p class='text-base text-foreground'>
                  {m.app_page()} {pagination.currentPage} {m.app_of()}{' '}
                  {pagination.totalPages}
                </p>
              </div>
            )}
          </div>
          {showMoreStuffButton && (
            <Button
              class='text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300'
              onClick={showAddPageRequest}
              variant='ghost'
            >
              {m.app_moreStuff()}
            </Button>
          )}
        </main>

        <footer class='flex justify-end p-4'>
          <CatDialog
            addPageCallback={handleAddPage}
            handleCloseDialog={clearMessage}
            message={catEvent.message}
            showAddPageRequest={catEvent.showAddPageRequest}
            snowBallSize={snowBallSize}
          />
        </footer>
      </div>
    </FormProvider>
  )
}

export default App
