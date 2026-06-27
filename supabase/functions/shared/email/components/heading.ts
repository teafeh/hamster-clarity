import { theme } from "../theme.ts";

export function heading(text: string): string {
  return `
<h1
  style="
    margin:0 0 20px;
    font-family:${theme.fonts.heading};
    font-size:32px;
    font-weight:700;
    line-height:1.2;
    color:${theme.colors.heading};
  "
>
  ${text}
</h1>
`;
}