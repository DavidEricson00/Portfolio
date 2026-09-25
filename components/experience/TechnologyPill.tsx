"use client";

import { motion } from "motion/react";
import type { Technology } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";

export type TechnologyPillProps = {
  technology: Technology;
  onClick?: (technology: Technology) => void;
};

export function TechnologyPill({ technology, onClick }: TechnologyPillProps) {
  const config = technologyCategoryConfig[technology.category];

  return (
    <motion.button
      type="button"
      className="tech-pill"
      onClick={() => onClick?.(technology)}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={`Ver projetos com ${technology.name}`}
      style={
        {
          "--tech-accent": config?.accentColor ?? "var(--primary)",
          "--tech-hover-border":
            config?.hoverBorder ?? "rgba(108, 140, 255, 0.4)",
          "--tech-hover-bg": config?.hoverBg ?? "rgba(108, 140, 255, 0.08)",
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={technology.iconUrl}
        alt={technology.name}
        className="tech-pill-icon"
        loading="lazy"
        width={14}
        height={14}
      />
      <span className="tech-pill-name">{technology.name}</span>
    </motion.button>
  );
}
