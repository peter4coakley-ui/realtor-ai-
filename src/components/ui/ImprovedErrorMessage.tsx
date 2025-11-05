import React from 'react'
import { Button } from './Button'

interface ErrorMessageProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function ImprovedErrorMessage({
  title,
  message,
  type = 'error',
  action,
  secondaryAction,
  dismissible = false,
  onDismiss,
  className = ''
}: ErrorMessageProps) {
  const styles = {
    error: {
      bg: 'bg-red-900/20',
      border: 'border-red-500/50',
      text: 'text-red-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    info: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  }

  const style = styles[type]

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`${style.text} flex-shrink-0 mt-0.5`}>{style.icon}</div>

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`${style.text} font-semibold text-sm mb-1`}>{title}</h3>
          )}
          <p className="text-sm text-gray-300">{message}</p>

          {(action || secondaryAction) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {action && (
                <Button onClick={action.onClick} size="sm">
                  {action.label}
                </Button>
              )}
              {secondaryAction && (
                <Button onClick={secondaryAction.onClick} size="sm" variant="outline">
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export function NetworkErrorMessage({ onRetry }: { onRetry: () => void }) {
  return (
    <ImprovedErrorMessage
      type="error"
      title="Connection Issue"
      message="We couldn't connect to our servers. Check your internet connection and try again."
      action={{
        label: 'Retry',
        onClick: onRetry,
      }}
    />
  )
}

export function AuthErrorMessage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <ImprovedErrorMessage
      type="warning"
      title="Session Expired"
      message="For your security, we signed you out after 30 minutes of inactivity. Please sign in again."
      action={{
        label: 'Sign In',
        onClick: onSignIn,
      }}
    />
  )
}

export function LowCreditsWarning({ credits, onBuyCredits, onDismiss }: {
  credits: number
  onBuyCredits: () => void
  onDismiss: () => void
}) {
  return (
    <ImprovedErrorMessage
      type="warning"
      title="Running Low on Credits"
      message={`You have ${credits} ${credits === 1 ? 'credit' : 'credits'} left. Consider adding more to keep analyzing properties without interruption.`}
      action={{
        label: 'Add More Credits',
        onClick: onBuyCredits,
      }}
      secondaryAction={{
        label: "I'm Good for Now",
        onClick: onDismiss,
      }}
      dismissible
      onDismiss={onDismiss}
    />
  )
}
