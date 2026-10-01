"use client";

import { motion } from "motion/react";
import type { ExperienceWithTechnologies } from "@/types/experience";
import { ExperienceStats } from "./ExperienceStats";
import { ExperienceTimeline } from "./ExperienceTimeline";
import "./experience.css";

type ExperienceSectionProps = {
  experiences: ExperienceWithTechnologies[];
};

export function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  return (
    <section id="experiencia" className="home-section experience-section">
      <div className="home-section-container">
        {/* Section Header */}
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
            TRAJETÓRIA PROFISSIONAL
          </p>

          <div className="home-section-header-row">
            <h2 className="home-section-title">
              Experiência
            </h2>

            <ExperienceStats experiences={experiences} />
          </div>
        </motion.header>

        {/* Seamless Vertical Timeline */}
        <ExperienceTimeline experiences={experiences} />
      </div>
    </section>
  );
}