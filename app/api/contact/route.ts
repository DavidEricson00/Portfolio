import { NextResponse } from "next/server";
import type { ContactFormData } from "@/types/contact";
import { createContact } from "@/lib/data/contacts";

// In-memory sliding window rate limiter
// Limits each client IP to a maximum of 5 contact submissions per 10 minutes
interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp) || { timestamps: [] };

  // Remove timestamps outside the sliding window
  const validTimestamps = entry.timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(clientIp, { timestamps: validTimestamps });
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(clientIp, { timestamps: validTimestamps });

  // Cleanup old entries periodically if map grows large
  if (rateLimitMap.size > 1000) {
    for (const [ip, item] of rateLimitMap.entries()) {
      const active = item.timestamps.filter(
        (t) => now - t < RATE_LIMIT_WINDOW_MS,
      );
      if (active.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, { timestamps: active });
      }
    }
  }

  return false;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "anonymous_client";
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Check rate limit
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Limite de envios excedido temporariamente. Por favor, aguarde alguns minutos antes de enviar uma nova mensagem.",
        },
        { status: 429 },
      );
    }

    const body: ContactFormData & { email?: string; _gotcha?: string } =
      await request.json();

    // Honeypot protection for spam bots
    if (body._gotcha && body._gotcha.trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Mensagem recebida com sucesso!",
        },
        { status: 200 },
      );
    }

    const name = (body.name || "").trim();
    // Accept either contact or fallback to legacy email field
    const contact = (body.contact || body.email || "").trim();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();

    // Field Validations
    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "O nome é obrigatório e deve ter entre 2 e 100 caracteres.",
        },
        { status: 400 },
      );
    }

    if (!contact || contact.length < 3 || contact.length > 150) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Por favor, informe uma forma válida de contato (e-mail, telefone ou rede social).",
        },
        { status: 400 },
      );
    }

    if (!subject || subject.length < 2 || subject.length > 150) {
      return NextResponse.json(
        {
          success: false,
          error: "O assunto é obrigatório e deve ter entre 2 e 150 caracteres.",
        },
        { status: 400 },
      );
    }

    if (!message || message.length < 5 || message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A mensagem é obrigatória e deve ter entre 5 e 5000 caracteres.",
        },
        { status: 400 },
      );
    }

    // Persist to Firestore contacts collection
    const id = await createContact({
      name,
      contact,
      subject,
      message,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mensagem enviada com sucesso!",
        data: { id },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[API /api/contact] Erro ao salvar contato:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Ocorreu um erro interno ao processar sua mensagem. Por favor, tente novamente mais tarde.",
      },
      { status: 500 },
    );
  }
}
