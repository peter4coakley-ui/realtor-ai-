import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
  monthly_edit_limit: number;
  edits_used_this_month: number;
  trial_ends_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  canPerformEdit: () => boolean;
  incrementEditCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName || null,
          subscription_tier: 'free',
          subscription_status: 'trialing',
          monthly_edit_limit: 10,
          edits_used_this_month: 0,
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const canPerformEdit = () => {
    if (!profile) return false;

    if (profile.subscription_tier === 'enterprise') return true;

    if (profile.subscription_status === 'trialing') {
      const trialEnded = profile.trial_ends_at && new Date(profile.trial_ends_at) < new Date();
      if (trialEnded) return false;
    }

    if (profile.subscription_status !== 'active' && profile.subscription_status !== 'trialing') {
      return false;
    }

    return profile.edits_used_this_month < profile.monthly_edit_limit;
  };

  const incrementEditCount = async () => {
    if (!user || !profile) return;

    try {
      const newCount = profile.edits_used_this_month + 1;

      await supabase
        .from('profiles')
        .update({ edits_used_this_month: newCount })
        .eq('id', user.id);

      await supabase.from('usage_logs').insert({
        user_id: user.id,
        action_type: 'edit',
        credits_used: 1,
      });

      setProfile(prev => prev ? { ...prev, edits_used_this_month: newCount } : null);
    } catch (error) {
      console.error('Error incrementing edit count:', error);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    canPerformEdit,
    incrementEditCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
