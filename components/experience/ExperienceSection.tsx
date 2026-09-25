"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { getExperiencesWithTechnologies } from "@/data/experience.mock";
import { ExperienceStats } from "./ExperienceStats";
import { ExperienceTimeline } from "./ExperienceTimeline";

export function ExperienceSection() {
  const experiences = useMemo(() => getExperiencesWithTechnologies(), []);

  return (
    <section id="experiencia" className="experience-section">
      <div className="experience-container">
        {/* Left-aligned Modern Header */}
        <motion.header
          className="experience-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="experience-eyebrow">TRAJETÓRIA PROFISSIONAL</p>

          <div className="experience-header-row">
            <h2 className="experience-title">Experiência</h2>
          </div>
          <ExperienceStats experiences={experiences} />
        </motion.header>

        {/* Seamless Vertical Timeline */}
        <ExperienceTimeline experiences={experiences} />
      </div>
    </section>
  );
}
