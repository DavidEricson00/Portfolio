"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  technologyCategoryConfig,
  type Technology,
  type TechnologyCategory,
} from "@/types/technology";
import { technologies } from "@/data/technologies.mock";
import { SkillCategoryRow } from "./SkillCategoryRow";
import { MoveHorizontal } from "lucide-react";
import "./skills.css";

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
  const router = useRouter();

  const technologiesByCategory = useMemo(() => {
    const map = new Map<TechnologyCategory, typeof technologies>();
    const featuredTechnologies = technologies.filter((tech) => tech.featured);

    CATEGORY_ROWS.forEach(({ category }) => {
      map.set(
        category,
        featuredTechnologies.filter((tech) => tech.category === category)
      );
    });

    return map;
  }, []);

  const handleSelectTechnology = (tech: Technology) => {
    router.push(`/projetos?tech=${encodeURIComponent(tech.id)}`);
  };

  return (
    <section id="habilidades" className="home-section skills-section">
      <div className="home-section-container">

        <motion.header
          className="home-section-header"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="home-section-eyebrow">
            STACK & DOMÍNIO TÉCNICO
          </p>

          <div className="home-section-header-row">
            <h2 className="home-section-title">Habilidades</h2>

            <div className="skills-drag-hint" aria-hidden="true">
              <MoveHorizontal size={15} />
              <span>Arraste para explorar</span>
            </div>
          </div>
        </motion.header>

        <div className="sr-only">
          <h3>Tecnologias utilizadas</h3>

          {CATEGORY_ROWS.map(({ category }) => {
            const list = technologiesByCategory.get(category) ?? [];

            if (list.length === 0) return null;

            return (
              <div key={category}>
                <h4>
                  {technologyCategoryConfig[category]?.label ?? category}
                </h4>

                <ul>
                  {list.map((tech) => (
                    <li key={tech.id}>
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <motion.div
          className="skills-rows-wrapper"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.5,
            delay: 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
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