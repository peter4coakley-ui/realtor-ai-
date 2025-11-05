import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button } from '../components/ui/Button'

export function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-white">PropertyLens AI</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/app">
                  <Button>Launch App</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 lg:py-28">
          <div className="text-center">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
              AI-Powered Real Estate
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                Photo Editing Platform
              </span>
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
              Transform property images in seconds with professional AI-powered editing. Virtual staging, sky replacement, object removal, and intelligent enhancements designed specifically for real estate professionals, photographers, and property managers.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <>
                  <Link to="/app">
                    <Button size="lg" className="text-lg px-8 py-4">
                      Launch App
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                      View Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="text-lg px-8 py-4">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-white">
              Everything Real Estate Professionals Need
            </h3>
            <p className="mt-4 text-lg text-gray-300">
              Powerful AI features built specifically for property marketing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-teal-500 transition-all duration-300">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Virtual Staging & Enhancement</h4>
              <p className="text-gray-400 leading-relaxed">
                Add furniture, decor, and lifestyle elements to empty rooms. Our AI creates photorealistic staging that helps buyers visualize the potential of any space.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-teal-500 transition-all duration-300">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Object Removal & Cleanup</h4>
              <p className="text-gray-400 leading-relaxed">
                Remove unwanted items, clutter, power lines, and distractions from your listing photos. Clean up any property image with precision AI editing.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-teal-500 transition-all duration-300">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Sky Replacement & Twilight</h4>
              <p className="text-gray-400 leading-relaxed">
                Replace dull skies with vibrant blue skies or dramatic sunsets. Transform day photos into stunning twilight shots that make properties stand out.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-teal-500 transition-all duration-300">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Batch Processing Power</h4>
              <p className="text-gray-400 leading-relaxed">
                Process entire property listings in minutes. Upload multiple photos and apply consistent edits across all images with lightning-fast AI processing.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-teal-500 transition-all duration-300">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">MLS Compliant Edits</h4>
              <p className="text-gray-400 leading-relaxed">
                All enhancements follow MLS guidelines and real estate photography standards. Professional quality that meets industry compliance requirements.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-teal-500 transition-all duration-300">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Version Control & History</h4>
              <p className="text-gray-400 leading-relaxed">
                Save multiple versions of each edit. Compare before and after, revert changes, and maintain complete control over your editing workflow.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-12 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Property Listings?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of real estate professionals who trust PropertyLens AI to deliver stunning, market-ready photos in seconds.
            </p>
            {!user && (
              <Link to="/signup">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-10 py-4">
                  Start Your Free Trial
                </Button>
              </Link>
            )}
            {user && (
              <Link to="/app">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-10 py-4">
                  Launch App Now
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900/50 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 PropertyLens AI. All rights reserved.</p>
            <p className="mt-2">Professional AI-Powered Real Estate Photo Editing Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
