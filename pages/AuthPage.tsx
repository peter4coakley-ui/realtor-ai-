import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { APP_NAME } from '../theme';
import { SparklesIcon } from '../components/icons';

interface AuthPageProps {
  onBack: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, initialMode = 'signin' }) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        setMessage('Account created successfully! You can now sign in.');
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMessage('Password reset link sent to your email!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <SparklesIcon className="w-10 h-10 text-teal-400" />
              <span className="text-2xl font-bold text-white">{APP_NAME}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <p className="text-gray-400 mt-2">
              {mode === 'signin' && 'Sign in to continue editing'}
              {mode === 'signup' && 'Start your 7-day free trial'}
              {mode === 'reset' && 'Enter your email to reset password'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 bg-teal-900/50 border border-teal-500 rounded-lg text-teal-200 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required={mode === 'signup'}
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            {mode === 'signin' && (
              <>
                <div className="text-center">
                  <button
                    onClick={() => setMode('reset')}
                    className="text-sm text-teal-400 hover:text-teal-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-teal-400 hover:text-teal-300 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-teal-400 hover:text-teal-300 font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div className="mt-4 text-center text-sm text-gray-400">
                Remember your password?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-teal-400 hover:text-teal-300 font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              ← Back to home
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
