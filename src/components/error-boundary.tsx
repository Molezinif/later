import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { Button } from './ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div class='flex min-h-screen flex-col items-center justify-center gap-4 p-4'>
          <div class='text-center'>
            <h1 class='font-semibold text-2xl text-foreground'>
              Something went wrong
            </h1>
            <p class='mt-2 text-muted-foreground'>
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <pre class='mt-4 max-w-md overflow-auto rounded bg-muted p-4 text-left text-sm'>
                {this.state.error.message}
              </pre>
            )}
          </div>
          <Button onClick={this.handleReset} variant='blue'>
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
