import React, { useState } from 'react'
import { FormValidationProvider, useFormValidation } from '../contexts/FormValidationContext'
import { FormField } from './ui/FormField'
import { FormErrorSummary } from './ui/FormErrorSummary'
import { SuccessConfirmation } from './ui/SuccessConfirmation'
import { Button } from './ui/Button'
import { required, email, minLength, maxLength, compose } from '../utils/formValidationPatterns'

function ContactFormContent() {
  const { validateForm, isSubmitting, setIsSubmitting, incrementSubmitCount, resetForm, fields } = useFormValidation()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    incrementSubmitCount()

    const isValid = await validateForm()

    if (!isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Form submitted:', {
        name: fields.name?.value,
        email: fields.email?.value,
        subject: fields.subject?.value,
        message: fields.message?.value
      })

      setShowSuccess(true)
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    resetForm()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6" noValidate>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Contact Us</h2>
            <p className="text-gray-400">We'll get back to you within 24 hours</p>
          </div>

          <FormErrorSummary
            title="Please fix these issues before submitting:"
            fieldLabels={{
              name: 'Full Name',
              email: 'Email Address',
              subject: 'Subject',
              message: 'Message'
            }}
          />

          <FormField
            name="name"
            label="Full Name"
            type="text"
            required
            autoComplete="name"
            placeholder="John Doe"
            validate={compose(
              required('Please enter your name'),
              minLength(2, 'Name must be at least 2 characters'),
              maxLength(50, 'Name is too long')
            )}
            validateOnChange={true}
            validateOnBlur={true}
            helpText="Enter your first and last name"
            successMessage="Looks good!"
          />

          <FormField
            name="email"
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            placeholder="john@example.com"
            validate={compose(
              required('Please enter your email'),
              email()
            )}
            validateOnChange={true}
            validateOnBlur={true}
            helpText="We'll never share your email with anyone"
            successMessage="Valid email address"
          />

          <FormField
            name="subject"
            label="Subject"
            type="text"
            required
            placeholder="What's this about?"
            validate={compose(
              required('Please enter a subject'),
              minLength(5, 'Subject must be at least 5 characters'),
              maxLength(100, 'Subject is too long')
            )}
            validateOnChange={true}
            validateOnBlur={true}
            helpText="Brief description of your inquiry"
            successMessage="Great subject line!"
          />

          <FormField name="message" label="Message" required>
            {({ value, onChange, onBlur, onFocus, error, touched }) => (
              <>
                <textarea
                  id="message"
                  name="message"
                  value={value}
                  onChange={(e) => onChange({ target: { value: e.target.value } } as any)}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                  className={`block w-full px-4 py-2.5 rounded-lg border transition-all duration-200
                    placeholder-gray-500 focus:outline-none sm:text-sm text-white resize-none
                    ${
                      error && touched
                        ? 'border-red-500 bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                        : !error && touched && value
                        ? 'border-green-500 bg-green-900/10 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-600 bg-gray-800/50 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  aria-invalid={error && touched ? 'true' : 'false'}
                />

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    {value?.length || 0} / 500 characters
                  </p>
                  {value?.length > 500 && (
                    <p className="text-xs text-red-400">Message is too long</p>
                  )}
                </div>
              </>
            )}
          </FormField>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => resetForm()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              Clear Form
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            By submitting this form, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </form>

      {showSuccess && (
        <SuccessConfirmation
          title="Message Sent!"
          message="Thank you for contacting us. We'll get back to you within 24 hours."
          icon="check"
          actions={[
            {
              label: 'Send Another',
              onClick: handleSuccessClose,
              variant: 'primary'
            }
          ]}
          autoClose={false}
        />
      )}
    </>
  )
}

export function ExampleContactForm() {
  return (
    <FormValidationProvider
      initialValues={{
        name: '',
        email: '',
        subject: '',
        message: ''
      }}
    >
      <ContactFormContent />
    </FormValidationProvider>
  )
}
