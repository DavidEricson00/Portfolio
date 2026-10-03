"use client";

import Link from "next/link";
import {
  FolderKanban,
  Cpu,
  FileText,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Plus,
  Mail,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface DashboardStats {
  projects: number;
  technologies: number;
  posts: number;
  experiences: number;
  education: number;
}

interface AdminDashboardProps {
  stats: DashboardStats;
}

export default function AdminDashboard({
  stats,
}: AdminDashboardProps) {
  const statCards = [
    {
      title: "Projetos",
      count: stats.projects,
      href: "/admin/projetos",
      icon: FolderKanban,
      label: "projetos cadastrados",
    },
    {
      title: "Tecnologias",
      count: stats.technologies,
      href: "/admin/tecnologias",
      icon: Cpu,
      label: "tecnologias mapeadas",
    },
    {
      title: "Posts do Blog",
      count: stats.posts,
      href: "/admin/posts",
      icon: FileText,
      label: "artigos publicados",
    },
    {
      title: "Experiências",
      count: stats.experiences,
      href: "/admin/experiencias",
      icon: Briefcase,
      label: "experiências registradas",
    },
    {
      title: "Formação",
      count: stats.education,
      href: "/admin/formacao",
      icon: GraduationCap,
      label: "cursos e certificações",
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" />

      <div className="admin-dashboard-grid">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="admin-stat-card"
            >
              <div className="admin-stat-header">
                <div className="admin-stat-icon-wrapper">
                  <Icon size={20} />
                </div>

                <ArrowRight
                  size={16}
                  className="admin-stat-arrow"
                />
              </div>

              <div className="admin-stat-body">
                <span className="admin-stat-count">
                  {card.count}
                </span>

                <span className="admin-stat-label">
                  {card.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="admin-section-title">
        <Layers size={18} />
        <span>Ações Rápidas</span>
      </h2>

      <div className="admin-quick-actions-grid">
        <Link
          href="/admin/projetos"
          className="admin-quick-action-card"
        >
          <div className="admin-quick-action-icon">
            <Plus size={18} />
          </div>

          <div className="admin-quick-action-info">
            <span className="admin-quick-action-title">
              Novo Projeto
            </span>
          </div>
        </Link>

        <Link
          href="/admin/posts"
          className="admin-quick-action-card"
        >
          <div className="admin-quick-action-icon">
            <Plus size={18} />
          </div>

          <div className="admin-quick-action-info">
            <span className="admin-quick-action-title">
              Novo Post
            </span>
          </div>
        </Link>

        <Link
          href="/admin/tecnologias"
          className="admin-quick-action-card"
        >
          <div className="admin-quick-action-icon">
            <SlidersHorizontal size={18} />
          </div>

          <div className="admin-quick-action-info">
            <span className="admin-quick-action-title">
              Gerenciar Tecnologias
            </span>
          </div>
        </Link>

        <Link
          href="/admin/contatos"
          className="admin-quick-action-card"
        >
          <div className="admin-quick-action-icon">
            <Mail size={18} />
          </div>

          <div className="admin-quick-action-info">
            <span className="admin-quick-action-title">
              Ver Contatos
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}