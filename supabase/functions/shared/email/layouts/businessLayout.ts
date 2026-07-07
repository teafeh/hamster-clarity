import { flowFooter } from "../partials/flowFooter.ts";
import { theme } from "../theme.ts";

export function businessLayout({
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
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>
</head>

<body
  style="
    margin:0;
    padding:40px 20px;
    background:${theme.colors.background};
    font-family:${theme.fonts.body};
  "
>

<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
>
<tr>
<td align="center">

<table
  role="presentation"
  width="100%"
  style="
    max-width:640px;
    background:${theme.colors.surface};
    border:1px solid ${theme.colors.border};
    border-radius:20px;
    overflow:hidden;
  "
>

<tr>
<td style="padding:56px 48px;">

<!-- Header -->

<div
  style="
    text-align:center;
    margin-bottom:42px;
  "
>

<h1
  style="
    margin:0;
    font-family:${theme.fonts.heading};
    font-size:34px;
    font-weight:600;
    color:${theme.colors.heading};
  "
>
${businessName}
</h1>

<div
  style="
    width:72px;
    height:4px;
    margin:18px auto 0;
    background:${theme.colors.accent};
    border-radius:999px;
  "
></div>

</div>

<!-- Email Content -->

${content}

<!-- CTA -->

${
  buttonText && buttonUrl
    ? `
      <div
        style="
          margin:40px 0 48px;
          text-align:center;
        "
      >

        <a
          href="${buttonUrl}"
          style="
            display:inline-block;
            padding:16px 34px;
            background:${theme.colors.accent};
            color:${theme.colors.white};
            text-decoration:none;
            border-radius:12px;
            font-size:16px;
            font-weight:600;
          "
        >
          ${buttonText}
        </a>

      </div>
    `
    : ""
}

<!-- Contact Section -->

<div
  style="
    margin-top:24px;
    padding-top:34px;
    border-top:1px solid ${theme.colors.border};
  "
>

<h3
  style="
    margin:0 0 18px;
    font-family:${theme.fonts.heading};
    font-size:18px;
    font-weight:600;
    color:${theme.colors.heading};
  "
>
Questions?
</h3>

${
  businessPhone
    ? `
      <p
        style="
          margin:8px 0;
          font-size:15px;
          line-height:26px;
          color:${theme.colors.text};
        "
      >
        📞 ${businessPhone}
      </p>
    `
    : ""
}

${
  businessAddress
    ? `
      <p
        style="
          margin:8px 0;
          font-size:15px;
          line-height:26px;
          color:${theme.colors.text};
        "
      >
        📍 ${businessAddress}
      </p>
    `
    : ""
}

${
  businessWebsite
    ? `
      <p
        style="
          margin:8px 0;
          font-size:15px;
          line-height:26px;
          color:${theme.colors.text};
        "
      >
        🌐
        <a
          href="${businessWebsite}"
          style="
            color:${theme.colors.brand};
            text-decoration:none;
          "
        >
          ${businessWebsite}
        </a>
      </p>
    `
    : ""
}

${
  businessInstagram
    ? `
      <p
        style="
          margin:8px 0;
          font-size:15px;
          line-height:26px;
          color:${theme.colors.text};
        "
      >
        📷 ${businessInstagram}
      </p>
    `
    : ""
}

</div>

<!-- Signature -->

<div
  style="
    margin-top:42px;
    font-size:16px;
    line-height:28px;
    color:${theme.colors.text};
  "
>

Kind regards,

<br /><br />

<strong
style="
color:${theme.colors.heading};
"
>
${senderName}
</strong>

</div>

</td>
</tr>

<tr>
<td>

${flowFooter()}

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}