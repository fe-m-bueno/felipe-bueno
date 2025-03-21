import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

setInterval(() => {
  const now = Date.now();
  ipRequestCounts.forEach((data, ip) => {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      ipRequestCounts.delete(ip);
    }
  });
}, RATE_LIMIT_WINDOW);

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    const now = Date.now();
    const ipData = ipRequestCounts.get(ip) || { count: 0, timestamp: now };

    if (now - ipData.timestamp > RATE_LIMIT_WINDOW) {
      ipData.count = 0;
      ipData.timestamp = now;
    }

    if (ipData.count >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Muitas solicitações. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados de formulário inválidos",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    const { name, email, message } = result.data;

    const emailResult = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "felipebueno.dev@gmail.com",
      subject: `Novo contato de ${name}`,
      html: `
        <h2>Novo contato do seu portfólio</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    });

    ipData.count += 1;
    ipRequestCounts.set(ip, ipData);

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return NextResponse.json(
        { error: "Falha ao enviar email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
