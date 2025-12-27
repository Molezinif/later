import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function redirectToMyGithub() {
  window.open('https://github.com/Molezinif', '_blank')
}

export const getRandomArrIndex = (arr: string[]) => {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}
