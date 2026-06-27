import { flowLayout } from "./layouts/flowLayout.ts";
import { button } from "./components/button.ts";

import type {
  EmailTemplate,
} from "./types.ts";

export function renderTemplate(
  template: EmailTemplate
): string {
  let content = template.content.join("");

  if (template.cta) {
    content += button({
      label: template.cta.label,
      url: template.cta.url,
    });
  }

  return flowLayout({
    title: template.title,
    subtitle: template.subtitle,
    content,
  });
}