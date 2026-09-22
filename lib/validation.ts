import { z } from "zod";

// Seguro para o cliente. A checagem de e-mail descartável vive em
// `lib/disposableEmail.ts`, só no servidor: a lista tem ~120k domínios (2,3 MB).
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name too long" }),
  email: z.string().email({ message: "Email invalid" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message too long" }),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
