import { header } from "../partials/header.ts";
import { footer } from "../partials/footer.ts";

interface FlowLayoutOptions {
  title: string;
  subtitle?: string;
  content: string;
}

export function flowLayout({
  title,
  subtitle,
  content,
}: FlowLayoutOptions): string {
  return `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8"/>

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>${title}</title>

</head>

<body
style="
margin:0;
padding:40px 20px;
background:#F3F4F6;
font-family:
Inter,
Arial,
Helvetica,
sans-serif;
"
>

<table
role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
style="border-collapse:collapse;"
>

<tr>

<td align="center">

<table
role="presentation"
width="640"
cellpadding="0"
cellspacing="0"
style="
background:#FFFFFF;
border-radius:18px;
padding:48px;
box-shadow:
0 10px 35px rgba(0,0,0,.06);
"
>

<tr>

<td>

${header({
  title,
  subtitle,
})}

<div style="height:40px;"></div>

${content}

${footer()}

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