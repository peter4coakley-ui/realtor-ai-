import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { stripeProducts, formatPrice, getProductByPriceId } from '../stripe-config'

interface Subscription {
  subscription_status: string
  price_id: string | null
  current_period_end: number | null
  cancel_at_period_end: boolean
}

export function Settings() {
  const { user, signOut } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id, current_period_end, cancel_at_period_end')
        .maybeSingle()

      if (error) {
        console.error('Error fetching subscription:', error)
        setError('Failed to load subscription data')
      } else {
        setSubscription(data)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (priceId: string, mode: 'subscription' | 'payment') => {
    setCheckoutLoading(priceId)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('Please sign in to continue')
        return
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/settings`,
          mode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Failed to start checkout process')
    } finally {
      setCheckoutLoading(null)
    }
  }

  const getCurrentPlan = () => {
    if (!subscription?.price_id) return null
    return getProductByPriceId(subscription.price_id)
  }

  const currentPlan = getCurrentPlan()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="text-2xl font-bold text-white">PropertyLens AI</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Account Settings</h1>
              <p className="text-gray-300">Welcome back, {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/app">
                <Button>Launch App</Button>
              </Link>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Current Subscription */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Current Plan</h2>
            {currentPlan ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{currentPlan.name}</h3>
                  <p className="text-gray-300">{currentPlan.description}</p>
                  <p className="text-sm text-gray-400">
                    {formatPrice(currentPlan.price, currentPlan.currency)}/month
                  </p>
                  {subscription?.current_period_end && (
                    <p className="text-sm text-gray-400">
                      {subscription.cancel_at_period_end ? 'Cancels' : 'Renews'} on{' '}
                      {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    {subscription?.subscription_status === 'active' ? 'Active' : subscription?.subscription_status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-300">No active subscription</p>
            )}
          </div>

          {/* Buy Credits */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow rounded-2xl p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Buy Credits</h2>
              <p className="text-sm text-gray-400 mt-1">One-time purchase • No subscription required</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stripeProducts.filter(p => p.mode === 'payment').map((product) => (
                <div key={product.id} className="border border-gray-700 rounded-2xl p-6 hover:border-teal-500 transition-all relative">
                  {product.id === 'prod_professional' && (
                    <span className="absolute -top-3 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-500 text-white">
                      Most Popular
                    </span>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-400">{product.description}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">one-time</span>
                  </div>
                  <Button
                    onClick={() => handleCheckout(product.priceId, product.mode)}
                    loading={checkoutLoading === product.priceId}
                    className="w-full"
                  >
                    Buy Now
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Subscriptions */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Monthly Subscriptions</h2>
              <p className="text-sm text-gray-400 mt-1">Automatic monthly credits • Cancel anytime</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stripeProducts.filter(p => p.mode === 'subscription').map((product) => (
                <div key={product.id} className="border border-gray-700 rounded-2xl p-6 hover:border-teal-500 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">{product.name}</h3>
                    {currentPlan?.id === product.id && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(product.price, product.currency)}
                      <span className="text-sm font-normal text-gray-400">/month</span>
                    </span>
                    <Button
                      onClick={() => handleCheckout(product.priceId, product.mode)}
                      loading={checkoutLoading === product.priceId}
                      disabled={currentPlan?.id === product.id}
                    >
                      {currentPlan?.id === product.id ? 'Current Plan' : 'Subscribe'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}