export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          assigned_to: string | null
          business_id: string
          completed_at: string | null
          created_at: string
          customer_id: string
          customer_status: string | null
          duration_minutes: number | null
          followup_sent_at: string | null
          id: string
          lead_source: string | null
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          public_token: string | null
          reminder_sent_at: string | null
          review_completed_at: string | null
          review_requested_at: string | null
          scheduled_at: string
          service_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          business_id: string
          completed_at?: string | null
          created_at?: string
          customer_id: string
          customer_status?: string | null
          duration_minutes?: number | null
          followup_sent_at?: string | null
          id?: string
          lead_source?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          public_token?: string | null
          reminder_sent_at?: string | null
          review_completed_at?: string | null
          review_requested_at?: string | null
          scheduled_at: string
          service_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          business_id?: string
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          customer_status?: string | null
          duration_minutes?: number | null
          followup_sent_at?: string | null
          id?: string
          lead_source?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          public_token?: string | null
          reminder_sent_at?: string | null
          review_completed_at?: string | null
          review_requested_at?: string | null
          scheduled_at?: string
          service_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_settings: {
        Row: {
          appointment_reminder_enabled: boolean
          business_id: string
          created_at: string
          flow_assistant_enabled: boolean
          follow_up_enabled: boolean | null
          id: string
          review_request_delay_minutes: number
          review_request_enabled: boolean
          updated_at: string
          welcome_customer_enabled: boolean
          win_back_enabled: boolean | null
        }
        Insert: {
          appointment_reminder_enabled?: boolean
          business_id: string
          created_at?: string
          flow_assistant_enabled?: boolean
          follow_up_enabled?: boolean | null
          id?: string
          review_request_delay_minutes?: number
          review_request_enabled?: boolean
          updated_at?: string
          welcome_customer_enabled?: boolean
          win_back_enabled?: boolean | null
        }
        Update: {
          appointment_reminder_enabled?: boolean
          business_id?: string
          created_at?: string
          flow_assistant_enabled?: boolean
          follow_up_enabled?: boolean | null
          id?: string
          review_request_delay_minutes?: number
          review_request_enabled?: boolean
          updated_at?: string
          welcome_customer_enabled?: boolean
          win_back_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          action_type: string
          business_id: string
          created_at: string | null
          enabled: boolean
          id: string
          name: string
          trigger_type: string
        }
        Insert: {
          action_type: string
          business_id: string
          created_at?: string | null
          enabled?: boolean
          id?: string
          name: string
          trigger_type: string
        }
        Update: {
          action_type?: string
          business_id?: string
          created_at?: string | null
          enabled?: boolean
          id?: string
          name?: string
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "automations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          business_type: string
          created_at: string
          email: string | null
          id: string
          instagram: string | null
          name: string
          operating_hours: Json
          phone: string | null
          slug: string | null
          tour_completed: boolean | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_type: string
          created_at?: string
          email?: string | null
          id?: string
          instagram?: string | null
          name: string
          operating_hours?: Json
          phone?: string | null
          slug?: string | null
          tour_completed?: boolean | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_type?: string
          created_at?: string
          email?: string | null
          id?: string
          instagram?: string | null
          name?: string
          operating_hours?: Json
          phone?: string | null
          slug?: string | null
          tour_completed?: boolean | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          business_id: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          is_archived: boolean
          last_name: string | null
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          is_archived?: boolean
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          is_archived?: boolean
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      email_settings: {
        Row: {
          business_id: string
          created_at: string
          id: string
          reply_to_email: string | null
          sender_name: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          reply_to_email?: string | null
          sender_name?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          reply_to_email?: string | null
          sender_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          business_id: string
          created_at: string | null
          id: string
          subject: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          body: string
          business_id: string
          created_at?: string | null
          id?: string
          subject: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          business_id?: string
          created_at?: string | null
          id?: string
          subject?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          onboarding_completed: boolean
        }
        Insert: {
          created_at?: string
          id: string
          onboarding_completed?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          onboarding_completed?: boolean
        }
        Relationships: []
      }
      services: {
        Row: {
          business_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          is_active: boolean
          is_available: boolean
          name: string
          price: number
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          is_available?: boolean
          name: string
          price?: number
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          is_available?: boolean
          name?: string
          price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          id: string
          tour_completed: boolean | null
          user_id: string | null
        }
        Insert: {
          id?: string
          tour_completed?: boolean | null
          user_id?: string | null
        }
        Update: {
          id?: string
          tour_completed?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          beta_joined_at: string | null
          beta_token: string | null
          business_type: string | null
          created_at: string | null
          email: string
          id: string
          is_beta_tester: boolean | null
          source: string | null
          status: string | null
          timezone: string | null
        }
        Insert: {
          beta_joined_at?: string | null
          beta_token?: string | null
          business_type?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_beta_tester?: boolean | null
          source?: string | null
          status?: string | null
          timezone?: string | null
        }
        Update: {
          beta_joined_at?: string | null
          beta_token?: string | null
          business_type?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_beta_tester?: boolean | null
          source?: string | null
          status?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
