import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface FieldError {
  message: string
  type: 'error' | 'warning'
}

export interface FormState {
  [fieldName: string]: {
    value: any
    error?: FieldError
    touched: boolean
    dirty: boolean
  }
}

interface FormValidationContextType {
  fields: FormState
  setFieldValue: (name: string, value: any) => void
  setFieldError: (name: string, error: FieldError | null) => void
  setFieldTouched: (name: string, touched: boolean) => void
  validateField: (name: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  resetForm: () => void
  isSubmitting: boolean
  setIsSubmitting: (submitting: boolean) => void
  submitCount: number
  incrementSubmitCount: () => void
  registerValidator: (name: string, validator: (value: any) => Promise<FieldError | null>) => void
}

const FormValidationContext = createContext<FormValidationContextType | undefined>(undefined)

interface FormValidationProviderProps {
  children: ReactNode
  initialValues?: { [key: string]: any }
  onSubmit?: (values: { [key: string]: any }) => Promise<void>
}

export function FormValidationProvider({ children, initialValues = {} }: FormValidationProviderProps) {
  const [fields, setFields] = useState<FormState>(() => {
    const initial: FormState = {}
    Object.keys(initialValues).forEach(key => {
      initial[key] = {
        value: initialValues[key],
        touched: false,
        dirty: false
      }
    })
    return initial
  })

  const [validators, setValidators] = useState<{
    [name: string]: (value: any) => Promise<FieldError | null>
  }>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)

  const setFieldValue = useCallback((name: string, value: any) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        dirty: true
      }
    }))
  }, [])

  const setFieldError = useCallback((name: string, error: FieldError | null) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error: error || undefined
      }
    }))
  }, [])

  const setFieldTouched = useCallback((name: string, touched: boolean) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched
      }
    }))
  }, [])

  const registerValidator = useCallback((name: string, validator: (value: any) => Promise<FieldError | null>) => {
    setValidators(prev => ({
      ...prev,
      [name]: validator
    }))
  }, [])

  const validateField = useCallback(async (name: string): Promise<boolean> => {
    const validator = validators[name]
    if (!validator) return true

    const field = fields[name]
    const error = await validator(field?.value)

    setFieldError(name, error)
    return error === null
  }, [fields, validators, setFieldError])

  const validateForm = useCallback(async (): Promise<boolean> => {
    const fieldNames = Object.keys(validators)
    const results = await Promise.all(
      fieldNames.map(name => validateField(name))
    )

    return results.every(result => result === true)
  }, [validators, validateField])

  const resetForm = useCallback(() => {
    setFields(prev => {
      const reset: FormState = {}
      Object.keys(prev).forEach(key => {
        reset[key] = {
          value: initialValues[key] || '',
          touched: false,
          dirty: false
        }
      })
      return reset
    })
    setIsSubmitting(false)
    setSubmitCount(0)
  }, [initialValues])

  const incrementSubmitCount = useCallback(() => {
    setSubmitCount(prev => prev + 1)
  }, [])

  return (
    <FormValidationContext.Provider
      value={{
        fields,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        validateField,
        validateForm,
        resetForm,
        isSubmitting,
        setIsSubmitting,
        submitCount,
        incrementSubmitCount,
        registerValidator
      }}
    >
      {children}
    </FormValidationContext.Provider>
  )
}

export function useFormValidation() {
  const context = useContext(FormValidationContext)
  if (!context) {
    throw new Error('useFormValidation must be used within FormValidationProvider')
  }
  return context
}
