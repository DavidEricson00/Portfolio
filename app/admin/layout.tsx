"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import "@/components/admin/admin-layout.css";
import "@/components/admin/admin-ui.css";
import "@/components/admin/admin-dashboard.css";
import "@/components/admin/technologies-admin.css";
import "@/components/admin/education-admin.css";
import "@/components/admin/experience-admin.css";
import "@/components/admin/dynamic-text-list.css";
import "@/components/admin/projects-admin.css";
import "@/components/admin/posts-admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The login page manages its own layout and should not show the admin chrome or run the guard
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="admin-shell">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="admin-main-wrapper">
          <AdminHeader
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
