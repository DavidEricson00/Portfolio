"use client";

import { useRouter } from "next/navigation";
import type { Technology } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";

export type SkillItemProps = {
  technology: Technology;
  onClick?: (technology: Technology) => void;
  /** Retorna true se o marquee está num estado de drag — evita navegação acidental */
  getHasDragged?: () => boolean;
};

export function SkillItem({ technology, onClick, getHasDragged }: SkillItemProps) {
  const router = useRouter();
  const config = technologyCategoryConfig[technology.category];

  const handleClick = (e: React.MouseEvent) => {
    // Aborta o clique se o usuário estava arrastando o marquee
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
      style={
        {
          "--tech-accent": config?.accentColor ?? "var(--primary)",
          "--tech-hover-border": config?.hoverBorder ?? "rgba(108, 140, 255, 0.45)",
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
          draggable={false} // IMPORTANTE: Impede o arrasto nativo da imagem no navegador
        />
      </div>
    </button>
  );
}