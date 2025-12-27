import { toWords } from 'number-to-words'
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

  if (showAddPageRequest) {
    return (
      <div class='relative flex max-h-[152px] w-[800px] flex-row rounded-lg border bg-white dark:bg-background'>
        <Button
          class='absolute top-0 right-0'
          onClick={handleCloseDialog}
          size='icon'
          variant='ghost'
        >
          <svg
            fill='none'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Close dialog</title>
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
          <h1 class='font-semibold dark:text-slate-50'>taskmew:</h1>
          <TypewriterText
            text={`Are you sure? You already have <span class="text-destructive font-bold">${toWords(
              snowBallSize ?? 0
            ).toUpperCase()}</span> tasks awaiting your goodwill...`}
          />
          <div class='flex w-full flex-row justify-end gap-2'>
            <Button onClick={handleCloseDialog} variant={'blue'}>
              Complete Tasks
            </Button>
            <Button onClick={addPageCallback} variant='destructive'>
              Keep procrastinating
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
    <div class='relative flex max-h-[152px] w-[800px] flex-row rounded-lg border bg-white dark:bg-background'>
      <Button
        class='absolute top-0 right-0'
        onClick={handleCloseDialog}
        size='icon'
        variant='ghost'
      >
        <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <title>Close</title>
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
        <h1 class='font-semibold dark:text-slate-50'>taskmew:</h1>
        <TypewriterText text={message} />
      </div>
    </div>
  )
}
