import { m } from '@/lib/i18n'
import { Button } from './ui/button'

interface PageNavigationProps {
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  children: React.ReactNode
}

export function PageNavigation({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  children,
}: Readonly<PageNavigationProps>) {
  return (
    <nav
      aria-label={m.app_pageNavigation()}
      class='flex flex-row items-center gap-2'
    >
      <Button
        aria-label={m.app_previousPage()}
        class='p-2 text-foreground hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:p-1'
        disabled={!canGoPrevious}
        onClick={onPrevious}
        variant='ghost'
      >
        <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <title>{m.app_previousPage()}</title>
          <path
            d='M16 5v2h-2V5h2zm-4 4V7h2v2h-2zm-2 2V9h2v2h-2zm0 2H8v-2h2v2zm2 2v-2h-2v2h2zm0 0h2v2h-2v-2zm4 4v-2h-2v2h2z'
            fill='currentColor'
          />
        </svg>
      </Button>
      {children}
      <Button
        aria-label={m.app_nextPage()}
        class='p-2 text-foreground hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:p-1'
        disabled={!canGoNext}
        onClick={onNext}
        variant='ghost'
      >
        <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <title>{m.app_nextPage()}</title>
          <path
            d='M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z'
            fill='currentColor'
          />
        </svg>
      </Button>
    </nav>
  )
}
