"use client";

import { useState } from "react";
import {
  Code,
  Eye,
  Columns,
  Heading,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Quote,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/projects/MarkdownRenderer";
import "@/components/projects/project-detail.css";

export type MarkdownEditorMode = "markdown" | "preview" | "split";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string | number;
  disabled?: boolean;
  label?: string;
}

export function MarkdownEditor({
  value = "",
  onChange,
  placeholder = "Digite o conteúdo em formato Markdown...",
  minHeight = 260,
  disabled = false,
  label,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<MarkdownEditorMode>("markdown");

  function insertFormat(prefix: string, suffix: string = "") {
    if (disabled) return;
    onChange(`${value}\n${prefix}Texto${suffix}`);
  }

  return (
    <div className="admin-md-editor-container">
      {/* Editor Header Bar */}
      <div className="admin-md-editor-header">
        <div className="admin-md-editor-title-row">
          {label && <span className="admin-md-editor-label">{label}</span>}

          {/* Markdown Action Shortcuts (only shown in markdown or split mode) */}
          {mode !== "preview" && (
            <div className="admin-md-editor-toolbar" role="toolbar" aria-label="Ações de formatação Markdown">
              <button
                type="button"
                className="admin-md-toolbar-btn"
                onClick={() => insertFormat("### ")}
                disabled={disabled}
                title="Título (H3)"
              >
                <Heading size={14} />
              </button>

              <button
                type="button"
                className="admin-md-toolbar-btn"
                onClick={() => insertFormat("**", "**")}
                disabled={disabled}
                title="Negrito"
              >
                <Bold size={14} />
              </button>

              <button
                type="button"
                className="admin-md-toolbar-btn"
                onClick={() => insertFormat("*", "*")}
                disabled={disabled}
                title="Itálico"
              >
                <Italic size={14} />
              </button>

              <button
                type="button"
                className="admin-md-toolbar-btn"
                onClick={() => insertFormat("- ")}
                disabled={disabled}
                title="Lista"
              >
                <List size={14} />
              </button>

              <button
                type="button"
                className="admin-md-toolbar-btn"
                onClick={() => insertFormat("[", "](https://)")}
                disabled={disabled}
                title="Link"
              >
                <LinkIcon size={14} />
              </button>

              <button
                type="button"
                className="admin-md-toolbar-btn"
                onClick={() => insertFormat("> ")}
                disabled={disabled}
                title="Citação"
              >
                <Quote size={14} />
              </button>

              <button
                type="button"
                className="admin-md-toolbar-btn"
                onClick={() => insertFormat("```ts\n// código\n", "```")}
                disabled={disabled}
                title="Bloco de código"
              >
                <Code size={14} />
              </button>
            </div>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="admin-md-mode-switch">
          <button
            type="button"
            className={`admin-md-mode-btn ${
              mode === "markdown" ? "admin-md-mode-btn-active" : ""
            }`}
            onClick={() => setMode("markdown")}
            title="Modo Markdown (Editor)"
          >
            <Code size={14} />
            <span>Markdown</span>
          </button>

          <button
            type="button"
            className={`admin-md-mode-btn ${
              mode === "preview" ? "admin-md-mode-btn-active" : ""
            }`}
            onClick={() => setMode("preview")}
            title="Modo Preview (Visualização)"
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            className={`admin-md-mode-btn ${
              mode === "split" ? "admin-md-mode-btn-active" : ""
            }`}
            onClick={() => setMode("split")}
            title="Modo Dividido (Lado a Lado)"
          >
            <Columns size={14} />
            <span>Dividido</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div
        className={`admin-md-editor-body admin-md-mode-${mode}`}
        style={{ minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }}
      >
        {/* Textarea for Markdown editing */}
        {(mode === "markdown" || mode === "split") && (
          <div className="admin-md-textarea-pane">
            <textarea
              className="admin-md-textarea"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              spellCheck={false}
            />
          </div>
        )}

        {/* Split Divider */}
        {mode === "split" && <div className="admin-md-split-divider" />}

        {/* Preview pane */}
        {(mode === "preview" || mode === "split") && (
          <div className="admin-md-preview-pane">
            {value.trim() ? (
              <MarkdownRenderer content={value} className="admin-md-rendered" />
            ) : (
              <div className="admin-md-preview-empty">
                <span>Nenhum conteúdo para visualização. Digite Markdown no editor.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
