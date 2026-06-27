import { theme } from "../theme.ts";

export function divider(): string {
  return `
<hr
  style="
    margin:48px 0;
    border:none;
    border-top:1px solid ${theme.colors.border};
  "
/>
`;
}