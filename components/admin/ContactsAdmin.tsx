"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Mail,
  Clock,
  RefreshCw,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

import type { ContactMessage } from "@/types/contact";
import {
  getContacts,
  deleteContact,
  formatContactDate,
} from "@/lib/data/contacts";
import { firebaseAuth } from "@/lib/firebase/client";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { ContactDetailModal } from "@/components/admin/ContactDetailModal";

interface ContactsAdminProps {
  initialContacts: ContactMessage[];
}

export default function ContactsAdmin({
  initialContacts = [],
}: ContactsAdminProps) {
  const [contacts, setContacts] =
    useState<ContactMessage[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedContact, setSelectedContact] =
    useState<ContactMessage | null>(null);
  const [contactToDelete, setContactToDelete] =
    useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadContacts() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err: unknown) {
      console.error("Erro ao recarregar contatos:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as mensagens de contato.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        loadContacts();
      }
    });

    return unsubscribe;
  }, []);

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return contacts;
    }

    return contacts.filter((item) => {
      const matchName = item.name.toLowerCase().includes(term);
      const matchContact = item.contact.toLowerCase().includes(term);
      const matchSubject = item.subject.toLowerCase().includes(term);
      const matchMessage = item.message.toLowerCase().includes(term);

      return (
        matchName ||
        matchContact ||
        matchSubject ||
        matchMessage
      );
    });
  }, [contacts, search]);

  async function handleDeleteContact() {
    if (!contactToDelete) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteContact(contactToDelete.id);

      setContacts((current) =>
        current.filter(
          (item) => item.id !== contactToDelete.id,
        ),
      );

      if (selectedContact?.id === contactToDelete.id) {
        setSelectedContact(null);
      }

      setContactToDelete(null);
      setSuccess("Mensagem excluída com sucesso.");
    } catch (err: unknown) {
      console.error("Erro ao excluir mensagem:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao excluir a mensagem.";

      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="admin-content">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-titles">
          <div className="admin-page-title-row">
            <h1 className="admin-page-title">Contatos</h1>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={loadContacts}
            disabled={isLoading}
            title="Atualizar caixa de entrada"
          >
            <RefreshCw
              size={16}
              className={isLoading ? "admin-spin" : ""}
            />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Counter */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search-wrapper">
            <Search size={18} className="admin-search-icon" />

            <input
              type="search"
              className="admin-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, contato, assunto ou mensagem..."
            />
          </div>
        </div>

        <div className="admin-toolbar-right">
          <span className="admin-count-badge">
            {filteredContacts.length}{" "}
            {filteredContacts.length === 1
              ? "mensagem"
              : "mensagens"}
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="admin-alert-banner">
          <div className="admin-alert-content">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Inbox List or Empty State */}
      {filteredContacts.length === 0 ? (
        <div className="admin-empty-card">
          <div className="admin-empty-icon-wrap">
            <Mail size={28} />
          </div>

          <h2 className="admin-empty-title">
            {contacts.length === 0
              ? "Não há mensagens de contato"
              : "Nenhum resultado encontrado"}
          </h2>

          <p className="admin-empty-desc">
            {contacts.length === 0
              ? "As mensagens enviadas pelo formulário público do portfólio aparecerão aqui na sua caixa de entrada."
              : "Tente alterar os termos de busca para localizar a mensagem desejada."}
          </p>

          {search && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setSearch("")}
            >
              Limpar pesquisa
            </button>
          )}
        </div>
      ) : (
        <div className="admin-inbox-list">
          {filteredContacts.map((contact) => {
            const formattedDate = formatContactDate(
              contact.createdAt,
            );

            const initial =
              contact.name.trim().charAt(0).toUpperCase() || "?";

            return (
              <div
                key={contact.id}
                className="admin-inbox-card"
                onClick={() => setSelectedContact(contact)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedContact(contact);
                  }
                }}
              >
                {/* Avatar Initial */}
                <div
                  className="admin-inbox-avatar"
                  aria-hidden="true"
                >
                  {initial}
                </div>

                {/* Main Content */}
                <div className="admin-inbox-main">
                  <div className="admin-inbox-top-row">
                    <div className="admin-inbox-sender-info">
                      <span className="admin-inbox-sender-name">
                        {contact.name}
                      </span>

                      <span className="admin-inbox-contact-pill">
                        {contact.contact}
                      </span>
                    </div>

                    <div className="admin-inbox-date">
                      <Clock size={12} />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <div className="admin-inbox-subject">
                    {contact.subject}
                  </div>

                  <p className="admin-inbox-preview line-clamp-2">
                    {contact.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="admin-inbox-actions">
                  <button
                    type="button"
                    className="admin-action-btn admin-action-btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setContactToDelete(contact);
                    }}
                    title={`Excluir mensagem de "${contact.name}"`}
                    aria-label={`Excluir mensagem de "${contact.name}"`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Success Toast */}
      {success && (
        <div className="admin-toast-container">
          <div className="admin-toast admin-toast-success">
            {success}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ContactDetailModal
        isOpen={selectedContact !== null}
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onDelete={(contact) => {
          setSelectedContact(null);
          setContactToDelete(contact);
        }}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={contactToDelete !== null}
        title="Excluir mensagem"
        message={
          contactToDelete
            ? `Tem certeza que deseja excluir a mensagem de "${contactToDelete.name}" (${contactToDelete.subject})? Essa ação não pode ser desfeita.`
            : ""
        }
        loading={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setContactToDelete(null);
          }
        }}
        onConfirm={handleDeleteContact}
      />
    </div>
  );
}