"use client";

import { Plus, Trash2 } from "lucide-react";

export interface DynamicTextListProps {
  label?: string;
  description?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function DynamicTextList({
  label,
  description,
  items = [],
  onChange,
  placeholder = "Digite o texto...",
  addButtonText = "Adicionar item",
  emptyText = "Nenhum item adicionado até o momento.",
  disabled = false,
}: DynamicTextListProps) {
  function handleItemChange(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function handleAddItem() {
    onChange([...items, ""]);
  }

  function handleRemoveItem(index: number) {
    const next = items.filter((_, idx) => idx !== index);
    onChange(next);
  }

  return (
    <div className="admin-dynamic-list-container">
      {label && (
        <div className="admin-dynamic-list-header">
          <label className="admin-form-label">
            <span>{label}</span>
          </label>
          {description && (
            <span className="admin-dynamic-list-desc">{description}</span>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="admin-dynamic-list-empty">
          <span>{emptyText}</span>
        </div>
      ) : (
        <div className="admin-dynamic-list-items">
          {items.map((item, index) => (
            <div key={index} className="admin-dynamic-list-row">
              <input
                type="text"
                className="admin-form-input admin-dynamic-list-input"
                placeholder={placeholder}
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                disabled={disabled}
              />
              <button
                type="button"
                className="admin-action-btn admin-action-btn-delete admin-dynamic-list-del-btn"
                onClick={() => handleRemoveItem(index)}
                disabled={disabled}
                title="Remover item"
                aria-label={`Remover item ${index + 1}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="admin-btn admin-btn-secondary admin-dynamic-list-add-btn"
        onClick={handleAddItem}
        disabled={disabled}
      >
        <Plus size={16} />
        <span>{addButtonText}</span>
      </button>
    </div>
  );
}
