"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Calendar,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import type { Education } from "@/types/education";
import { EducationIcon } from "./EducationIcon";

export type EducationCardProps = {
  education: Education;
  isExpanded: boolean;
  onToggle: () => void;
};

export function EducationCard({
  education,
  isExpanded,
  onToggle,
}: EducationCardProps) {
  const periodText = education.endDate
    ? `${education.startDate} — ${education.endDate}`
    : `${education.startDate} — Atual`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <motion.article
      layout="position"
      className={`education-card ${isExpanded ? "education-card-expanded" : ""}`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-controls={`education-details-${education.id}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Closed / Main Card Header */}
      <div className="education-card-header">
        <div className="education-card-lead">
          {/* Icon Badge */}
          <div className="education-icon-box" aria-hidden="true">
            <EducationIcon type={education.type} size={22} />
          </div>

          {/* Core Info */}
          <div className="education-lead-info">
            <div className="education-title-row">
              <h3 className="education-title">{education.title}</h3>
            </div>

            <p className="education-institution">{education.institution}</p>

            {/* Compact meta pill badges */}
            <div className="education-meta-row">
              <span className="education-meta-pill">
                <Calendar size={13} className="education-meta-icon" />
                <time>{periodText}</time>
              </span>

              {education.status && (
                <span
                  className={`education-status-pill ${
                    education.status.toLowerCase().includes("andamento")
                      ? "status-in-progress"
                      : "status-completed"
                  }`}
                >
                  <span className="education-status-dot" />
                  {education.status}
                </span>
              )}

              {education.workload && (
                <span className="education-meta-pill education-workload-pill">
                  <Clock size={13} className="education-meta-icon" />
                  <span>{education.workload}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Indicator Button */}
        <div
          className={`education-chevron-btn ${
            isExpanded ? "education-chevron-active" : ""
          }`}
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </div>
      </div>

      {/* Expandable Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`education-details-${education.id}`}
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25, delay: 0.08 },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.15 },
              },
            }}
            className="education-card-expanded-body"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="education-divider" />

            <div className="education-details-grid">
              {/* Optional Description / Program Banner */}
              {education.description && (
                <div className="education-program-banner">
                  <span className="education-program-badge">
                    <Sparkles size={14} />
                    <span>Programa</span>
                  </span>
                  <p className="education-program-text">{education.description}</p>
                </div>
              )}

              {/* Extra Meta Grid (Area / Grade / Workload if present) */}
              {(education.area || education.grade) && (
                <div className="education-specs-row">
                  {education.area && (
                    <div className="education-spec-item">
                      <span className="education-spec-label">Área de estudo</span>
                      <span className="education-spec-value">{education.area}</span>
                    </div>
                  )}

                  {education.grade && (
                    <div className="education-spec-item">
                      <span className="education-spec-label">Média Acadêmica</span>
                      <span className="education-spec-value education-grade-highlight">
                        {education.grade}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Highlights List */}
              {education.highlights && education.highlights.length > 0 && (
                <div className="education-highlights-group">
                  <h4 className="education-subtitle">
                    <Layers size={15} className="education-subtitle-icon" />
                    Principais Conteúdos & Destaques
                  </h4>
                  <ul className="education-highlights-list">
                    {education.highlights.map((highlight, idx) => (
                      <li key={idx} className="education-highlight-item">
                        <span className="education-highlight-dot" aria-hidden="true" />
                        <span className="education-highlight-text">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
