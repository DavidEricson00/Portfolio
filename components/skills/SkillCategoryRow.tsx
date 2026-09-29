"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Technology, TechnologyCategory } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";
import { SkillItem } from "./SkillItem";

export type SkillCategoryRowProps = {
  category: TechnologyCategory;
  technologies: Technology[];
  direction: "left-to-right" | "right-to-left";
  onSelectTechnology?: (technology: Technology) => void;
};

export type GetHasDragged = () => boolean;

export function SkillCategoryRow({
  category,
  technologies,
  direction,
  onSelectTechnology,
}: SkillCategoryRowProps) {
  const config = technologyCategoryConfig[category];
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false); 

  const posRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const lastPointerXRef = useRef(0);
  const pointerDownXRef = useRef(0); 

  const updateMetrics = useCallback(() => {
    if (singleSetRef.current) {
      const width = singleSetRef.current.offsetWidth;
      if (width > 0) {
        singleSetWidthRef.current = width;
      }
    }
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [updateMetrics, technologies]);

  useEffect(() => {
    if (direction === "left-to-right" && singleSetWidthRef.current > 0) {
      posRef.current = -singleSetWidthRef.current / 2;
    }
  }, [direction]);

  useEffect(() => {
    const speedPxPerSec = 28;

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSec = Math.min((time - lastTimeRef.current) / 1000, 0.1);
        const shouldAutoMove = !isHovered && !isDraggingRef.current;

        if (shouldAutoMove) {
          const moveDelta =
            (direction === "left-to-right" ? speedPxPerSec : -speedPxPerSec) * deltaSec;
          posRef.current += moveDelta;
        }

        const singleWidth = singleSetWidthRef.current;
        if (singleWidth > 0) {
          if (posRef.current <= -singleWidth) {
            posRef.current += singleWidth;
          } else if (posRef.current >= 0) {
            posRef.current -= singleWidth;
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
        }
      }

      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [direction, isHovered]);

  // Pointer drag handlers atualizados
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    lastPointerXRef.current = e.clientX;
    pointerDownXRef.current = e.clientX;
    // Removido setPointerCapture para permitir que os cliques fluam para os botões filhos
  };

  const DRAG_THRESHOLD_PX = 4;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault(); // Impede seleção de texto acidental enquanto arrasta
    
    const deltaX = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;

    if (!hasDraggedRef.current) {
      const totalDelta = Math.abs(e.clientX - pointerDownXRef.current);
      if (totalDelta >= DRAG_THRESHOLD_PX) {
        hasDraggedRef.current = true;
      }
    }

    posRef.current += deltaX;

    const singleWidth = singleSetWidthRef.current;
    if (singleWidth > 0) {
      if (posRef.current <= -singleWidth) posRef.current += singleWidth;
      else if (posRef.current >= 0) posRef.current -= singleWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUpOrCancel = () => {
    isDraggingRef.current = false;
  };

  const getHasDragged = useCallback(() => {
    const was = hasDraggedRef.current;
    if (was) hasDraggedRef.current = false;
    return was;
  }, []);

  // Usa onClickCapture (Fase de Captura) para barrar o clique de descer pro botão se tiver arrastado
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  return (
    <div
      className="skill-category-row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ "--row-accent": config?.accentColor ?? "var(--primary)" } as React.CSSProperties}
    >
      <div className="skill-category-header">
        <div className="skill-category-title-group">
          <span className="skill-category-dot" aria-hidden="true" />
          <h3 className="skill-category-name">{config?.label ?? category}</h3>
          <span className="skill-category-count">{technologies.length}</span>
        </div>
      </div>

      <div
        className="skill-marquee-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        onPointerLeave={handlePointerUpOrCancel} // Cancela o drag se o mouse sair da faixa
        onClickCapture={handleClickCapture} // Substitui onClick normal por capture
      >
        <div className="skill-fade-mask skill-fade-left" aria-hidden="true" />
        <div className="skill-fade-mask skill-fade-right" aria-hidden="true" />

        <div ref={trackRef} className="skill-marquee-track">
          {[1, 2, 3, 4].map((setNum) => (
            <div
              key={setNum}
              ref={setNum === 1 ? singleSetRef : null}
              className="skill-set"
              aria-hidden={setNum !== 1 ? "true" : undefined}
            >
              {technologies.map((tech) => (
                <SkillItem
                  key={`${tech.id}-${setNum}`}
                  technology={tech}
                  onClick={onSelectTechnology}
                  getHasDragged={getHasDragged}
                  isClone={setNum !== 1}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}