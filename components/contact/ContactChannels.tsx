"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { contactChannels } from "@/data/contact";
import { ContactIcon } from "./ContactIcon";
import { trackEvent } from "@/lib/firebase/track";

export function ContactChannels() {
  return (
    <aside className="contact-channels-container">
      {/* Availability Status Card */}
      <div className="contact-status-badge-card">
        <div className="contact-pulse-dot" />
        <div className="contact-status-badge-info">
          <span className="contact-status-badge-title">Disponível para oportunidades</span>
          <p className="contact-status-badge-desc">
            Aberto a propostas de trabalho, projetos freelance e networking técnico.
          </p>
        </div>
      </div>

      <div className="contact-channels-list">
        <h3 className="contact-channels-heading">
          <Sparkles size={15} className="contact-channels-heading-icon" />
          Canais Diretos & Redes
        </h3>

        <div className="contact-channels-grid">
          {contactChannels.map((channel) => {

            return (
              <a
                key={channel.id}
                href={channel.href}
                target={channel.isExternal ? "_blank" : undefined}
                rel={channel.isExternal ? "noopener noreferrer" : undefined}
                className="contact-channel-card"
                onClick={() => {
                  void trackEvent("social_click", {
                    channel: channel.id as "email" | "whatsapp" | "linkedin" | "github",
                    source: "contact_section",
                  });
                }}
              >
                <div className="contact-channel-icon-wrap" aria-hidden="true">
                  <ContactIcon name={channel.icon} size={20} />
                </div>

                <div className="contact-channel-content">
                  <div className="contact-channel-header-row">
                    <span className="contact-channel-name">{channel.name}</span>
                    <ArrowUpRight size={16} className="contact-channel-arrow" />
                  </div>
                  <span className="contact-channel-value">{channel.value}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
