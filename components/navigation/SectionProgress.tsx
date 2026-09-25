"use client";

import { useEffect, useState, useCallback } from "react";
import { HOME_SECTIONS } from "@/data/navigation.mock";

export function SectionProgress() {
  const [activeSection, setActiveSection] = useState<string>("inicio");

  const updateActiveSection = useCallback(() => {
    // Window scroll position with trigger offset at 35% of viewport height
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = window.innerHeight + window.scrollY >= documentHeight - 80;

    if (isAtBottom) {
      setActiveSection("contato");
      return;
    }

    let current = HOME_SECTIONS[0].id;

    for (const section of HOME_SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) {
        // Calculate the absolute top offset of the section
        const sectionTop = el.getBoundingClientRect().top + window.scrollY;
        if (scrollPosition >= sectionTop) {
          current = section.id;
        }
      }
    }

    setActiveSection(current);
  }, []);

  useEffect(() => {
    updateActiveSection();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [updateActiveSection]);

  const activeIndex = HOME_SECTIONS.findIndex((s) => s.id === activeSection);
  const effectiveIndex = activeIndex === -1 ? 0 : activeIndex;
  const progressPercent =
    HOME_SECTIONS.length > 1
      ? (effectiveIndex / (HOME_SECTIONS.length - 1)) * 100
      : 0;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="sidebar-timeline"
      aria-label="Navegação e progresso das seções"
    >
      <div className="sidebar-timeline-container">
        {/* Continuous Progress Line Track positioned behind the dots on the right */}
        <div className="sidebar-timeline-track" aria-hidden="true">
          <div
            className="sidebar-timeline-fill"
            style={{ height: `${progressPercent}%` }}
          />
        </div>

        {/* Section List: Names on the left, Dots on the right */}
        <ul className="sidebar-timeline-list">
          {HOME_SECTIONS.map((section, index) => {
            const isActive = section.id === activeSection;
            const isCompleted = index < effectiveIndex;

            return (
              <li key={section.id} className="sidebar-timeline-item">
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={`sidebar-timeline-btn ${
                    isActive
                      ? "sidebar-btn-active"
                      : isCompleted
                      ? "sidebar-btn-completed"
                      : "sidebar-btn-pending"
                  }`}
                  aria-label={`Ir para a seção ${section.label}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="sidebar-timeline-label">{section.label}</span>

                  <span className="sidebar-timeline-dot-wrap">
                    <span className="sidebar-timeline-dot" />
                    {isActive && <span className="sidebar-timeline-glow" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
