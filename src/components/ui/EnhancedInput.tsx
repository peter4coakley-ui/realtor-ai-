import React, { useState, useEffect } from 'react'
import { debounce, ValidationResult } from '../../utils/formValidation'

interface EnhancedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  warning?: string
  showSuccess?: boolean
  validate?: (value: string) => ValidationResult
  normalize?: (value: string) => string
  onChange: (value: string) => void
  onValidationChange?: (result: ValidationResult) => void
  validateOnBlur?: boolean
  validateOnChange?: boolean
  helperText?: string
}

export function EnhancedInput({
  label,
  error: externalError,
  warning: externalWarning,
  showSuccess = true,
  validate,
  normalize,
  onChange,
  onValidationChange,
  validateOnBlur = true,
  validateOnChange = true,
  helperText,
  className = '',
  value,
  type = 'text',
  ...props
}: EnhancedInputProps) {
  const [internalValue, setInternalValue] = useState(value || '')
  const [touched, setTouched] = useState(false)
  const [focused, setFocused] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true })

  const debouncedValidate = React.useMemo(
    () =>
      validate
        ? debounce((val: string) => {
            const result = validate(val)
            setValidationResult(result)
            onValidationChange?.(result)
          }, 300)
        : null,
    [validate, onValidationChange]
  )

  useEffect(() => {
    setInternalValue(value || '')
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    if (normalize) {
      newValue = normalize(newValue)
    }

    setInternalValue(newValue)
    onChange(newValue)

    if (validateOnChange && validate && touched) {
      debouncedValidate?.(newValue)
    }
  }

  const handleBlur = () => {
    setTouched(true)
    setFocused(false)

    if (validateOnBlur && validate) {
      const result = validate(String(internalValue))
      setValidationResult(result)
      onValidationChange?.(result)
    }
  }

  const handleFocus = () => {
    setFocused(true)
  }

  const displayError = externalError || (touched && !focused && validationResult.error)
  const displayWarning = externalWarning || (touched && !focused && validationResult.warning)
  const isValid = !displayError && validationResult.isValid && touched && internalValue

  const getBorderColor = () => {
    if (displayError) return 'border-red-500 focus:ring-red-500 focus:border-red-500'
    if (displayWarning) return 'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500'
    if (isValid && showSuccess) return 'border-green-500 focus:ring-green-500 focus:border-green-500'
    return 'border-gray-600 focus:ring-teal-500 focus:border-teal-500'
  }

  const getBackgroundColor = () => {
    if (displayError) return 'bg-red-900/10'
    if (displayWarning) return 'bg-yellow-900/10'
    if (isValid && showSuccess) return 'bg-green-900/10'
    return 'bg-gray-800/50'
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`block w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            placeholder-gray-500 focus:outline-none sm:text-sm
            ${getBackgroundColor()} ${getBorderColor()} text-white
            ${className}`}
          {...props}
        />

        {isValid && showSuccess && (
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

      {helperText && !displayError && !displayWarning && (
        <p className="text-xs text-gray-400">{helperText}</p>
      )}

      {displayError && (
        <div className="flex items-start gap-1.5 text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      {displayWarning && !displayError && (
        <div className="flex items-start gap-1.5 text-yellow-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{displayWarning}</span>
        </div>
      )}
    </div>
  )
}
