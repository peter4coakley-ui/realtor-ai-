export interface ValidationResult {
  isValid: boolean
  error?: string
  warning?: string
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  feedback: string
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'green'
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
}

export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim().toLowerCase()

  if (!trimmed) {
    return { isValid: false }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    }
  }

  const commonTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
  }

  const domain = trimmed.split('@')[1]
  if (commonTypos[domain]) {
    return {
      isValid: true,
      warning: `Did you mean ${trimmed.replace(domain, commonTypos[domain])}?`
    }
  }

  return { isValid: true }
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      feedback: 'Enter a password',
      color: 'red',
      label: 'Very Weak'
    }
  }

  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) score++
  else feedback.push('Use at least 8 characters')

  if (password.length >= 12) score++

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  else feedback.push('Mix uppercase and lowercase letters')

  if (/\d/.test(password)) score++
  else feedback.push('Add numbers')

  if (/[^a-zA-Z0-9]/.test(password)) score++
  else feedback.push('Add special characters (!@#$%)')

  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123', 'monkey',
    'letmein', 'password1', '123456789', 'welcome'
  ]

  if (commonPasswords.includes(password.toLowerCase())) {
    return {
      score: 0,
      feedback: 'This password is too common. Please choose something unique.',
      color: 'red',
      label: 'Very Weak'
    }
  }

  const labels: PasswordStrength['label'][] = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors: PasswordStrength['color'][] = ['red', 'orange', 'yellow', 'blue', 'green']

  return {
    score: score as PasswordStrength['score'],
    feedback: feedback.length > 0 ? feedback[0] : 'Strong password!',
    color: colors[score],
    label: labels[score]
  }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false }
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters'
    }
  }

  const strength = calculatePasswordStrength(password)

  if (strength.score < 2) {
    return {
      isValid: true,
      warning: strength.feedback
    }
  }

  return { isValid: true }
}

export const validateUrl = (url: string): ValidationResult => {
  const trimmed = url.trim()

  if (!trimmed) {
    return { isValid: false }
  }

  let urlToValidate = trimmed
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    urlToValidate = 'https://' + trimmed
  }

  try {
    const parsed = new URL(urlToValidate)

    if (!parsed.protocol.startsWith('http')) {
      return {
        isValid: false,
        error: 'URL must start with http:// or https://'
      }
    }

    return { isValid: true }
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL'
    }
  }
}

export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

export const normalizeUrl = (url: string): string => {
  const trimmed = url.trim()
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return 'https://' + trimmed
  }
  return trimmed
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
