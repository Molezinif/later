import { useEffect, useState } from 'react'
import { useTheme } from './theme-provider'
import { Button } from './ui/button'
import { toWords } from 'number-to-words'

interface ICatDialogProps {
  message?: string
  handleCloseDialog: () => void
  showAddPageRequest?: boolean
  snowBallSize?: number
  addPageCallback?: () => void
}

function CatChar() {
  return <img src='/src/assets/cat.png' alt='Taskmeow' className='w-32 h-32' />
}

interface TypewriterTextProps {
  text: string | undefined
}

function TypewriterText({ text = '' }: Readonly<TypewriterTextProps>) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!text) return
    let index = 0
    setDisplayedText('')

    const intervalId = setInterval(() => {
      if (index <= text.length - 1) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(intervalId)
      }
    }, 10)

    return () => clearInterval(intervalId)
  }, [text])

  return (
    <div className='flex flex-col w-full py-3'>
      <p
        className='dark:text-slate-50 max-h-[82%] overflow-y-auto [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-md
          [&::-webkit-scrollbar-thumb]:rounded-md
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
          self-start'
        dangerouslySetInnerHTML={{ __html: displayedText }}
      ></p>
    </div>
  )
}

export function CatDialog({
  message,
  handleCloseDialog,
  showAddPageRequest,
  snowBallSize,
  addPageCallback
}: Readonly<ICatDialogProps>) {
  const { theme } = useTheme()

  if (showAddPageRequest) {
    return (
      <div className='w-[800px] max-h-[152px] border rounded-lg flex flex-row relative bg-white dark:bg-background'>
        <Button variant='ghost' size='icon' className='absolute top-0 right-0' onClick={handleCloseDialog}>
          <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path
              d='M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z'
              fill={theme === 'dark' ? 'white' : 'black'}
            />
          </svg>
        </Button>
        <div className='shrink-0 border-r-2 p-3'>
          <CatChar />
        </div>
        <div className='flex-1 p-3'>
          <h1 className='font-semibold dark:text-slate-50'>taskmew:</h1>
          <TypewriterText
            text={`Are you sure? You already have <span class="text-destructive font-bold">${toWords(
              snowBallSize ?? 0
            ).toUpperCase()}</span> tasks awaiting your goodwill...`}
          />
          <div className='flex flex-row w-full justify-end gap-2'>
            <Button onClick={handleCloseDialog} variant={'blue'}>Complete Tasks</Button>
            <Button variant='destructive' onClick={addPageCallback}>
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
    <div className='w-[800px] max-h-[152px] border rounded-lg flex flex-row relative bg-white dark:bg-background'>
      <Button variant='ghost' size='icon' className='absolute top-0 right-0' onClick={handleCloseDialog}>
        <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <path
            d='M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z'
            fill={theme === 'dark' ? 'white' : 'black'}
          />
        </svg>
      </Button>
      <div className='shrink-0 border-r-2 p-3'>
        <CatChar />
      </div>
      <div className='flex-1 p-3 h-full'>
        <h1 className='font-semibold dark:text-slate-50'>taskmew:</h1>
        <TypewriterText text={message} />
      </div>
    </div>
  )
}
