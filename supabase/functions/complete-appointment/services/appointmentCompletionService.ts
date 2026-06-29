import { supabase } from "../../shared/lib/supabase.ts";import type {
  PaymentMethod,
  PaymentStatus,
} from "../../shared/constants/payment.ts";


import { automationService } from "../../shared/automation/automationService.ts";

export const appointmentCompletionService = {
  async completeAppointment(
  appointmentId: string,
  paymentStatus: PaymentStatus,
  paymentMethod: PaymentMethod | null,
) {
    // Load appointment
    const { data: appointment, error: appointmentError } =
      await supabase
        .from("appointments")
        .select(`
          *,
          business:businesses(id)
        `)
        .eq("id", appointmentId)
        .single();

    if (appointmentError) throw appointmentError;

    // Load automation settings
    const automation =
      await automationService.getSettingsByBusinessId(
        appointment.business.id,
      );

    const now = new Date();

    // Calculate schedule dates
    const followUpDate = new Date(now);
    followUpDate.setHours(
      followUpDate.getHours() +
        (automation?.follow_up_delay_hours ?? 24),
    );

    const reviewDate = new Date(now);
    reviewDate.setDate(
      reviewDate.getDate() +
        (automation?.review_request_delay_days ?? 2),
    );

    const winBackDate = new Date(now);
    winBackDate.setDate(
      winBackDate.getDate() +
        (automation?.win_back_delay_days ?? 90),
    );

    // Update appointment
    const { data, error } = await supabase
      .from("appointments")
      .update({
        status: "completed",

        completed_at: now.toISOString(),

        payment_status: paymentStatus,

        payment_method: paymentMethod,

        follow_up_scheduled_at:
          followUpDate.toISOString(),

        review_request_scheduled_at:
          reviewDate.toISOString(),

        win_back_scheduled_at:
          winBackDate.toISOString(),
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};