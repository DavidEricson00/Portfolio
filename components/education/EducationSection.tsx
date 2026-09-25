"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { educations } from "@/data/education.mock";
import { EducationCard } from "./EducationCard";

export function EducationSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <section id="formacao" className="education-section">
      <div className="education-container">
        {/* Section Header */}
        <motion.header
          className="education-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="education-eyebrow">TRAJETÓRIA & QUALIFICAÇÕES</p>
          <div className="education-header-row">
            <h2 className="education-main-title">Formação</h2>
            <div className="education-count-badge">
              <span className="education-count-dot" />
              <span>{educations.length} Formações</span>
            </div>
          </div>
          <p className="education-subtitle-desc">
            Formação acadêmica em Sistemas de Informação, especializações e
            residência técnica fullstack.
          </p>
        </motion.header>

        {/* Education Cards Accordion List */}
        <div className="education-list">
          {educations.map((item) => (
            <EducationCard
              key={item.id}
              education={item}
              isExpanded={expandedId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
