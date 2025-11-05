import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button } from '../components/ui/Button'
import { EnhancedInput } from '../components/ui/EnhancedInput'
import { PasswordInput } from '../components/ui/PasswordInput'
import { Alert } from '../components/ui/Alert'
import { validateEmail, normalizeEmail } from '../utils/formValidation'

export function Login() {
  const { signIn, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailValid, setEmailValid] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const normalizedEmail = normalizeEmail(email)
    const { error } = await signIn(normalizedEmail, password)

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('The email or password you entered is incorrect. Please try again.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email address before signing in.')
      } else {
        setError(error.message)
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3 justify-center mb-2">
            <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-2xl font-bold text-white">PropertyLens AI</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert type="error">
              {error}
            </Alert>
          )}
          
          <div className="space-y-4">
            <EnhancedInput
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              validate={validateEmail}
              normalize={normalizeEmail}
              onValidationChange={(result) => setEmailValid(result.isValid)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              showStrength={false}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !email || !password}
              className="w-full"
            >
              Sign in
            </Button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-teal-400 hover:text-teal-300">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}