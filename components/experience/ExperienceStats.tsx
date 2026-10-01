"use client";

import { motion } from "motion/react";
import type { Experience } from "@/types/experience";
import {
  calculateExperienceMonths,
  formatExperienceDuration,
} from "@/lib/experience";

export type ExperienceStatsProps = {
  experiences: Experience[];
};

export function ExperienceStats({ experiences }: ExperienceStatsProps) {
  const totalMonths = calculateExperienceMonths(experiences);
  const formatted = formatExperienceDuration(totalMonths);

  return (
    <div
      className="home-section-badge experience-duration-badge"
      aria-label={`Total de experiência: ${formatted}`}
    >
      <span className="home-section-badge-dot" aria-hidden="true" />

      <span className="experience-duration-text">
        <motion.strong
          className="home-section-badge-highlight"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {formatted}
        </motion.strong>{" "}
        de experiência acumulada
      </span>
    </div>
  );
}