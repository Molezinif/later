import { useEffect, useRef } from 'react'
import { m } from '@/lib/i18n'
import { CatChar } from './cat-char'
import { useTheme } from './theme-provider'
import { TypewriterText } from './typewriter'
import { Button } from './ui/button'

interface CatDialogProps {
  message?: string
  handleCloseDialog: () => void
  showAddPageRequest?: boolean
  snowBallSize?: number
  addPageCallback?: () => void
}

export function CatDialog({
  message,
  handleCloseDialog,
  showAddPageRequest,
  snowBallSize,
  addPageCallback,
}: Readonly<CatDialogProps>) {
  const { theme } = useTheme()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ((showAddPageRequest || message) && dialogRef.current) {
      const firstButton = dialogRef.current.querySelector(
        'button'
      ) as HTMLButtonElement | null
      if (firstButton) {
        requestAnimationFrame(() => {
          firstButton.focus()
        })
      }
    }
  }, [showAddPageRequest, message])

  if (showAddPageRequest) {
    return (
      <div
        aria-describedby='cat-dialog-description'
        aria-labelledby='cat-dialog-title'
        aria-modal='true'
        class='relative flex max-h-[152px] w-[800px] flex-row rounded-lg border bg-white dark:bg-background'
        ref={dialogRef}
        role='dialog'
      >
        <Button
          aria-label={m.cat_closeDialog()}
          class='absolute top-0 right-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          onClick={handleCloseDialog}
          size='icon'
          variant='ghost'
        >
          <svg
            fill='none'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>{m.cat_closeDialog()}</title>
            <path
              d='M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z'
              fill={theme === 'dark' ? 'white' : 'black'}
            />
          </svg>
        </Button>
        <div class='shrink-0 border-r-2 p-3'>
          <CatChar />
        </div>
        <div class='flex-1 p-3'>
          <h1
            class='font-semibold text-foreground text-lg'
            id='cat-dialog-title'
          >
            {m.cat_taskmew()}
          </h1>
          <div id='cat-dialog-description'>
            <TypewriterText
              text={m.cat_confirmAddPage({
                count: snowBallSize ?? 0,
              })}
            />
          </div>
          <div class='flex w-full flex-row justify-end gap-2'>
            <Button
              aria-label={m.app_completeTasks()}
              onClick={handleCloseDialog}
              variant={'blue'}
            >
              {m.app_completeTasks()}
            </Button>
            <Button
              aria-label={m.app_keepProcrastinating()}
              onClick={addPageCallback}
              variant='destructive'
            >
              {m.app_keepProcrastinating()}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!message) {
    return <CatChar />
  }

  return (
    <div
      aria-describedby='cat-message-description'
      aria-labelledby='cat-message-title'
      aria-modal='true'
      class='relative flex max-h-[152px] w-[800px] flex-row rounded-lg border bg-white dark:bg-background'
      ref={dialogRef}
      role='dialog'
    >
      <Button
        aria-label={m.cat_close()}
        class='absolute top-0 right-0 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2'
        onClick={handleCloseDialog}
        size='icon'
        variant='ghost'
      >
        <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <title>{m.cat_close()}</title>
          <path
            d='M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z'
            fill={theme === 'dark' ? 'white' : 'black'}
          />
        </svg>
      </Button>
      <div class='shrink-0 border-r-2 p-3'>
        <CatChar />
      </div>
      <div class='h-full flex-1 p-3'>
        <h1
          class='font-semibold text-foreground text-lg'
          id='cat-message-title'
        >
          {m.cat_taskmew()}
        </h1>
        <div id='cat-message-description'>
          <TypewriterText text={message} />
        </div>
      </div>
    </div>
  )
}
