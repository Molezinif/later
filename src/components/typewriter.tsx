import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string | undefined
}

export function TypewriterText({ text = '' }: Readonly<TypewriterTextProps>) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!text) {
      return
    }
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
    <div class='flex w-full flex-col py-3'>
      <p
        class='max-h-[82%] self-start overflow-y-auto text-base text-foreground [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-gray-200 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: rich text
        dangerouslySetInnerHTML={{ __html: displayedText }}
      />
    </div>
  )
}
