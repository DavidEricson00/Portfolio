"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Project } from "@/types/project";
import { trackEvent } from "@/lib/firebase/track";

import { ProjectsSwiper } from "./ProjectsSwiper";

import "./projects.css";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({
  projects,
}: ProjectsSectionProps) {
  return (
    <section
      id="projetos"
      className="home-section projects-section"
    >
      <div className="home-section-container">
        {/* Section Header */}
        <motion.header
          className="home-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <p className="home-section-eyebrow">
            PORTFÓLIO & TRABALHOS
          </p>

          <div className="home-section-header-row">
            <h2 className="home-section-title">
              Projetos em destaque
            </h2>

            <Link
              href="/projetos"
              className="button button-secondary projects-view-all-btn"
              onClick={() => {
                void trackEvent("projects_view_all_click", {});
              }}
            >
              <span>Ver todos os projetos</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.header>

        {/* Carousel / Swiper */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.65,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ProjectsSwiper projects={projects} />
        </motion.div>
      </div>
    </section>
  );
}