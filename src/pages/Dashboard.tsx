import React, { useEffect, useState } from 'react'
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

export function Dashboard() {
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
          cancel_url: `${window.location.origin}/dashboard`,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>

          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Current Subscription */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
            {currentPlan ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{currentPlan.name}</h3>
                  <p className="text-gray-600">{currentPlan.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(currentPlan.price, currentPlan.currency)}/month
                  </p>
                  {subscription?.current_period_end && (
                    <p className="text-sm text-gray-500">
                      {subscription.cancel_at_period_end ? 'Cancels' : 'Renews'} on{' '}
                      {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {subscription?.subscription_status === 'active' ? 'Active' : subscription?.subscription_status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No active subscription</p>
            )}
          </div>

          {/* Available Plans */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stripeProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    {currentPlan?.id === product.id && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price, product.currency)}
                      <span className="text-sm font-normal text-gray-500">
                        /{product.mode === 'subscription' ? 'month' : 'one-time'}
                      </span>
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