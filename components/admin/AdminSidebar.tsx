"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  Briefcase,
  GraduationCap,
  FileText,
  Mail,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const CONTENT_NAV_ITEMS: NavItem[] = [
  { label: "Projetos", href: "/admin/projetos", icon: FolderKanban },
  { label: "Tecnologias", href: "/admin/tecnologias", icon: Cpu },
  { label: "Experiências", href: "/admin/experiencias", icon: Briefcase },
  { label: "Formação", href: "/admin/formacao", icon: GraduationCap },
  { label: "Blog", href: "/admin/posts", icon: FileText },
];

const MESSAGES_NAV_ITEMS: NavItem[] = [
  { label: "Contatos", href: "/admin/contatos", icon: Mail },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/admin";

  const renderNavLink = (item: NavItem) => {
    const isActive =
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href);

    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`admin-nav-item ${isActive ? "admin-nav-item-active" : ""}`}
      >
        <Icon size={18} className="admin-nav-icon" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <div
        className={`admin-sidebar-backdrop ${
          isOpen ? "admin-sidebar-backdrop-visible" : ""
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${isOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-sidebar-brand" onClick={onClose}>
            <div className="admin-sidebar-logo-badge">DE</div>
            <div className="admin-sidebar-brand-info">
              <span className="admin-sidebar-brand-title">David Ericson</span>
              <span className="admin-sidebar-brand-subtitle">Admin CMS</span>
            </div>
          </Link>

          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={onClose}
            aria-label="Fechar menu lateral"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Navegação administrativa">
          <div className="admin-sidebar-group">
            <Link
              href="/admin"
              onClick={onClose}
              className={`admin-nav-item ${
                isDashboardActive ? "admin-nav-item-active" : ""
              }`}
            >
              <LayoutDashboard size={18} className="admin-nav-icon" />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="admin-sidebar-group">
            <span className="admin-sidebar-group-title">Conteúdo</span>
            {CONTENT_NAV_ITEMS.map(renderNavLink)}
          </div>

          <div className="admin-sidebar-group">
            <span className="admin-sidebar-group-title">Mensagens</span>
            {MESSAGES_NAV_ITEMS.map(renderNavLink)}
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-status">
            <span className="admin-sidebar-status-dot" />
            <span>Painel Conectado</span>
          </div>
        </div>
      </aside>
    </>
  );
}
