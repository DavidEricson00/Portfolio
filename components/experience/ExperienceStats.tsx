"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "motion/react";
import type { Experience } from "@/types/experience";
import {
  calculateExperienceMonths,
  formatExperienceDuration,
} from "@/lib/experience";

export type ExperienceStatsProps = {
  experiences: Experience[];
};

export function ExperienceStats({ experiences }: ExperienceStatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  const totalMonths = calculateExperienceMonths(experiences);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, totalMonths, {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setCount(Math.round(latest));
        },
      });

      return () => controls.stop();
    }
  }, [isInView, totalMonths]);

  const formatted = formatExperienceDuration(count);

  return (
    <div
      ref={ref}
      className="home-section-badge experience-duration-badge"
      aria-label={`Total de experiência: ${formatted}`}
    >
      <span className="home-section-badge-dot" aria-hidden="true" />
      <span className="experience-duration-text">
        <strong className="home-section-badge-highlight">{formatted}</strong> de
        experiência acumulada
      </span>
    </div>
  );
}
