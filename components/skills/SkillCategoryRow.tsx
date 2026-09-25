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

  const posRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const lastPointerXRef = useRef(0);

  // Measure single set width
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

  // Set initial position for left-to-right so it starts within the negative range
  useEffect(() => {
    if (direction === "left-to-right" && singleSetWidthRef.current > 0) {
      posRef.current = -singleSetWidthRef.current / 2;
    }
  }, [direction]);

  // Continuous Animation Loop
  useEffect(() => {
    const speedPxPerSec = 28; // Constant, smooth speed

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSec = Math.min((time - lastTimeRef.current) / 1000, 0.1);

        // Auto move when not hovered and not currently dragging
        const shouldAutoMove = !isHovered && !isDraggingRef.current;

        if (shouldAutoMove) {
          const moveDelta =
            (direction === "left-to-right" ? speedPxPerSec : -speedPxPerSec) *
            deltaSec;
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

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;

    posRef.current += deltaX;

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
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div
      className="skill-category-row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        {
          "--row-accent": config?.accentColor ?? "var(--primary)",
        } as React.CSSProperties
      }
    >
      {/* Category Header with Title and Count Badge */}
      <div className="skill-category-header">
        <div className="skill-category-title-group">
          <span className="skill-category-dot" aria-hidden="true" />
          <h3 className="skill-category-name">{config?.label ?? category}</h3>
          <span className="skill-category-count">{technologies.length}</span>
        </div>
      </div>

      {/* Marquee Viewport & Track */}
      <div
        className="skill-marquee-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
      >
        {/* Left and Right Fade Gradients */}
        <div className="skill-fade-mask skill-fade-left" aria-hidden="true" />
        <div className="skill-fade-mask skill-fade-right" aria-hidden="true" />

        <div ref={trackRef} className="skill-marquee-track">
          {/* Set 1 (measured) */}
          <div ref={singleSetRef} className="skill-set">
            {technologies.map((tech) => (
              <SkillItem
                key={`${tech.id}-1`}
                technology={tech}
                onClick={onSelectTechnology}
              />
            ))}
          </div>

          {/* Set 2 */}
          <div className="skill-set" aria-hidden="true">
            {technologies.map((tech) => (
              <SkillItem
                key={`${tech.id}-2`}
                technology={tech}
                onClick={onSelectTechnology}
              />
            ))}
          </div>

          {/* Set 3 */}
          <div className="skill-set" aria-hidden="true">
            {technologies.map((tech) => (
              <SkillItem
                key={`${tech.id}-3`}
                technology={tech}
                onClick={onSelectTechnology}
              />
            ))}
          </div>

          {/* Set 4 */}
          <div className="skill-set" aria-hidden="true">
            {technologies.map((tech) => (
              <SkillItem
                key={`${tech.id}-4`}
                technology={tech}
                onClick={onSelectTechnology}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
