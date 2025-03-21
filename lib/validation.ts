import { z } from "zod";
import disposableDomains from "disposable-email-domains";
import wildcardDomains from "disposable-email-domains/wildcard.json";

const DISPOSABLE_EMAIL_DOMAINS = [...disposableDomains];

const isWildcardMatch = (domain: string): boolean => {
  return wildcardDomains.some((wildcardDomain) => {
    const pattern = wildcardDomain.replace(/\./g, "\\.").replace(/\*/g, ".*");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(domain);
  });
};

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name too long" }),
  email: z
    .string()
    .email({ message: "Email invalid" })
    .refine(
      (email) => {
        const domain = email.split("@")[1];
        return (
          !DISPOSABLE_EMAIL_DOMAINS.includes(domain) && !isWildcardMatch(domain)
        );
      },
      { message: "Temporary emails are not allowed" }
    ),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message too long" }),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
