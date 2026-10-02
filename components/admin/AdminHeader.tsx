"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import { logout } from "@/lib/firebase/auth";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/admin/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      setLoggingOut(false);
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-mobile-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Abrir menu de navegação"
        >
          <Menu size={20} />
        </button>

        <div className="admin-header-badge">
          <ShieldCheck size={14} />
          <span>Painel Administrativo</span>
        </div>
      </div>

      <div className="admin-header-right">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-header-link"
          title="Ver o site público"
        >
          <span>Ver site</span>
          <ExternalLink size={15} />
        </Link>

        <div className="admin-header-divider" />

        <div className="admin-header-user">
          <div className="admin-user-avatar">DE</div>
          <div className="admin-user-details">
            <span className="admin-user-name">David Ericson</span>
            <span className="admin-user-role">Administrador</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="admin-logout-btn"
          aria-label="Sair do painel administrativo"
        >
          <LogOut size={15} />
          <span>{loggingOut ? "Saindo..." : "Sair"}</span>
        </button>
      </div>
    </header>
  );
}
