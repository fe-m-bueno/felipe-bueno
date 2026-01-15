"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { contactFormSchema } from "@/lib/validation";
import type { ContactFormData } from "@/lib/validation";
import { z } from "zod";
import LiquidGlass from "./LiquidGlass";

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<ContactFormData & { honeypot?: string }>({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitCount > 10) {
      setErrors({ form: t("contact.tooManySubmissions") });
      return;
    }

    try {
      contactFormSchema.parse(form);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details?.fieldErrors) {
          setErrors(data.details.fieldErrors);
        } else {
          setErrors({ form: data.error || t("contact.errorSending") });
        }
        return;
      }

      setSuccess(true);
      setForm({ name: "", email: "", message: "", honeypot: "" });
      setSubmitCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error:", error);
      setErrors({ form: t("contact.errorSending") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full px-4 md:px-16 py-20 md:py-28 max-w-7xl mx-auto">
      <div className="flex items-center justify-center">
        <h1 className="~text-4xl/5xl md:~text-5xl/6xl lg:~text-6xl/7xl font-bold mt-12 mb-12 md:mb-16 lg:mb-20">
          {t("contact.title")}
        </h1>
      </div>

      <LiquidGlass variant="card" className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto p-12 md:p-16 lg:p-20 !rounded-3xl">
        {success && (
          <div className="mb-10 md:mb-12 p-6 md:p-8 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-500 text-lg md:text-xl lg:text-2xl">{t("contact.success")}</p>
          </div>
        )}

        {errors.form && (
          <div className="mb-10 md:mb-12 p-6 md:p-8 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-500 text-lg md:text-xl lg:text-2xl">{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-10 md:space-y-12 lg:space-y-14">
          <div className="space-y-4 md:space-y-5">
            <label htmlFor="name" className="block text-lg md:text-xl lg:text-2xl font-medium">
              {t("contact.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-6 md:p-7 lg:p-8 text-lg md:text-xl lg:text-2xl bg-white/10 dark:bg-black/20 border-2 border-gray-400/20 dark:border-gray-200/20 rounded-xl shadow-sm backdrop-blur-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <span className="text-red-500 text-base md:text-lg lg:text-xl">{errors.name}</span>
            )}
          </div>

          <div className="space-y-4 md:space-y-5">
            <label htmlFor="email" className="block text-lg md:text-xl lg:text-2xl font-medium">
              {t("contact.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-6 md:p-7 lg:p-8 text-lg md:text-xl lg:text-2xl bg-white/10 dark:bg-black/20 border-2 border-gray-400/20 dark:border-gray-200/20 rounded-xl shadow-sm backdrop-blur-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span className="text-red-500 text-base md:text-lg lg:text-xl">{errors.email}</span>
            )}
          </div>

          <div className="space-y-4 md:space-y-5">
            <label htmlFor="message" className="block text-lg md:text-xl lg:text-2xl font-medium">
              {t("contact.message")}
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              disabled={loading}
              rows={10}
              className="w-full p-6 md:p-7 lg:p-8 text-lg md:text-xl lg:text-2xl bg-white/10 dark:bg-black/20 border-2 border-gray-400/20 dark:border-gray-200/20 rounded-xl shadow-sm backdrop-blur-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent max-h-[40rem] transition-all"
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message && (
              <span className="text-red-500 text-base md:text-lg lg:text-xl">{errors.message}</span>
            )}
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="honeypot">Leave this field empty</label>
            <input
              type="text"
              id="honeypot"
              name="honeypot"
              value={form.honeypot}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 md:px-10 lg:px-12 py-6 md:py-7 lg:py-8 text-lg md:text-xl lg:text-2xl bg-rose-600/85 hover:bg-rose-500/85 backdrop-blur-md dark:bg-rose-600/85 dark:hover:bg-rose-700/85 border-2 border-gray-200/20 rounded-xl text-white transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("contact.sending") : t("contact.send")}
          </button>
        </form>
      </LiquidGlass>
    </section>
  );
}
