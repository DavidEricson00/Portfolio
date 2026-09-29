"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Technology } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";

export type SkillItemProps = {
  technology: Technology;
  onClick?: (technology: Technology) => void;
  getHasDragged?: () => boolean;
  isClone?: boolean;
};

export function SkillItem({
  technology,
  onClick,
  getHasDragged,
  isClone = false,
}: SkillItemProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const config = technologyCategoryConfig[technology.category];
  const initial = technology.name ? technology.name.charAt(0).toUpperCase() : "?";
  const showFallback = imageError || !technology.iconUrl;

  const handleClick = (e: React.MouseEvent) => {
    if (getHasDragged?.()) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (onClick) {
      onClick(technology);
    } else {
      router.push(`/projetos?tech=${encodeURIComponent(technology.id)}`);
    }
  };

  return (
    <button
      type="button"
      className="skill-item"
      onClick={handleClick}
      title={`Ver projetos com ${technology.name}`}
      aria-label={technology.name}
      tabIndex={isClone ? -1 : undefined}
      aria-hidden={isClone ? "true" : undefined}
      style={
        {
          "--tech-accent": config?.accentColor ?? "var(--primary)",
          "--tech-hover-border": config?.hoverBorder ?? "rgba(108, 140, 255, 0.45)",
          "--tech-hover-bg": config?.hoverBg ?? "rgba(108, 140, 255, 0.1)",
        } as React.CSSProperties
      }
    >
      <div
        className={`skill-item-icon-wrap${showFallback ? " skill-item-icon-wrap-fallback" : ""}`}
      >
        {!showFallback ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={technology.iconUrl}
            alt=""
            aria-hidden="true"
            className="skill-item-icon"
            loading="lazy"
            width={32}
            height={32}
            draggable={false}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="skill-item-fallback-icon" aria-hidden="true">
            {initial}
          </span>
        )}
      </div>
    </button>
  );
}