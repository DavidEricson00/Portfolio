"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { ContactFormData } from "@/types/contact";
import { trackEvent } from "@/lib/firebase/track";

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    contact: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Por favor, informe seu nome.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "O nome deve ter pelo menos 2 caracteres.";
    }

    if (!formData.contact.trim()) {
      newErrors.contact =
        "Por favor, informe uma forma de contato (e-mail, telefone ou rede social).";
    } else if (formData.contact.trim().length < 3) {
      newErrors.contact =
        "Informe um contato válido com no mínimo 3 caracteres.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Por favor, informe o assunto.";
    } else if (formData.subject.trim().length < 2) {
      newErrors.subject = "O assunto deve ter pelo menos 2 caracteres.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Por favor, escreva sua mensagem.";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "A mensagem deve ter no mínimo 5 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Ocorreu um erro ao enviar a mensagem.");
      }

      setStatus("success");
      void trackEvent("contact_form_submit", {});
      setFormData({ name: "", contact: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      void trackEvent("contact_form_error", {
        error_type: err instanceof TypeError ? "network" : "server",
      });
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao enviar. Tente novamente.",
      );
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrors({});
    setErrorMessage("");
  };

  return (
    <div className="contact-form-wrapper">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            className="contact-status-card contact-success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="contact-status-icon-wrap success-icon-wrap">
              <CheckCircle2 size={36} className="contact-status-icon" />
            </div>
            <h3 className="contact-status-title">Mensagem enviada com sucesso!</h3>
            <p className="contact-status-text">
              Obrigado pelo contato. Recebi sua mensagem e retornarei o mais breve
              possível.
            </p>
            <button
              type="button"
              className="button button-secondary contact-reset-btn"
              onClick={handleReset}
            >
              <RefreshCw size={15} />
              Enviar outra mensagem
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {status === "error" && (
              <div className="contact-error-banner" role="alert">
                <AlertCircle size={18} className="contact-error-banner-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Field: Nome */}
            <div className="contact-field-group">
              <label htmlFor="contact-name" className="contact-label">
                Nome <span className="contact-required">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Seu nome ou empresa"
                value={formData.name}
                onChange={handleChange}
                disabled={status === "submitting"}
                className={`contact-input ${
                  errors.name ? "contact-input-error" : ""
                }`}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="contact-field-error">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Field: Contato (E-mail / Telefone / Rede Social) */}
            <div className="contact-field-group">
              <label htmlFor="contact-field" className="contact-label">
                Contato <span className="contact-required">*</span>
              </label>
              <input
                id="contact-field"
                name="contact"
                type="text"
                placeholder="seu@email.com / (88) 99999-9999 / @seuinstagram"
                value={formData.contact}
                onChange={handleChange}
                disabled={status === "submitting"}
                className={`contact-input ${
                  errors.contact ? "contact-input-error" : ""
                }`}
                aria-invalid={Boolean(errors.contact)}
                aria-describedby={errors.contact ? "contact-error" : undefined}
              />
              {errors.contact && (
                <span id="contact-error" className="contact-field-error">
                  {errors.contact}
                </span>
              )}
            </div>

            {/* Field: Assunto */}
            <div className="contact-field-group">
              <label htmlFor="contact-subject" className="contact-label">
                Assunto <span className="contact-required">*</span>
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="Motivo do contato (ex: Proposta, Freelance, Dúvida)"
                value={formData.subject}
                onChange={handleChange}
                disabled={status === "submitting"}
                className={`contact-input ${
                  errors.subject ? "contact-input-error" : ""
                }`}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? "subject-error" : undefined}
              />
              {errors.subject && (
                <span id="subject-error" className="contact-field-error">
                  {errors.subject}
                </span>
              )}
            </div>

            {/* Field: Mensagem */}
            <div className="contact-field-group">
              <label htmlFor="contact-message" className="contact-label">
                Mensagem <span className="contact-required">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Escreva sua mensagem aqui com detalhes..."
                value={formData.message}
                onChange={handleChange}
                disabled={status === "submitting"}
                className={`contact-textarea ${
                  errors.message ? "contact-input-error" : ""
                }`}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <span id="message-error" className="contact-field-error">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="button button-primary contact-submit-btn"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={18} className="contact-spinner" />
                  <span>Enviando mensagem...</span>
                </>
              ) : (
                <>
                  <span>Enviar mensagem</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
