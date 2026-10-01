"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Education } from "@/types/education";
import { EducationCard } from "./EducationCard";
import "./education.css";

type EducationSectionProps = {
  educations: Education[];
};

export function EducationSection({
  educations,
}: EducationSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <section id="formacao" className="home-section education-section">
      <div className="home-section-container">
        <motion.header
          className="home-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <p className="home-section-eyebrow">
            TRAJETÓRIA & QUALIFICAÇÕES
          </p>

          <div className="home-section-header-row">
            <h2 className="home-section-title">
              Formação
            </h2>

            <div className="home-section-badge education-count-badge">
              <span className="home-section-badge-dot" />
              <span>{educations.length} Formações</span>
            </div>
          </div>
        </motion.header>

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