import { flowFooter } from "../partials/flowFooter.ts";
import { theme } from "../theme.ts";

export function businessLayout({
  businessName,
  senderName,
  content,
}: {
  businessName: string;
  senderName: string;
  content: string;
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
    border-radius:18px;
    overflow:hidden;
  "
>

<tr>
<td style="padding:48px;">

<div
  style="
    font-size:14px;
    color:${theme.colors.muted};
    margin-bottom:10px;
  "
>
Message from
</div>

<h1
  style="
    margin:0 0 36px;
    font-family:${theme.fonts.heading};
    font-size:34px;
    font-weight:600;
    color:${theme.colors.heading};
  "
>
${businessName}
</h1>

${content}

<div
  style="
    margin-top:42px;
    font-size:16px;
    line-height:28px;
    color:${theme.colors.text};
  "
>
Kind regards,
<br />
<strong>${senderName}</strong>
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