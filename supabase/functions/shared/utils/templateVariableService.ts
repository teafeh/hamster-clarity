import type { Business } from "../../../../src/services/businessService";
import type { Customer } from "../../../../src/services/customerService";
import type { AppointmentWithRelations } from "../../../../src/services/appointmentService";
import type { Service } from "../../../../src/services/serviceService";

interface BuildVariablesOptions {
  business: Business;
  customer: Customer;
  appointment?: AppointmentWithRelations;
  service?: Service;
  senderName: string;
  reviewUrl?: string;
}

export const templateVariableService = {
  build({
  business,
  customer,
  appointment,
  service,
  senderName,
  reviewUrl,
}: BuildVariablesOptions) {
    const date = appointment
      ? new Date(appointment.scheduled_at)
      : null;

    const appointmentDate = date
      ? date.toLocaleDateString()
      : "";

    const appointmentTime = date
      ? date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return {
      // -------------------------
      // Customer
      // -------------------------
      customer_name:
  `${customer.first_name} ${customer.last_name ?? ""}`.trim(),

      customer_first_name: customer.first_name,

      customer_last_name: customer.last_name ?? "",

      customer_email: customer.email ?? "",

      customer_phone: customer.phone ?? "",

      // -------------------------
      // Business
      // -------------------------
      business_name: business.name,

      business_type: business.business_type ?? "",

      business_phone: business.phone ?? "",

business_email: business.email ?? "",

business_address: business.address ?? "",

business_website: business.website ?? "",

business_instagram: business.instagram ?? "",

      // -------------------------
      // Service
      // -------------------------
      service_name: service?.name ?? "",
      review_link: reviewUrl ?? "",

      service_price: String(service?.price ?? ""),

      service_duration: String(
        service?.duration_minutes ??
          appointment?.duration_minutes ??
          ""
      ),

      // -------------------------
      // Appointment
      // -------------------------
      appointment_date: appointmentDate,

      appointment_time: appointmentTime,

      appointment_datetime: appointment
        ? `${appointmentDate} ${appointmentTime}`
        : "",

      appointment_duration: appointment
        ? `${appointment.duration_minutes ?? ""} mins`
        : "",

      // -------------------------
      // Email
      // -------------------------
      sender_name: senderName,
    };
  },

  replace(
    text: string,
    variables: Record<string, string>
  ) {
    let output = text;

    Object.entries(variables).forEach(([key, value]) => {
      output = output.replace(
        new RegExp(`{{${key}}}`, "g"),
        value ?? ""
      );
    });

    return output;
  },
};