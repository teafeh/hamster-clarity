import { theme } from "../theme.ts";

interface ButtonProps {
  label: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
}

export function button({
  label,
  url,
  backgroundColor = theme.colors.accent,
  textColor = theme.colors.white,
}: ButtonProps): string {
  return `
<div style="margin:32px 0;text-align:center;">
  <a
    href="${url}"
    style="
      display:inline-block;
      background:${backgroundColor};
      color:${textColor};
      text-decoration:none;
      padding:14px 28px;
      border-radius:${theme.radius.md};
      font-family:${theme.fonts.body};
      font-size:15px;
      font-weight:600;
    "
  >
    ${label}
  </a>
</div>
`;
}