import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          company_name: string | null;
          phone: string | null;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          trial_ends_at: string | null;
          subscription_ends_at: string | null;
          monthly_edit_limit: number;
          edits_used_this_month: number;
          edits_reset_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company_name?: string | null;
          phone?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          trial_ends_at?: string | null;
          subscription_ends_at?: string | null;
          monthly_edit_limit?: number;
          edits_used_this_month?: number;
          edits_reset_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company_name?: string | null;
          phone?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          trial_ends_at?: string | null;
          subscription_ends_at?: string | null;
          monthly_edit_limit?: number;
          edits_used_this_month?: number;
          edits_reset_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          user_id: string;
          address: string;
          description: string | null;
          property_type: 'residential' | 'commercial' | 'land' | 'other';
          status: 'active' | 'archived';
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
      };
      image_projects: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          original_file_name: string | null;
          original_storage_path: string | null;
          room_type: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
      };
      image_versions: {
        Row: {
          id: string;
          image_project_id: string;
          storage_path: string;
          prompt: string | null;
          version_type: 'original' | 'preset' | 'chat' | 'inpaint';
          is_saved: boolean;
          created_at: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          image_project_id: string;
          role: 'user' | 'assistant';
          content: string;
          image_version_id: string | null;
          created_at: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          action_type: 'edit' | 'upload' | 'export' | 'delete';
          image_version_id: string | null;
          credits_used: number;
          metadata: Record<string, any>;
          created_at: string;
        };
      };
    };
  };
};
