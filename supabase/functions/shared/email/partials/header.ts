import { theme } from "../theme.ts";
import { logo } from "./logo.ts";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function header({
  title,
  subtitle,
}: HeaderProps): string {
  return `
${logo()}

<h1
  style="
    margin:0;
    text-align:center;
    font-family:${theme.fonts.heading};
    font-size:32px;
    font-weight:700;
    line-height:1.2;
    color:${theme.colors.heading};
  "
>
  ${title}
</h1>

${
  subtitle
    ? `
<p
  style="
    margin:16px 0 0;
    text-align:center;
    font-family:${theme.fonts.body};
    font-size:16px;
    line-height:30px;
    color:${theme.colors.text};
  "
>
  ${subtitle}
</p>
`
    : ""
}
`;
}