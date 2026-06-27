import { theme } from "../theme.ts";

interface CardProps {
  content: string;
}

export function card({
  content,
}: CardProps): string {
  return `
<div
  style="
    background:${theme.colors.surface};
    border:1px solid ${theme.colors.border};
    border-radius:${theme.radius.lg};
    padding:28px;
    margin:32px 0;
  "
>
  ${content}
</div>
`;
}