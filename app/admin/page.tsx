"use client";

import { useEffect, useState } from "react";
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
import { getProjects } from "@/lib/data/projects";
import { getTechnologies } from "@/lib/data/technologies";
import { getPosts } from "@/lib/data/posts";
import { getExperiences } from "@/lib/data/experiences";
import { getEducations } from "@/lib/data/education";

interface DashboardStats {
  projects: number | null;
  technologies: number | null;
  posts: number | null;
  experiences: number | null;
  education: number | null;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: null,
    technologies: null,
    posts: null,
    experiences: null,
    education: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          projectsList,
          technologiesList,
          postsList,
          experiencesList,
          educationsList,
        ] = await Promise.allSettled([
          getProjects(),
          getTechnologies(),
          getPosts(),
          getExperiences(),
          getEducations(),
        ]);

        setStats({
          projects:
            projectsList.status === "fulfilled"
              ? projectsList.value.length
              : 0,
          technologies:
            technologiesList.status === "fulfilled"
              ? technologiesList.value.length
              : 0,
          posts:
            postsList.status === "fulfilled" ? postsList.value.length : 0,
          experiences:
            experiencesList.status === "fulfilled"
              ? experiencesList.value.length
              : 0,
          education:
            educationsList.status === "fulfilled"
              ? educationsList.value.length
              : 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

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
      <AdminPageHeader
        title="Dashboard"
      />

      {/* Cards de Métricas Principais */}
      <div className="admin-dashboard-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="admin-stat-card">
              <div className="admin-stat-header">
                <div className="admin-stat-icon-wrapper">
                  <Icon size={20} />
                </div>
                <ArrowRight size={16} className="admin-stat-arrow" />
              </div>
              <div className="admin-stat-body">
                <span className="admin-stat-count">
                  {loading || card.count === null ? "..." : card.count}
                </span>
                <span className="admin-stat-label">{card.title}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Seção de Ações Rápidas */}
      <h2 className="admin-section-title">
        <Layers size={18} />
        <span>Ações Rápidas</span>
      </h2>

      <div className="admin-quick-actions-grid">
        <Link href="/admin/projetos" className="admin-quick-action-card">
          <div className="admin-quick-action-icon">
            <Plus size={18} />
          </div>
          <div className="admin-quick-action-info">
            <span className="admin-quick-action-title">Novo Projeto</span>
          </div>
        </Link>

        <Link href="/admin/posts" className="admin-quick-action-card">
          <div className="admin-quick-action-icon">
            <Plus size={18} />
          </div>
          <div className="admin-quick-action-info">
            <span className="admin-quick-action-title">Novo Post</span>
          </div>
        </Link>

        <Link href="/admin/tecnologias" className="admin-quick-action-card">
          <div className="admin-quick-action-icon">
            <SlidersHorizontal size={18} />
          </div>
          <div className="admin-quick-action-info">
            <span className="admin-quick-action-title">
              Gerenciar Tecnologias
            </span>
          </div>
        </Link>

        <Link href="/admin/contatos" className="admin-quick-action-card">
          <div className="admin-quick-action-icon">
            <Mail size={18} />
          </div>
          <div className="admin-quick-action-info">
            <span className="admin-quick-action-title">Ver Contatos</span>
          </div>
        </Link>
      </div>
    </div>
  );
}