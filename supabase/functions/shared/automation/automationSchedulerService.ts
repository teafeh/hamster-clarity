import { createClient } from "../lib/supabase.ts";
import {
  getAppointmentsNeedingReminder,
  getAppointmentsNeedingFollowup,
  getAppointmentsNeedingReviewRequest,
} from "../appointment/appointmentService.ts";


export type AutomationType =
  | "appointment-reminder"
  | "appointment-followup"
  | "review-request"
  | "win-back"
  | "welcome-email";

export interface ScheduledAutomation {
  type: AutomationType;
  entityId: string;
}

export const automationSchedulerService = {
  async getPendingAppointmentReminders(): Promise<ScheduledAutomation[]> {
  const appointments =
    await getAppointmentsNeedingReminder();

  return appointments.map((appointment) => ({
    type: "appointment-reminder",
    entityId: appointment.id,
  }));
  },
  
  async getPendingAppointmentFollowups(): Promise<ScheduledAutomation[]> {
  const appointments =
    await getAppointmentsNeedingFollowup();

  return appointments.map((appointment) => ({
    type: "appointment-followup",
    entityId: appointment.id,
  }));
},

async getPendingReviewRequests(): Promise<ScheduledAutomation[]> {
  const appointments =
    await getAppointmentsNeedingReviewRequest();

  return appointments.map((appointment) => ({
    type: "review-request",
    entityId: appointment.id,
  }));
},

async getPendingWinBacks(): Promise<ScheduledAutomation[]> {
  return [];
},

async getPendingAutomations(): Promise<ScheduledAutomation[]> {
 const automations = [
  ...(await this.getPendingAppointmentReminders()),
  ...(await this.getPendingAppointmentFollowups()),
  ...(await this.getPendingReviewRequests()),
  ...(await this.getPendingWinBacks()),
];

  return automations;
},
};