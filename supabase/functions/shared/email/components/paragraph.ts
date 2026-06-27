import { theme } from "../theme.ts";

export function paragraph(text: string): string {
  return `
<p
  style="
    margin:0 0 20px;
    font-family:${theme.fonts.body};
    font-size:16px;
    line-height:30px;
    color:${theme.colors.text};
  "
>
  ${text}
</p>
`;
}