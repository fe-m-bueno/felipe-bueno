'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contactFormSchema } from '@/lib/validation';
import type { ContactFormData } from '@/lib/validation';
import { z } from 'zod';

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<ContactFormData & { honeypot?: string }>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
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
      setErrors({ form: t('contact.tooManySubmissions') });
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details?.fieldErrors) {
          setErrors(data.details.fieldErrors);
        } else {
          setErrors({ form: data.error || t('contact.errorSending') });
        }
        return;
      }

      setSuccess(true);
      setForm({ name: '', email: '', message: '', honeypot: '' });
      setSubmitCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setErrors({ form: t('contact.errorSending') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full px-4 md:px-16 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-center">
        <h1 className="~text-2xl/3xl font-bold mt-10 mb-6">
          {t('contact.title')}
        </h1>
      </div>

      <div className="max-w-lg mx-auto">
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-500">{t('contact.success')}</p>
          </div>
        )}

        {errors.form && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-500">{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              {t('contact.name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 bg-white/[3%] border border-gray-400/20 dark:border-gray-200/20 rounded-lg shadow-sm backdrop-blur-3xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              {t('contact.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 bg-white/[3%] border border-gray-400/20 dark:border-gray-200/20 rounded-lg shadow-sm backdrop-blur-3xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">
              {t('contact.message')}
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              disabled={loading}
              rows={5}
              className="w-full p-3 bg-white/[3%] border border-gray-400/20 dark:border-gray-200/20 rounded-lg shadow-sm backdrop-blur-3xl focus:ring-2 focus:ring-rose-500 focus:border-transparent max-h-[30rem]"
              aria-invalid={errors.message ? 'true' : 'false'}
            />
            {errors.message && (
              <span className="text-red-500 text-sm">{errors.message}</span>
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
            className="w-full px-4 py-3 bg-rose-600/85 hover:bg-rose-500/85 backdrop-blur-md dark:bg-rose-600/85 dark:hover:bg-rose-700/85 border border-gray-200/20 rounded-xl text-white transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('contact.sending') : t('contact.send')}
          </button>
        </form>
      </div>
    </section>
  );
}
