export interface EmailCTA {
  label: string;
  url: string;
}

export interface EmailTemplate {
  title: string;
  subtitle?: string;

  content: string[];

  cta?: EmailCTA;
}