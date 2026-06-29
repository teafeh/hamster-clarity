export const PAYMENT_STATUS = {
  PAID: "paid",
  PENDING: "pending",
  PARTIAL: "partial",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_METHOD = {
  CASH: "cash",
  TRANSFER: "transfer",
  CARD: "card",
  ONLINE: "online",
  OTHER: "other",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];