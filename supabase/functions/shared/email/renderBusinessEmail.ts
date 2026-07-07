import { businessLayout } from "./layouts/businessLayout.ts";

export function renderBusinessEmail({
  businessName,
  senderName,
  content,

  buttonText,
  buttonUrl,

  businessPhone,
  businessAddress,
  businessWebsite,
  businessInstagram,
}: {
  businessName: string;
  senderName: string;
  content: string;

  buttonText?: string;
  buttonUrl?: string;

  businessPhone?: string;
  businessAddress?: string;
  businessWebsite?: string;
  businessInstagram?: string;
}): string {
  const html = content
    .split("\n\n")
    .map(
      (paragraph) => `
        <p style="
          margin:0 0 18px;
          font-size:16px;
          line-height:28px;
          color:#4B5563;
        ">
          ${paragraph.replace(/\n/g, "<br/>")}
        </p>
      `,
    )
    .join("");

  return businessLayout({
    businessName,
    senderName,

    content: html,

    buttonText,
    buttonUrl,

    businessPhone,
    businessAddress,
    businessWebsite,
    businessInstagram,
  });
}