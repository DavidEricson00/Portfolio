"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, KeyRound, AlertCircle, LogIn, ArrowLeft } from "lucide-react";
import { login } from "@/lib/firebase/auth";
import "@/components/admin/admin-ui.css";
import "@/components/admin/admin-login.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      console.error("Erro no login:", err);
      setError("E-mail ou senha inválidos. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <Lock size={26} />
          </div>
          <div>
            <h1 className="admin-login-title">Painel Administrativo</h1>
            <p className="admin-login-subtitle">
              Insira suas credenciais para gerenciar o conteúdo do portfólio.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="email" className="admin-form-label">
              E-mail
            </label>
            <div className="admin-input-wrapper">
              <Mail size={18} className="admin-input-icon" />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="password" className="admin-form-label">
              Senha
            </label>
            <div className="admin-input-wrapper">
              <KeyRound size={18} className="admin-input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="admin-input"
              />
            </div>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary admin-login-submit"
          >
            {loading ? (
              <>
                <div className="admin-loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link href="/" className="admin-login-back-link">
            <ArrowLeft size={15} />
            <span>Voltar ao portfólio público</span>
          </Link>
        </div>
      </div>
    </div>
  );
}