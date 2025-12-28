import './app-styles.css'
import { Plus } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { FormProvider, useWatch } from 'react-hook-form'
import { CatDialog } from './components/cat-dialog'
import { Header } from './components/header'
import { PageNavigation } from './components/page-navigation'
import { TodoList } from './components/todo-list'
import { Button } from './components/ui/button'
import { useCatEvents } from './hooks/use-cat-events'
import { usePagination } from './hooks/use-pagination'
import { useTodoNavigation } from './hooks/use-todo-navigation'
import { useTodos } from './hooks/use-todos'
import { getTodoPath } from './lib/form-paths'
import { m } from './lib/i18n'
import {
  countNonEmptyTasks,
  findFirstBlankTask,
  isPageFilled,
} from './lib/validation'

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

  const showMoreStuffButton = useMemo(() => {
    const currentPageIndex = pagination.currentPage - 1
    if (fields.length === 0 || !todos || !todos[currentPageIndex]) {
      return false
    }
    const currentPage = todos[currentPageIndex]
    return isPageFilled(currentPage, pagination.totalPages)
  }, [fields.length, pagination, todos])

  const { handleInputKeyDown, focusOnBlankTask } = useTodoNavigation({
    currentPageIndex: pagination.currentPage - 1,
    totalPages: pagination.totalPages,
    setFocus,
    goToPage,
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
    setFocus(getTodoPath(pagination.currentPage - 2, 0))
  }, [goToPreviousPage, pagination.currentPage, setFocus])

  const handleNextPage = useCallback(() => {
    goToNextPage()
    setFocus(getTodoPath(pagination.currentPage, 0))
  }, [goToNextPage, pagination.currentPage, setFocus])

  const handleClearItem = useCallback(
    (pageIndex: number, itemIndex: number) => {
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
    },
    [
      clearItem,
      fields.length,
      goToPage,
      pagination.currentPage,
      showRandomTaskCompletedMessage,
      showRandomEmptyTaskDeletedMessage,
    ]
  )

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

            {(() => {
              const todoList = (
                <TodoList
                  currentPageIndex={pagination.currentPage - 1}
                  fields={fields}
                  onClearItem={handleClearItem}
                  onInputKeyDown={handleInputKeyDown}
                />
              )

              return fields.length > 1 ? (
                <PageNavigation
                  canGoNext={pagination.currentPage < pagination.totalPages}
                  canGoPrevious={pagination.currentPage > 1}
                  onNext={handleNextPage}
                  onPrevious={handlePreviousPage}
                >
                  {todoList}
                </PageNavigation>
              ) : (
                todoList
              )
            })()}

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
