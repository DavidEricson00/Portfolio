"use client";

import type { Technology } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";

export type SkillItemProps = {
  technology: Technology;
  onClick?: (technology: Technology) => void;
};

export function SkillItem({ technology, onClick }: SkillItemProps) {
  const config = technologyCategoryConfig[technology.category];

  return (
    <button
      type="button"
      className="skill-item"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(technology);
      }}
      title={`Ver projetos com ${technology.name}`}
      aria-label={technology.name}
      style={
        {
          "--tech-accent": config?.accentColor ?? "var(--primary)",
          "--tech-hover-border":
            config?.hoverBorder ?? "rgba(108, 140, 255, 0.4)",
          "--tech-hover-bg": config?.hoverBg ?? "rgba(108, 140, 255, 0.1)",
        } as React.CSSProperties
      }
    >
      <div className="skill-item-icon-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={technology.iconUrl}
          alt={technology.name}
          className="skill-item-icon"
          loading="lazy"
          width={32}
          height={32}
        />
      </div>
    </button>
  );
}
