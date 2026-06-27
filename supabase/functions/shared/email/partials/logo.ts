import { FLOW } from "../config.ts";

export function logo(): string {
  return `
<div style="text-align:center;margin-bottom:32px;">
    <img
        src="${FLOW.logo}"
        alt="Flow by Hamster"
        width="240"
        style="
            display:block;
            margin:0 auto;
            border:0;
            outline:none;
            text-decoration:none;
        "
    />
</div>
`;
}