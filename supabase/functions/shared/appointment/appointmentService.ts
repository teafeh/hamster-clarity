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

export async function getAppointmentsNeedingReminder() {
  const now = new Date();

  const oneHourLater = new Date(
    now.getTime() + 60 * 60 * 1000
  );

  const { data, error } = await supabase
  .from("appointments")
  .select("id")
  .eq("status", "scheduled")
  .is("reminder_sent_at", null)
  .gte("scheduled_at", now.toISOString())
  .lte("scheduled_at", oneHourLater.toISOString());

  if (error) throw error;

  return data;
}


export async function markReminderSent(
  appointmentId: string
) {
  const { error } = await supabase
    .from("appointments")
    .update({
      reminder_sent_at: new Date().toISOString(),
    })
    .eq("id", appointmentId);

  if (error) throw error;
}



export async function getAppointmentsNeedingFollowup() {
  const now = new Date();

  const thirtyMinutesAgo = new Date(
    now.getTime() - 30 * 60 * 1000
  );

  const { data, error } = await supabase
    .from("appointments")
    .select("id, status, completed_at, followup_sent_at")
    .eq("status", "completed")
    .is("followup_sent_at", null)
    .not("completed_at", "is", null)
    .lte("completed_at", thirtyMinutesAgo.toISOString());

  if (error) throw error;


  return data;
}

export async function getAppointmentsNeedingReviewRequest() {
  const now = new Date();

  // Send review request 24 hours after completion
  const twentyFourHoursAgo = new Date(
    now.getTime() - 24 * 60 * 60 * 1000
  );

  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, status, completed_at, review_requested_at"
    )
    .eq("status", "completed")
    .is("review_requested_at", null)
    .not("completed_at", "is", null)
    .lte(
      "completed_at",
      twentyFourHoursAgo.toISOString()
    );

  if (error) throw error;

  return data;
}



export async function markFollowupSent(
  appointmentId: string
) {
  const { error } = await supabase
    .from("appointments")
    .update({
      followup_sent_at: new Date().toISOString(),
    })
    .eq("id", appointmentId);

  if (error) throw error;
}

export async function markReviewRequested(
  appointmentId: string
) {
  const { error } = await supabase
    .from("appointments")
    .update({
      review_requested_at:
        new Date().toISOString(),
    })
    .eq("id", appointmentId);

  if (error) throw error;
}