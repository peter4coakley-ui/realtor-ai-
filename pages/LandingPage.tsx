import React from 'react';
import { APP_NAME, APP_TAGLINE } from '../theme';
import { Button } from '../components/ui/Button';
import { CheckIcon, SparklesIcon, VirtualStagingIcon, TwilightIcon, ExteriorBoostIcon } from '../components/icons';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PropertyLens AI",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "USD",
              "lowPrice": "0",
              "highPrice": "99",
            },
            "description": "Professional AI-powered real estate photo editing platform for virtual staging and enhancements"
          })
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900">
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-8 h-8 text-teal-400" />
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onSignIn} className="text-gray-300 hover:text-white">
                Sign In
              </Button>
              <Button onClick={onGetStarted} className="bg-teal-500 hover:bg-teal-600 text-white">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your Listings<br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                With AI-Powered Editing
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional real estate photo editing in seconds. Virtual staging, twilight conversions, and MLS-compliant enhancements for realtors and photographers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={onGetStarted} className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8 py-6">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={onSignIn} className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 text-lg px-8 py-6">
                Sign In
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-400">7-day free trial • No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Sell Faster
            </h2>
            <p className="text-lg text-gray-400">Powerful AI tools designed specifically for real estate professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <VirtualStagingIcon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Virtual Staging</h3>
              <p className="text-gray-400">
                Instantly clear rooms and add professional furnishings. Show buyers the full potential of empty spaces.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <TwilightIcon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Twilight Conversions</h3>
              <p className="text-gray-400">
                Transform daytime photos into stunning twilight shots that make listings stand out and sell faster.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <ExteriorBoostIcon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Sky & Lawn Enhancement</h3>
              <p className="text-gray-400">
                Perfect blue skies and lush green lawns with one click. Enhance curb appeal automatically.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Chat Editing</h3>
              <p className="text-gray-400">
                Just describe what you want. Our AI understands natural language and delivers professional results.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <CheckIcon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">MLS Compliant</h3>
              <p className="text-gray-400">
                All edits follow NAR and MLS guidelines. Never alter property structure or hide significant flaws.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400">
                Edit multiple photos in seconds. Batch processing for entire properties. Download and share instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-400">Choose the plan that fits your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  10 edits per month
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  All editing presets
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  AI chat editing
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  HD downloads
                </li>
              </ul>
              <Button onClick={onGetStarted} variant="outline" className="w-full border-gray-600 text-gray-300 hover:border-teal-500 hover:text-white">
                Start Free
              </Button>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-8 border-2 border-teal-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-teal-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  200 edits per month
                </li>
                <li className="flex items-center text-white">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  All editing presets
                </li>
                <li className="flex items-center text-white">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Advanced AI features
                </li>
                <li className="flex items-center text-white">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Batch processing
                </li>
                <li className="flex items-center text-white">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Priority support
                </li>
              </ul>
              <Button onClick={onGetStarted} className="w-full bg-white text-teal-600 hover:bg-gray-100">
                Start Pro Trial
              </Button>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  Unlimited edits
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  Team collaboration
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  API access
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  White-label options
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  Dedicated support
                </li>
              </ul>
              <Button onClick={onGetStarted} variant="outline" className="w-full border-gray-600 text-gray-300 hover:border-teal-500 hover:text-white">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Listings?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of real estate professionals using AI to close deals faster
          </p>
          <Button size="lg" onClick={onGetStarted} className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-12 py-6">
            Start Your Free Trial
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <SparklesIcon className="w-6 h-6 text-teal-400" />
              <span className="text-white font-semibold">{APP_NAME}</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default LandingPage;
