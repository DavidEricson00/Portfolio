import { contactChannels } from "@/data/contact.mock";
import { ArrowUpRight } from "lucide-react";
import "./footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        {/* Main Content Row */}
        <div className="site-footer-grid">
          {/* Left Column: Identity & Presentation */}
          <div className="site-footer-brand">
            <h3 className="site-footer-name">David Ericson</h3>
            <p className="site-footer-role">Fullstack Developer</p>
            <p className="site-footer-stack">
              Node.js <span>|</span> TypeScript <span>|</span> React <span>|</span> PostgreSQL
            </p>
            <p className="site-footer-bio">
              Desenvolvendo aplicações web modernas, APIs escaláveis e arquiteturas de sistemas robustas.
            </p>
          </div>

          {/* Right Column: Contact & Social Links */}
          <div className="site-footer-nav">
            <h4 className="site-footer-heading">Contato & Redes</h4>
            <ul className="site-footer-links-list">
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    target={channel.isExternal ? "_blank" : undefined}
                    rel={channel.isExternal ? "noopener noreferrer" : undefined}
                    className="site-footer-link"
                  >
                    <span>{channel.name}</span>
                    {channel.isExternal && (
                      <ArrowUpRight size={13} className="site-footer-link-arrow" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="site-footer-bottom">
          <p className="site-footer-copyright">
            © {currentYear} David Ericson. Todos os direitos reservados.
          </p>
          <p className="site-footer-tech">
            Construído com Next.js, TypeScript e Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
