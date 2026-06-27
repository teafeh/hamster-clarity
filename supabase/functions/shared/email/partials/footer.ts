import { FLOW } from "../config.ts";
import { theme } from "../theme.ts";
import { divider } from "../components/divider.ts";

export function footer(): string {
  return `
${divider()}

<p
  style="
    margin-top:32px;
    font-family:${theme.fonts.body};
    font-size:13px;
    color:${theme.colors.muted};
    text-align:center;
  "
>
  Powered by
  <strong style="color:${theme.colors.accent};">
    Flow
  </strong>
  by
  <strong style="color:${theme.colors.heading};">
    Hamster
  </strong>
</p>

<div
  style="
    margin-top:20px;
    text-align:center;
    font-family:${theme.fonts.body};
    font-size:14px;
  "
>
  <a
    href="${FLOW.website}"
    style="color:${theme.colors.accent};text-decoration:none;"
  >
    Website
  </a>

  &nbsp;&nbsp;•&nbsp;&nbsp;

  <a
    href="${FLOW.instagram}"
    style="color:${theme.colors.accent};text-decoration:none;"
  >
    Instagram
  </a>

  &nbsp;&nbsp;•&nbsp;&nbsp;

  <a
    href="${FLOW.linkedin}"
    style="color:${theme.colors.accent};text-decoration:none;"
  >
    LinkedIn
  </a>

  &nbsp;&nbsp;•&nbsp;&nbsp;

  <a
    href="${FLOW.x}"
    style="color:${theme.colors.accent};text-decoration:none;"
  >
    X
  </a>
</div>

<p
  style="
    margin-top:30px;
    font-family:${theme.fonts.body};
    font-size:12px;
    line-height:22px;
    text-align:center;
    color:${theme.colors.muted};
  "
>
  You received this email because you interacted with a business using Flow by Hamster.
</p>
`;
}