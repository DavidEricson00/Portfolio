"use client";

import { motion } from "motion/react";
import { ContactForm } from "./ContactForm";
import { ContactChannels } from "./ContactChannels";

export function ContactSection() {
  return (
    <section id="contato" className="contact-section">
      <div className="contact-container">
        {/* Section Header */}
        <motion.header
          className="contact-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="contact-eyebrow">VAMOS CONVERSAR?</p>
          <div className="contact-header-row">
            <h2 className="contact-main-title">Contato</h2>
          </div>
          <p className="contact-subtitle-desc">
            Procura alguém para desenvolver uma aplicação, API ou solução para um
            problema específico? Me conte sobre o projeto, a oportunidade ou o que você
            precisa construir.
          </p>
        </motion.header>

        {/* 2-Column Grid on Desktop / Stacked on Mobile */}
        <motion.div
          className="contact-grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="contact-form-column">
            <ContactForm />
          </div>

          <div className="contact-channels-column">
            <ContactChannels />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
