import { supabase } from './supabase'

export interface UserCredits {
  user_id: string
  credits: number
  total_used: number
  created_at: string
  updated_at: string
}

export interface CreditTransaction {
  id: number
  user_id: string
  amount: number
  transaction_type: 'signup_bonus' | 'purchase' | 'refund' | 'ai_edit' | 'admin_adjustment'
  description: string | null
  created_at: string
}

export async function getUserCredits(): Promise<UserCredits | null> {
  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('Error fetching credits:', error)
    return null
  }

  return data
}

export async function useCredits(amount: number, description: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('use_credits', {
    credit_amount: amount,
    operation_description: description,
  })

  if (error) {
    console.error('Error using credits:', error)
    return false
  }

  return data === true
}

export async function getCreditTransactions(limit: number = 50): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data || []
}

export const CREDIT_COSTS = {
  AI_EDIT: 1,
  VIRTUAL_STAGING: 2,
  SKY_REPLACEMENT: 1,
  OBJECT_REMOVAL: 1,
  BATCH_EDIT: 1,
} as const
