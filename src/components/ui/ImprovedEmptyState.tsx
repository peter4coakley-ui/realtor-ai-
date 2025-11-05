import React from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  suggestion?: string
  className?: string
}

export function ImprovedEmptyState({
  icon,
  title,
  message,
  action,
  secondaryAction,
  suggestion,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon ? (
        <div className="flex justify-center mb-4">{icon}</div>
      ) : (
        <svg
          className="w-16 h-16 mx-auto text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mx-auto mb-6">{message}</p>

      {suggestion && (
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{suggestion}</p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <Button onClick={action.onClick} variant={action.variant || 'default'}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export function NoPropertiesEmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <ImprovedEmptyState
      icon={
        <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      }
      title="Ready to Enhance Your Listings?"
      message="Upload a property photo and watch our AI work its magic. Each analysis enhances lighting, removes distractions, and generates professional descriptions."
      action={{
        label: 'Upload Your First Photo',
        onClick: onUpload,
      }}
    />
  )
}

export function NoResultsEmptyState({ onClearSearch }: { onClearSearch: () => void }) {
  return (
    <ImprovedEmptyState
      icon={
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      }
      title="No Results Found"
      message="We couldn't find any properties matching your search."
      suggestion="Try different keywords or upload a new property photo"
      action={{
        label: 'Clear Search',
        onClick: onClearSearch,
        variant: 'outline',
      }}
    />
  )
}

export function NoCreditsEmptyState({ onBuyCredits }: { onBuyCredits: () => void }) {
  return (
    <ImprovedEmptyState
      icon={
        <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      }
      title="Time to Refill Your Credits"
      message="You need 1 credit to analyze this property. Each credit enhances one photo with AI-powered improvements."
      suggestion="Plans start at just $9.99 for 100 credits"
      action={{
        label: 'Buy Credits',
        onClick: onBuyCredits,
      }}
    />
  )
}
