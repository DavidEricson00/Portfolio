"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title = "Excluir item?",
  message,
  itemName,
  loading = false,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
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
        <div className="admin-confirm-icon-wrap">
          <AlertTriangle size={28} />
        </div>

        <h2 className="admin-confirm-title">{title}</h2>

        <p className="admin-confirm-desc">
          {message || (
            <>
              Tem certeza que deseja excluir{" "}
              {itemName ? <strong>{itemName}</strong> : "este item"}? Essa ação não
              pode ser desfeita.
            </>
          )}
        </p>

        <div className="admin-modal-footer" style={{ justifyContent: "center", borderTop: "none", padding: 0 }}>
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
            className="admin-btn admin-btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  className="admin-loading-spinner"
                  style={{ width: 16, height: 16, borderWidth: 2 }}
                />
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Excluir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
