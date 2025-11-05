import React, { useEffect, useCallback } from 'react'
import { useFormValidation, FieldError } from '../../contexts/FormValidationContext'
import { debounce } from '../../utils/formValidation'

interface FormFieldProps {
  name: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  validate?: (value: any) => Promise<FieldError | null>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  helpText?: string
  successMessage?: string
  children?: (props: {
    value: any
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: () => void
    onFocus: () => void
    error?: FieldError
    touched: boolean
    dirty: boolean
  }) => React.ReactNode
  className?: string
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  validate,
  validateOnChange = true,
  validateOnBlur = true,
  helpText,
  successMessage,
  children,
  className = ''
}: FormFieldProps) {
  const {
    fields,
    setFieldValue,
    setFieldTouched,
    validateField,
    registerValidator,
    submitCount
  } = useFormValidation()

  const field = fields[name] || { value: '', touched: false, dirty: false }
  const [isFocused, setIsFocused] = React.useState(false)

  const debouncedValidate = useCallback(
    debounce(() => {
      if (validate && field.touched) {
        validateField(name)
      }
    }, 300),
    [validate, field.touched, validateField, name]
  )

  useEffect(() => {
    if (validate) {
      registerValidator(name, validate)
    }
  }, [name, validate, registerValidator])

  useEffect(() => {
    if (submitCount > 0 && !field.touched) {
      setFieldTouched(name, true)
    }
  }, [submitCount, name, field.touched, setFieldTouched])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFieldValue(name, value)

    if (validateOnChange && field.touched) {
      debouncedValidate()
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    setFieldTouched(name, true)

    if (validateOnBlur) {
      validateField(name)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const showError = field.error && field.touched && !isFocused
  const showSuccess = !field.error && field.touched && field.dirty && field.value && successMessage
  const showHelp = !showError && !showSuccess && helpText

  const getBorderColor = () => {
    if (disabled) return 'border-gray-700'
    if (showError) {
      return field.error?.type === 'warning'
        ? 'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500'
        : 'border-red-500 focus:ring-red-500 focus:border-red-500'
    }
    if (showSuccess) return 'border-green-500 focus:ring-green-500 focus:border-green-500'
    return 'border-gray-600 focus:ring-teal-500 focus:border-teal-500'
  }

  const getBackgroundColor = () => {
    if (disabled) return 'bg-gray-800/30'
    if (showError) {
      return field.error?.type === 'warning' ? 'bg-yellow-900/10' : 'bg-red-900/10'
    }
    if (showSuccess) return 'bg-green-900/10'
    return 'bg-gray-800/50'
  }

  if (children) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-200">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        {children({
          value: field.value,
          onChange: handleChange,
          onBlur: handleBlur,
          onFocus: handleFocus,
          error: field.error,
          touched: field.touched,
          dirty: field.dirty
        })}
        {renderFeedback()}
      </div>
    )
  }

  function renderFeedback() {
    return (
      <>
        {showHelp && (
          <p className="text-xs text-gray-400 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{helpText}</span>
          </p>
        )}

        {showError && (
          <div
            className={`flex items-start gap-1.5 text-sm animate-in fade-in slide-in-from-top-1 duration-200 ${
              field.error?.type === 'warning' ? 'text-yellow-400' : 'text-red-400'
            }`}
            role="alert"
          >
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              {field.error?.type === 'warning' ? (
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            <span>{field.error?.message}</span>
          </div>
        )}

        {showSuccess && (
          <div className="flex items-start gap-1.5 text-green-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={field.value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`block w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            placeholder-gray-500 focus:outline-none sm:text-sm text-white
            ${getBackgroundColor()} ${getBorderColor()}
            ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            ${className}`}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${name}-error` : showHelp ? `${name}-help` : undefined}
        />

        {showSuccess && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {renderFeedback()}
    </div>
  )
}
