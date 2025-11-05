import { FieldError } from '../contexts/FormValidationContext'
import { validateEmail as baseValidateEmail, validatePassword as baseValidatePassword } from './formValidation'

export type ValidationRule = (value: any) => Promise<FieldError | null>

export const required = (message: string = 'This field is required'): ValidationRule => {
  return async (value: any) => {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return { message, type: 'error' }
    }
    return null
  }
}

export const minLength = (min: number, message?: string): ValidationRule => {
  return async (value: any) => {
    if (value && value.length < min) {
      return {
        message: message || `Must be at least ${min} characters`,
        type: 'error'
      }
    }
    return null
  }
}

export const maxLength = (max: number, message?: string): ValidationRule => {
  return async (value: any) => {
    if (value && value.length > max) {
      return {
        message: message || `Must be no more than ${max} characters`,
        type: 'error'
      }
    }
    return null
  }
}

export const pattern = (regex: RegExp, message: string): ValidationRule => {
  return async (value: any) => {
    if (value && !regex.test(value)) {
      return { message, type: 'error' }
    }
    return null
  }
}

export const email = (message: string = 'Please enter a valid email address'): ValidationRule => {
  return async (value: any) => {
    if (!value) return null

    const result = baseValidateEmail(value)
    if (!result.isValid) {
      return { message: result.error || message, type: 'error' }
    }
    if (result.warning) {
      return { message: result.warning, type: 'warning' }
    }
    return null
  }
}

export const password = (): ValidationRule => {
  return async (value: any) => {
    if (!value) return null

    const result = baseValidatePassword(value)
    if (!result.isValid) {
      return { message: result.error || 'Invalid password', type: 'error' }
    }
    if (result.warning) {
      return { message: result.warning, type: 'warning' }
    }
    return null
  }
}

export const matches = (fieldName: string, getFieldValue: (name: string) => any, message?: string): ValidationRule => {
  return async (value: any) => {
    const otherValue = getFieldValue(fieldName)
    if (value && otherValue && value !== otherValue) {
      return {
        message: message || `Must match ${fieldName}`,
        type: 'error'
      }
    }
    return null
  }
}

export const url = (message: string = 'Please enter a valid URL'): ValidationRule => {
  return async (value: any) => {
    if (!value) return null

    try {
      const urlValue = value.startsWith('http://') || value.startsWith('https://')
        ? value
        : `https://${value}`
      new URL(urlValue)
      return null
    } catch {
      return { message, type: 'error' }
    }
  }
}

export const number = (message: string = 'Must be a valid number'): ValidationRule => {
  return async (value: any) => {
    if (value === '' || value === null || value === undefined) return null
    if (isNaN(Number(value))) {
      return { message, type: 'error' }
    }
    return null
  }
}

export const min = (minValue: number, message?: string): ValidationRule => {
  return async (value: any) => {
    if (value !== '' && value !== null && value !== undefined) {
      const num = Number(value)
      if (!isNaN(num) && num < minValue) {
        return {
          message: message || `Must be at least ${minValue}`,
          type: 'error'
        }
      }
    }
    return null
  }
}

export const max = (maxValue: number, message?: string): ValidationRule => {
  return async (value: any) => {
    if (value !== '' && value !== null && value !== undefined) {
      const num = Number(value)
      if (!isNaN(num) && num > maxValue) {
        return {
          message: message || `Must be no more than ${maxValue}`,
          type: 'error'
        }
      }
    }
    return null
  }
}

export const between = (minValue: number, maxValue: number, message?: string): ValidationRule => {
  return async (value: any) => {
    if (value !== '' && value !== null && value !== undefined) {
      const num = Number(value)
      if (!isNaN(num) && (num < minValue || num > maxValue)) {
        return {
          message: message || `Must be between ${minValue} and ${maxValue}`,
          type: 'error'
        }
      }
    }
    return null
  }
}

export const oneOf = (options: any[], message?: string): ValidationRule => {
  return async (value: any) => {
    if (value && !options.includes(value)) {
      return {
        message: message || `Must be one of: ${options.join(', ')}`,
        type: 'error'
      }
    }
    return null
  }
}

export const custom = (validator: (value: any) => boolean | Promise<boolean>, message: string): ValidationRule => {
  return async (value: any) => {
    const isValid = await validator(value)
    if (!isValid) {
      return { message, type: 'error' }
    }
    return null
  }
}

export const compose = (...validators: ValidationRule[]): ValidationRule => {
  return async (value: any) => {
    for (const validator of validators) {
      const error = await validator(value)
      if (error) {
        return error
      }
    }
    return null
  }
}

export const when = (
  condition: (value: any) => boolean,
  thenValidator: ValidationRule,
  elseValidator?: ValidationRule
): ValidationRule => {
  return async (value: any) => {
    if (condition(value)) {
      return thenValidator(value)
    } else if (elseValidator) {
      return elseValidator(value)
    }
    return null
  }
}

export const asyncValidation = (
  validator: (value: any) => Promise<boolean>,
  message: string,
  debounceMs: number = 500
): ValidationRule => {
  let timeoutId: NodeJS.Timeout

  return async (value: any) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        const isValid = await validator(value)
        if (!isValid) {
          resolve({ message, type: 'error' })
        } else {
          resolve(null)
        }
      }, debounceMs)
    })
  }
}

export const checkUsernameAvailable = (message: string = 'This username is already taken'): ValidationRule => {
  return asyncValidation(
    async (username: string) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const taken = ['admin', 'user', 'test', 'demo']
      return !taken.includes(username.toLowerCase())
    },
    message,
    800
  )
}

export const checkEmailAvailable = (message: string = 'This email is already registered'): ValidationRule => {
  return asyncValidation(
    async (email: string) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    },
    message,
    800
  )
}
