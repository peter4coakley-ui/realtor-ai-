import { useState, useEffect } from 'react'
import { getUserCredits, useCredits as useCreditsService, UserCredits } from '../lib/credits'

export function useCredits() {
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [loading, setLoading] = useState(true)

  const loadCredits = async () => {
    setLoading(true)
    const data = await getUserCredits()
    setCredits(data)
    setLoading(false)
  }

  useEffect(() => {
    loadCredits()
  }, [])

  const consumeCredits = async (amount: number, description: string): Promise<boolean> => {
    const success = await useCreditsService(amount, description)
    if (success) {
      await loadCredits()
    }
    return success
  }

  const refresh = () => {
    loadCredits()
  }

  return {
    credits,
    loading,
    consumeCredits,
    refresh,
  }
}
