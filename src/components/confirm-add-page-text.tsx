import { useEffect, useState } from 'react'
import { m } from '@/lib/i18n'

interface ConfirmAddPageTextProps {
  count: number
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ConfirmAddPageText({
  count,
}: Readonly<ConfirmAddPageTextProps>) {
  const fullText = m.cat_confirmAddPage({ count })
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!fullText) {
      return
    }

    const shouldAnimate = !prefersReducedMotion()

    if (!shouldAnimate) {
      setDisplayedText(fullText)
      return
    }

    let index = 0
    setDisplayedText('')

    const intervalId = setInterval(() => {
      if (index <= fullText.length - 1) {
        setDisplayedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(intervalId)
      }
    }, 10)

    return () => clearInterval(intervalId)
  }, [fullText])

  const countStr = String(count)
  const countIndex = displayedText.indexOf(countStr)

  if (countIndex === -1) {
    return (
      <div class='flex w-full flex-col py-3'>
        <p class='max-h-[82%] self-start overflow-y-auto text-base text-foreground'>
          {displayedText}
        </p>
      </div>
    )
  }

  const before = displayedText.slice(0, countIndex)
  const after = displayedText.slice(countIndex + countStr.length)

  return (
    <div class='flex w-full flex-col py-3'>
      <p class='max-h-[82%] self-start overflow-y-auto text-base text-foreground'>
        {before}
        <span class='font-bold text-destructive'>{countStr}</span>
        {after}
      </p>
    </div>
  )
}
