import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useNavigation } from '../contexts/NavigationContext'
import { UserProfileMenu } from './UserProfileMenu'
import { Button } from './ui/Button'

interface AppNavProps {
  showActions?: boolean
}

export function AppNav({ showActions = true }: AppNavProps) {
  const { user } = useAuth()
  const { setIsMobileMenuOpen, pageTitle } = useNavigation()
  const location = useLocation()

  const isLanding = location.pathname === '/'

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-700 bg-gray-900/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Link to={user ? '/app' : '/'} className="flex items-center gap-3 group">
            <svg
              className="w-8 h-8 text-teal-400 group-hover:text-teal-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <span className="text-xl font-bold text-white hidden sm:block">PropertyLens AI</span>
          </Link>

          {pageTitle && (
            <>
              <div className="hidden md:block w-px h-6 bg-gray-700" />
              <h1 className="hidden md:block text-sm font-medium text-gray-300">{pageTitle}</h1>
            </>
          )}
        </div>

        <nav className="flex items-center gap-2 lg:gap-3">
          {user && showActions ? (
            <>
              <Link to="/app" className="hidden lg:block">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </Button>
              </Link>

              <div className="hidden lg:flex">
                <UserProfileMenu />
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          ) : !user && isLanding ? (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="sm:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
