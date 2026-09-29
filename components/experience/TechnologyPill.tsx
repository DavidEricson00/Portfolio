"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { Technology } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";
import "./technology-pill.css";

export type TechnologyPillProps = {
  technology: Technology;
  onClick?: (technology: Technology) => void;
};

export function TechnologyPill({ technology, onClick }: TechnologyPillProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const config = technologyCategoryConfig[technology.category];
  const initial = technology.name ? technology.name.charAt(0).toUpperCase() : "?";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(technology);
    } else {
      router.push(`/projetos?tech=${encodeURIComponent(technology.id)}`);
    }
  };

  return (
    <motion.button
      type="button"
      className="tech-pill"
      onClick={handleClick}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      title={`Ver projetos com ${technology.name}`}
      style={
        {
          "--tech-accent": config?.accentColor ?? "var(--primary)",
          "--tech-hover-border":
            config?.hoverBorder ?? "rgba(108, 140, 255, 0.45)",
          "--tech-hover-bg": config?.hoverBg ?? "rgba(108, 140, 255, 0.1)",
        } as React.CSSProperties
      }
    >
      {!imageError && technology.iconUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={technology.iconUrl}
          alt=""
          aria-hidden="true"
          className="tech-pill-icon"
          loading="lazy"
          width={14}
          height={14}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="tech-pill-fallback-icon" aria-hidden="true">
          {initial}
        </span>
      )}
      <span className="tech-pill-name">{technology.name}</span>
    </motion.button>
  );
}
