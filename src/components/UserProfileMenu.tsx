import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { getUserCredits, UserCredits } from '../lib/credits'
import { Button } from './ui/Button'

export function UserProfileMenu() {
  const { user, signOut } = useAuth()
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCredits()
  }, [])

  const loadCredits = async () => {
    setLoading(true)
    const data = await getUserCredits()
    setCredits(data)
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-teal-500 transition-all"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {loading ? (
            <span className="text-sm text-gray-300">Loading...</span>
          ) : (
            <span className="text-sm font-semibold text-white">
              {credits?.credits || 0} credits
            </span>
          )}
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">PropertyLens AI User</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Available Credits</span>
                <span className="text-2xl font-bold text-white">{credits?.credits || 0}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Total used: {credits?.total_used || 0} credits
              </div>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <Button className="w-full" size="sm">
                  Buy More Credits
                </Button>
              </Link>
            </div>

            <div className="p-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Billing & Plans
                </div>
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false)
                  signOut()
                }}
                className="w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
