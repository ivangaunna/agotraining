export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'user' | 'admin'
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          benefits: string[]
          price: number
          original_price: number | null
          currency: string
          goal: 'fat_loss' | 'hypertrophy' | 'body_recomposition' | 'all'
          location: 'gym' | 'home' | 'both'
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          benefits?: string[]
          price: number
          original_price?: number | null
          currency?: string
          goal: 'fat_loss' | 'hypertrophy' | 'body_recomposition' | 'all'
          location?: 'gym' | 'home' | 'both'
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          benefits?: string[]
          price?: number
          original_price?: number | null
          currency?: string
          goal?: 'fat_loss' | 'hypertrophy' | 'body_recomposition' | 'all'
          location?: 'gym' | 'home' | 'both'
          is_active?: boolean
          display_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      plan_files: {
        Row: {
          id: string
          plan_id: string
          storage_path: string
          file_name: string
          file_size: number | null
          version: number
          is_current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          storage_path: string
          file_name: string
          file_size?: number | null
          version?: number
          is_current?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          storage_path?: string
          file_name?: string
          file_size?: number | null
          version?: number
          is_current?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'plan_files_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'plans'
            referencedColumns: ['id']
          }
        ]
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          amount: number
          currency: string
          status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'
          mercadopago_payment_id: string | null
          mercadopago_preference_id: string | null
          email_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          amount: number
          currency?: string
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'
          mercadopago_payment_id?: string | null
          mercadopago_preference_id?: string | null
          email_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'
          mercadopago_payment_id?: string | null
          mercadopago_preference_id?: string | null
          email_sent?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'purchases_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'plans'
            referencedColumns: ['id']
          }
        ]
      }
      payment_logs: {
        Row: {
          id: string
          purchase_id: string | null
          event_type: string
          mp_payment_id: string | null
          payload: Json
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          purchase_id?: string | null
          event_type: string
          mp_payment_id?: string | null
          payload: Json
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          purchase_id?: string | null
          event_type?: string
          mp_payment_id?: string | null
          payload?: Json
          ip_address?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Plan = Database['public']['Tables']['plans']['Row']
export type PlanFile = Database['public']['Tables']['plan_files']['Row']
export type Purchase = Database['public']['Tables']['purchases']['Row']
export type PaymentLog = Database['public']['Tables']['payment_logs']['Row']

export type PurchaseStatus = Purchase['status']
export type PlanGoal = Plan['goal']
export type UserRole = Profile['role']
