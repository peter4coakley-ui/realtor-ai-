import React, { useState, useEffect } from 'react'
import { calculatePasswordStrength, PasswordStrength, debounce } from '../../utils/formValidation'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label?: string
  value: string
  onChange: (value: string) => void
  showStrength?: boolean
  showRequirements?: boolean
  error?: string
  helperText?: string
}

export function PasswordInput({
  label = 'Password',
  value,
  onChange,
  showStrength = true,
  showRequirements = false,
  error,
  helperText,
  className = '',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)
  const [strength, setStrength] = useState<PasswordStrength>(calculatePasswordStrength(''))

  const debouncedCalculateStrength = React.useMemo(
    () =>
      debounce((password: string) => {
        setStrength(calculatePasswordStrength(password))
      }, 150),
    []
  )

  useEffect(() => {
    if (value) {
      debouncedCalculateStrength(value)
    } else {
      setStrength(calculatePasswordStrength(''))
    }
  }, [value, debouncedCalculateStrength])

  const requirements = [
    { met: value.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(value) && /[a-z]/.test(value), text: 'Upper and lowercase letters' },
    { met: /\d/.test(value), text: 'At least one number' },
    { met: /[^a-zA-Z0-9]/.test(value), text: 'At least one special character' },
  ]

  const getStrengthColor = () => {
    const colors = {
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
    }
    return colors[strength.color]
  }

  const getStrengthWidth = () => {
    return `${(strength.score / 4) * 100}%`
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`block w-full px-4 py-2.5 pr-12 rounded-lg border transition-all duration-200
            placeholder-gray-500 focus:outline-none sm:text-sm
            bg-gray-800/50 text-white
            ${
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-600 focus:ring-teal-500 focus:border-teal-500'
            }
            ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>

      {showStrength && value && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Password strength:</span>
            <span className={`font-medium text-${strength.color}-400`}>{strength.label}</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: getStrengthWidth() }}
            />
          </div>
          {strength.score < 4 && (
            <p className="text-xs text-gray-400">{strength.feedback}</p>
          )}
        </div>
      )}

      {showRequirements && (focused || value) && (
        <div className="space-y-1.5 p-3 bg-gray-800/50 border border-gray-700 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-xs font-medium text-gray-300 mb-2">Password requirements:</p>
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {req.met ? (
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className={req.met ? 'text-gray-300' : 'text-gray-500'}>{req.text}</span>
            </div>
          ))}
        </div>
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-400">{helperText}</p>
      )}

      {error && (
        <div className="flex items-start gap-1.5 text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
