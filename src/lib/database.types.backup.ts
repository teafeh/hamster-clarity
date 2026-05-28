/**
 * database.types.ts
 *
 * Manually maintained for now. Replace with the generated version once
 * the Supabase CLI is set up:
 *
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_REF \
 *     > src/lib/database.types.ts
 *
 * Do NOT edit the generated version by hand — re-run the command instead.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── Enums ────────────────────────────────────────────────────────────────────

export type BusinessType =
  | 'hair_salon'
  | 'barbershop'
  | 'spa'
  | 'beauty_clinic'
  | 'massage_center'
  | 'medical_clinic'
  | 'dental_clinic'
  | 'photography_studio'
  | 'fitness_coaching'
  | 'tutoring'
  | 'fashion_design'
  | 'auto_workshop'
  | 'cleaning_service'
  | 'home_service'
  | 'other'

export type UserRole = 'owner' | 'staff'

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'no_show'
  | 'cancelled'

export type HealthPeriodType = 'weekly' | 'monthly'

// ── Operating hours JSONB shape ──────────────────────────────────────────────

export interface DayHours {
  open: string       // "09:00"
  close: string      // "18:00"
  is_closed: boolean
}

export type OperatingHours = {
  monday:    DayHours
  tuesday:   DayHours
  wednesday: DayHours
  thursday:  DayHours
  friday:    DayHours
  saturday:  DayHours
  sunday:    DayHours
}

// ── Health score flags JSONB shape ───────────────────────────────────────────

export interface HealthFlag {
  code:             string   // e.g. 'HIGH_NO_SHOW_RATE'
  severity:         'critical' | 'warning' | 'info'
  metric_value:     number
  threshold:        number
  estimated_impact: string
  message:          string
}

// ── Database type map ────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {

      businesses: {
        Row: {
          id:                   string
          name:                 string
          type:                 BusinessType
          phone:                string | null
          email:                string | null
          address:              string | null
          city:                 string | null
          state:                string | null
          logo_url:             string | null
          operating_hours:      Json
          onboarding_completed: boolean
          is_active:            boolean
          created_at:           string
          updated_at:           string
        }
        Insert: {
          id?:                  string
          name:                 string
          type?:                BusinessType
          phone?:               string | null
          email?:               string | null
          address?:             string | null
          city?:                string | null
          state?:               string | null
          logo_url?:            string | null
          operating_hours?:     Json
          onboarding_completed?: boolean
          is_active?:           boolean
          created_at?:          string
          updated_at?:          string
        }
        Update: {
          id?:                  string
          name?:                string
          type?:                BusinessType
          phone?:               string | null
          email?:               string | null
          address?:             string | null
          city?:                string | null
          state?:               string | null
          logo_url?:            string | null
          operating_hours?:     Json
          onboarding_completed?: boolean
          is_active?:           boolean
          updated_at?:          string
        }
      }

      users: {
        Row: {
          id:                     string
          business_id:            string
          role:                   UserRole
          full_name:              string
          email:                  string
          phone:                  string | null
          avatar_url:             string | null
          assignable_service_ids: string[]
          is_active:              boolean
          created_at:             string
          updated_at:             string
        }
        Insert: {
          id:                     string
          business_id:            string
          role?:                  UserRole
          full_name:              string
          email:                  string
          phone?:                 string | null
          avatar_url?:            string | null
          assignable_service_ids?: string[]
          is_active?:             boolean
          created_at?:            string
          updated_at?:            string
        }
        Update: {
          business_id?:           string
          role?:                  UserRole
          full_name?:             string
          email?:                 string
          phone?:                 string | null
          avatar_url?:            string | null
          assignable_service_ids?: string[]
          is_active?:             boolean
          updated_at?:            string
        }
      }

      services: {
        Row: {
          id:               string
          business_id:      string
          name:             string
          description:      string | null
          duration_minutes: number
          price:            number
          category:         string | null
          is_active:        boolean
          created_at:       string
          updated_at:       string
        }
        Insert: {
          id?:              string
          business_id:      string
          name:             string
          description?:     string | null
          duration_minutes: number
          price:            number
          category?:        string | null
          is_active?:       boolean
          created_at?:      string
          updated_at?:      string
        }
        Update: {
          business_id?:     string
          name?:            string
          description?:     string | null
          duration_minutes?: number
          price?:           number
          category?:        string | null
          is_active?:       boolean
          updated_at?:      string
        }
      }

      customers: {
        Row: {
          id:            string
          business_id:   string
          full_name:     string
          phone:         string
          email:         string | null
          notes:         string | null
          tags:          string[]
          total_visits:  number
          last_visit_at: string | null
          is_active:     boolean
          created_at:    string
          updated_at:    string
        }
        Insert: {
          id?:           string
          business_id:   string
          full_name:     string
          phone:         string
          email?:        string | null
          notes?:        string | null
          tags?:         string[]
          total_visits?: number
          last_visit_at?: string | null
          is_active?:    boolean
          created_at?:   string
          updated_at?:   string
        }
        Update: {
          business_id?:  string
          full_name?:    string
          phone?:        string
          email?:        string | null
          notes?:        string | null
          tags?:         string[]
          total_visits?: number
          last_visit_at?: string | null
          is_active?:    boolean
          updated_at?:   string
        }
      }

      appointments: {
        Row: {
          id:                  string
          business_id:         string
          customer_id:         string
          service_id:          string
          staff_id:            string
          created_by:          string
          scheduled_at:        string
          duration_minutes:    number
          price:               number
          status:              AppointmentStatus
          is_walk_in:          boolean
          notes:               string | null
          cancellation_reason: string | null
          confirmed_at:        string | null
          started_at:          string | null
          completed_at:        string | null
          created_at:          string
          updated_at:          string
        }
        Insert: {
          id?:                 string
          business_id:         string
          customer_id:         string
          service_id:          string
          staff_id:            string
          created_by:          string
          scheduled_at:        string
          duration_minutes:    number
          price:               number
          status?:             AppointmentStatus
          is_walk_in?:         boolean
          notes?:              string | null
          cancellation_reason?: string | null
          confirmed_at?:       string | null
          started_at?:         string | null
          completed_at?:       string | null
          created_at?:         string
          updated_at?:         string
        }
        Update: {
          scheduled_at?:       string
          duration_minutes?:   number
          price?:              number
          status?:             AppointmentStatus
          is_walk_in?:         boolean
          notes?:              string | null
          cancellation_reason?: string | null
          confirmed_at?:       string | null
          started_at?:         string | null
          completed_at?:       string | null
          updated_at?:         string
        }
      }

      health_scores: {
        Row: {
          id:                        string
          business_id:               string
          period_type:               HealthPeriodType
          period_start:              string
          period_end:                string
          total_appointments:        number
          completed_count:           number
          no_show_count:             number
          cancelled_count:           number
          walk_in_count:             number
          completion_rate:           number
          no_show_rate:              number
          cancellation_rate:         number
          total_revenue:             number
          avg_revenue_per_appointment: number
          revenue_variance:          number
          utilization_rate:          number
          unique_customers:          number
          new_customers:             number
          returning_customers:       number
          retention_rate:            number
          at_risk_customers_count:   number
          overall_score:             number
          flags:                     Json
          computed_at:               string
          created_at:                string
        }
        Insert: never  // written by Edge Function only — no client inserts
        Update: never  // written by Edge Function only — no client updates
      }

    }

    Views: {
      appointment_details_view: {
        Row: {
          id:               string
          business_id:      string
          scheduled_at:     string
          duration_minutes: number
          price:            number
          status:           AppointmentStatus
          is_walk_in:       boolean
          notes:            string | null
          cancellation_reason: string | null
          confirmed_at:     string | null
          started_at:       string | null
          completed_at:     string | null
          created_at:       string
          customer_id:      string
          customer_name:    string
          customer_phone:   string
          service_id:       string
          service_name:     string
          service_category: string | null
          staff_id:         string
          staff_name:       string
          created_by_name:  string
        }
      }
      at_risk_customers_view: {
        Row: {
          id:                   string
          business_id:          string
          full_name:            string
          phone:                string
          email:                string | null
          last_visit_at:        string | null
          total_visits:         number
          tags:                 string[]
          days_since_last_visit: number | null
        }
      }
      daily_revenue_view: {
        Row: {
          business_id:       string
          revenue_date:      string
          appointment_count: number
          total_revenue:     number
          avg_price:         number
          walk_in_count:     number
        }
      }
    }

    Functions: {
      create_business_and_owner: {
        Args: {
          p_business_name:  string
          p_business_type:  BusinessType
          p_owner_name:     string
          p_owner_email:    string
          p_owner_phone?:   string
        }
        Returns: {
          business_id: string
          user_id:     string
        }
      }
      get_my_business_id: {
        Args: Record<never, never>
        Returns: string
      }
      get_my_role: {
        Args: Record<never, never>
        Returns: UserRole
      }
    }

    Enums: {
      business_type:       BusinessType
      user_role:           UserRole
      appointment_status:  AppointmentStatus
      health_period_type:  HealthPeriodType
    }
  }
}
