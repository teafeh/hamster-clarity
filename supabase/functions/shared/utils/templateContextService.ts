import { templateVariableService } from "./templateVariableService.ts";

export const templateContextService = {
  build({
    appointment,
    senderName,
  }: {
    appointment: any;
    senderName: string;
  }) {
    return templateVariableService.build({
      business: appointment.business,
      customer: appointment.customer,
      appointment,
      service: appointment.service,
      senderName,
    });
  },
};