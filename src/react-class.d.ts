import 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    class?: string
  }
  interface SVGAttributes<T> {
    class?: string
  }
}
