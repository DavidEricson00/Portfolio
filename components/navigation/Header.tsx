"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { MAIN_NAV_ROUTES } from "@/data/navigation";
import "./header.css";

export function Header() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="global-header-wrapper">
      <motion.header
        className="global-header-pill"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav aria-label="Navegação principal">
          <ul className="global-header-list">
            {MAIN_NAV_ROUTES.map((route) => {
              const isActive =
                route.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(route.href);

              return (
                <li key={route.id} className="global-header-item">
                  <Link
                    href={route.href}
                    className={`global-header-link ${isActive ? "global-header-link-active" : ""}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-pill-highlight"
                        className="global-header-highlight"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="global-header-text">{route.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.header>
    </div>
  );
}
