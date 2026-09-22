import disposableDomains from "disposable-email-domains";
import wildcardDomains from "disposable-email-domains/wildcard.json";
import { contactFormSchema } from "@/lib/validation";

// Só no servidor — não importe isto de um client component.
const DISPOSABLE_DOMAINS = new Set(disposableDomains);
const WILDCARD_DOMAINS = new Set(wildcardDomains);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (DISPOSABLE_DOMAINS.has(domain)) return true;

  // Entradas wildcard valem para o domínio e qualquer subdomínio dele.
  const labels = domain.split(".");
  return labels.some((_, index) => WILDCARD_DOMAINS.has(labels.slice(index).join(".")));
}

export const serverContactFormSchema = contactFormSchema.extend({
  email: contactFormSchema.shape.email.refine((email) => !isDisposableEmail(email), {
    message: "Temporary emails are not allowed",
  }),
});
