import React from 'react'
import { useFormValidation } from '../../contexts/FormValidationContext'

interface FormErrorSummaryProps {
  title?: string
  showOnlyAfterSubmit?: boolean
  fieldLabels?: { [fieldName: string]: string }
  onFieldClick?: (fieldName: string) => void
}

export function FormErrorSummary({
  title = 'Please fix the following errors:',
  showOnlyAfterSubmit = true,
  fieldLabels = {},
  onFieldClick
}: FormErrorSummaryProps) {
  const { fields, submitCount } = useFormValidation()

  const errors = Object.entries(fields)
    .filter(([_, field]) => field.error && field.touched)
    .map(([name, field]) => ({
      name,
      error: field.error!
    }))

  const warnings = errors.filter(e => e.error.type === 'warning')
  const criticalErrors = errors.filter(e => e.error.type === 'error')

  if (showOnlyAfterSubmit && submitCount === 0) {
    return null
  }

  if (errors.length === 0) {
    return null
  }

  const handleFieldClick = (fieldName: string) => {
    if (onFieldClick) {
      onFieldClick(fieldName)
    } else {
      const element = document.getElementById(fieldName)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
  }

  return (
    <div className="rounded-lg border border-red-500/50 bg-red-900/10 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-400 mb-2">{title}</h3>

          {criticalErrors.length > 0 && (
            <ul className="space-y-2 mb-3">
              {criticalErrors.map(({ name, error }) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => handleFieldClick(name)}
                    className="text-sm text-red-300 hover:text-red-200 transition-colors text-left flex items-start gap-2 group"
                  >
                    <span className="group-hover:underline">
                      <strong className="font-medium">{fieldLabels[name] || name}:</strong>{' '}
                      {error.message}
                    </span>
                    <svg
                      className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {warnings.length > 0 && (
            <>
              {criticalErrors.length > 0 && <div className="border-t border-yellow-500/30 my-3" />}
              <div className="space-y-2">
                <p className="text-xs font-medium text-yellow-400 mb-1">Warnings:</p>
                <ul className="space-y-2">
                  {warnings.map(({ name, error }) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => handleFieldClick(name)}
                        className="text-sm text-yellow-300 hover:text-yellow-200 transition-colors text-left flex items-start gap-2 group"
                      >
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="group-hover:underline">
                          <strong className="font-medium">{fieldLabels[name] || name}:</strong>{' '}
                          {error.message}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
