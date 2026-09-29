import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página que você está procurando não foi encontrada.",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(32px, 6vw, 64px) 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow effects matching portfolio hero aesthetic */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108, 140, 255, 0.14) 0%, rgba(124, 92, 255, 0.06) 50%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "560px",
          width: "100%",
          textAlign: "center",
          padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(14, 17, 23, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow:
            "0 24px 48px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* 404 Badge */}
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--primary, #6c8cff)",
            background: "rgba(108, 140, 255, 0.1)",
            border: "1px solid rgba(108, 140, 255, 0.3)",
            padding: "4px 14px",
            borderRadius: "9999px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--primary, #6c8cff)",
              boxShadow: "0 0 8px var(--primary, #6c8cff)",
            }}
          />
          Erro 404
        </div>

        {/* Big 404 Display */}
        <h1
          style={{
            fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            background:
              "linear-gradient(180deg, #ffffff 40%, rgba(255, 255, 255, 0.45) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0",
          }}
        >
          404
        </h1>

        {/* Title & Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Página não encontrada
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#94a3b8",
              lineHeight: 1.6,
              maxWidth: "420px",
              margin: 0,
            }}
          >
            O conteúdo que você está procurando não existe, foi removido ou o
            endereço foi digitado incorretamente.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            width: "100%",
            marginTop: "12px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, var(--primary, #6c8cff) 0%, var(--purple, #a855f7) 100%)",
              color: "#ffffff",
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 16px rgba(108, 140, 255, 0.35)",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
          >
            <Home size={16} />
            <span>Voltar ao Início</span>
          </Link>

          <Link
            href="/projetos"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: "rgba(255, 255, 255, 0.05)",
              color: "#e2e8f0",
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(10px)",
              transition: "background-color 150ms ease, color 150ms ease",
            }}
          >
            <Compass size={16} />
            <span>Explorar Projetos</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
