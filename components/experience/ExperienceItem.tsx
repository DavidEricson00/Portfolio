"use client";

import { motion } from "motion/react";
import type { ExperienceWithTechnologies } from "@/types/experience";
import { formatExperiencePeriod } from "@/lib/experience";
import { TechnologyPill } from "./TechnologyPill";

export type ExperienceItemProps = {
  experience: ExperienceWithTechnologies;
  index: number;
  isLast?: boolean;
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function ExperienceItem({
  experience,
  isLast = false,
}: ExperienceItemProps) {
  const periodFormatted = formatExperiencePeriod(
    experience.startDate,
    experience.endDate
  );

  return (
    <motion.article
      variants={itemVariants}
      className="experience-item"
    >
      {/* Node & Connecting Line */}
      <div className="experience-node-column" aria-hidden="true">
        <div className="experience-node-marker">
          <span className="experience-node-dot" />
          <span className="experience-node-glow" />
        </div>
        {!isLast && <div className="experience-node-line" />}
      </div>

      {/* Content Body (Lightweight & Integrated, not a heavy card) */}
      <div className="experience-content">
        <header className="experience-item-header">
          <div className="experience-item-meta">
            <time className="experience-item-period">{periodFormatted}</time>
          </div>

          <h3 className="experience-item-role">{experience.role}</h3>

          <div className="experience-item-company-info">
            <span className="experience-item-company">{experience.company}</span>
            {experience.location && (
              <span className="experience-item-location">
                <span className="experience-sep">•</span>
                {experience.location}
              </span>
            )}
          </div>
        </header>

        <ul className="experience-item-points">
          {experience.points.map((point, i) => (
            <li key={i} className="experience-point-row">
              <span className="experience-point-icon" aria-hidden="true">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                </svg>
              </span>
              <span className="experience-point-description">{point}</span>
            </li>
          ))}
        </ul>

        {experience.technologies.length > 0 && (
          <div className="experience-item-tech">
            <div className="experience-tech-wrap">
              {experience.technologies.map((tech) => (
                <TechnologyPill key={tech.id} technology={tech} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
