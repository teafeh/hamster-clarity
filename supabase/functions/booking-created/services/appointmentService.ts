import { supabase } from "../lib/supabase.ts"

export async function getAppointment(
  appointmentId: string
) {
  const { data, error } = await supabase
    .from("appointments")
    .select(`
  *,
  customer:customers!appointments_customer_id_fkey(*),
  service:services!appointments_service_id_fkey(*),
  business:businesses!appointments_business_id_fkey(*)
`)
    .eq("id", appointmentId)
    .single()

  if (error) throw error

  return data
}