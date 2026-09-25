"use client";

import { motion } from "motion/react";
import type { ExperienceWithTechnologies } from "@/types/experience";
import { sortExperiencesChronologically } from "@/lib/experience";
import { ExperienceItem } from "./ExperienceItem";

export type ExperienceTimelineProps = {
  experiences: ExperienceWithTechnologies[];
};

const timelineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.1,
    },
  },
};

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const sortedExperiences = sortExperiencesChronologically(experiences);

  return (
    <motion.div
      className="experience-timeline"
      variants={timelineVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {sortedExperiences.map((exp, index) => (
        <ExperienceItem
          key={exp.id}
          experience={exp}
          index={index}
          isLast={index === sortedExperiences.length - 1}
        />
      ))}
    </motion.div>
  );
}
