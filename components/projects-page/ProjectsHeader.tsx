"use client";

import { motion } from "motion/react";

export function ProjectsHeader() {
  return (
    <motion.header
      className="projects-page-header"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <h1 className="projects-page-title">Projetos</h1>
      <p className="projects-page-description">
        Explore a coleção completa de aplicações, microsserviços, automações e sistemas
        que venho desenvolvendo. Filtre por tecnologia ou busque pelo nome.
      </p>
    </motion.header>
  );
}
