import { NextResponse } from "next/server";
import type { ContactFormData, ContactMessage } from "@/types/contact";

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "O nome é obrigatório." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Informe um e-mail válido." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "O assunto é obrigatório." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "A mensagem deve conter pelo menos 5 caracteres." },
        { status: 400 }
      );
    }

    // Structure message for storage / database persistence
    const contactMessage: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // Ready for database insertion (e.g. await prisma.contactMessage.create(...) or supabase)
    console.log("[API /api/contact] Mensagem recebida:", contactMessage);

    return NextResponse.json(
      {
        success: true,
        message: "Mensagem enviada com sucesso!",
        data: { id: contactMessage.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /api/contact] Erro no processamento:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu um erro interno ao processar a mensagem. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
