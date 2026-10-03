"use client";

import { useEffect } from "react";
import { Save } from "lucide-react";

interface ConfirmSaveModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmSaveModal({
  isOpen,
  title = "Salvar alterações?",
  message,
  itemName,
  loading = false,
  onClose,
  onConfirm,
}: ConfirmSaveModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !loading) {
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
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="admin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="admin-modal-card admin-confirm-card">
        <div className="admin-confirm-icon-wrap admin-confirm-save-icon-wrap">
          <Save size={28} />
        </div>

        <h2 className="admin-confirm-title">{title}</h2>

        <p className="admin-confirm-desc">
          {message || (
            <>
              Deseja realmente aplicar e salvar as alterações realizadas{" "}
              {itemName ? (
                <>
                  em <strong>{itemName}</strong>
                </>
              ) : (
                "neste registro"
              )}
              ?
            </>
          )}
        </p>

        <div
          className="admin-modal-footer"
          style={{ justifyContent: "center", borderTop: "none", padding: 0 }}
        >
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  className="admin-loading-spinner"
                  style={{ width: 16, height: 16, borderWidth: 2 }}
                />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Confirmar e salvar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
