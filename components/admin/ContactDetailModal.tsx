"use client";

import { useEffect } from "react";
import {
  X,
  Mail,
  User,
  Calendar,
  Trash2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import type { ContactMessage } from "@/types/contact";
import { formatContactDate } from "@/lib/data/contacts";

interface ContactDetailModalProps {
  isOpen: boolean;
  contact: ContactMessage | null;
  onClose: () => void;
  onDelete: (contact: ContactMessage) => void;
}

export function ContactDetailModal({
  isOpen,
  contact,
  onClose,
  onDelete,
}: ContactDetailModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !contact) return null;

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.contact.trim());
  const isPhone = /^[+]?[(]?[0-9]{2,4}[)]?[-\s./0-9]*$/.test(
    contact.contact.trim(),
  );

  return (
    <div
      className="admin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="admin-modal-card admin-modal-card-lg">
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="admin-inbox-avatar"
              style={{ width: 36, height: 36, fontSize: "0.88rem" }}
            >
              {contact.name.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="admin-modal-title" style={{ fontSize: "1.1rem" }}>
                {contact.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="admin-modal-close-btn"
            onClick={onClose}
            aria-label="Fechar detalhes"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="admin-modal-body admin-contact-modal-body">
          {/* Metadata Cards */}
          <div className="admin-contact-detail-meta-box">
            <div className="admin-contact-meta-item">
              <span className="admin-contact-meta-label">
                <User size={12} style={{ display: "inline", marginRight: 4 }} />
                Remetente
              </span>
              <span className="admin-contact-meta-val">{contact.name}</span>
            </div>

            <div className="admin-contact-meta-item">
              <span className="admin-contact-meta-label">
                <Mail size={12} style={{ display: "inline", marginRight: 4 }} />
                Forma de Contato
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="admin-contact-meta-val admin-contact-meta-val-highlight">
                  {contact.contact}
                </span>

                {isEmail && (
                  <a
                    href={`mailto:${contact.contact}?subject=Re: ${encodeURIComponent(
                      contact.subject,
                    )}`}
                    className="admin-action-btn"
                    style={{ width: 24, height: 24 }}
                    title="Enviar e-mail de resposta"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}

                {isPhone && (
                  <a
                    href={`tel:${contact.contact}`}
                    className="admin-action-btn"
                    style={{ width: 24, height: 24 }}
                    title="Ligar"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            <div className="admin-contact-meta-item">
              <span className="admin-contact-meta-label">
                <Calendar
                  size={12}
                  style={{ display: "inline", marginRight: 4 }}
                />
                Recebido em
              </span>
              <span className="admin-contact-meta-val">
                {formatContactDate(contact.createdAt)}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div className="admin-contact-message-section">
            <span className="admin-contact-section-label">
              <MessageSquare size={13} />
              Assunto
            </span>
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "#ffffff",
                padding: "8px 0",
              }}
            >
              {contact.subject}
            </div>
          </div>

          {/* Message Body */}
          <div className="admin-contact-message-section">
            <span className="admin-contact-section-label">
              Mensagem Completa
            </span>
            <div className="admin-contact-message-box">{contact.message}</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={() => {
              onDelete(contact);
            }}
          >
            <Trash2 size={16} />
            <span>Excluir</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
