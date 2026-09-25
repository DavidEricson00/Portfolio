"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { TechnologyCategory, Technology } from "@/types/technology";
import { technologies } from "@/data/technologies.mock";
import { SkillCategoryRow } from "./SkillCategoryRow";
import { MoveHorizontal } from "lucide-react";

const CATEGORY_ROWS: {
  category: TechnologyCategory;
  direction: "left-to-right" | "right-to-left";
}[] = [
  { category: "frontend", direction: "left-to-right" },
  { category: "backend", direction: "right-to-left" },
  { category: "banco_dados_orm", direction: "left-to-right" },
  { category: "cloud_devops", direction: "right-to-left" },
  { category: "ferramentas_outros", direction: "left-to-right" },
];

export function SkillsSection() {
  const technologiesByCategory = useMemo(() => {
    const map = new Map<TechnologyCategory, Technology[]>();

    CATEGORY_ROWS.forEach(({ category }) => {
      map.set(
        category,
        technologies.filter((tech) => tech.category === category)
      );
    });

    return map;
  }, []);

  const handleSelectTechnology = (tech: Technology) => {
    // Reusing the selection behavior (e.g. scroll to projects or filter)
    const projectsSection = document.getElementById("projetos");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="habilidades" className="skills-section">
      <div className="skills-container">
        {/* Section Header */}
        <motion.header
          className="skills-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="skills-eyebrow">STACK & DOMÍNIO TÉCNICO</p>
          <h2 className="skills-title">Habilidades</h2>
          <div className="projects-swiper-drag-hint" aria-hidden="true">
            <MoveHorizontal size={15} />
          <span>Arraste para explorar</span>
        </div>
        </motion.header>

        {/* Categories Marquee Rows */}
        <motion.div
          className="skills-rows-wrapper"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {CATEGORY_ROWS.map(({ category, direction }) => {
            const list = technologiesByCategory.get(category) ?? [];
            if (list.length === 0) return null;

            return (
              <SkillCategoryRow
                key={category}
                category={category}
                technologies={list}
                direction={direction}
                onSelectTechnology={handleSelectTechnology}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
