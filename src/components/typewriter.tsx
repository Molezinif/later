import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string | undefined
}

export function TypewriterText({ text = '' }: Readonly<TypewriterTextProps>) {
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
