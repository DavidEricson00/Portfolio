export type TechnologyCategory =
  | "backend"
  | "banco_dados_orm"
  | "frontend"
  | "cloud_devops"
  | "ferramentas_outros";

export type Technology = {
  id: string;
  name: string;
  category: TechnologyCategory;
  iconUrl: string;
  featured: boolean;
  ranking: number;
};

export type CategoryConfig = {
  label: string;
  accentColor: string;
  hoverBorder: string;
  hoverBg: string;
};

export const technologyCategoryConfig: Record<TechnologyCategory, CategoryConfig> = {
  backend: {
    label: "Backend",
    accentColor: "#3b82f6",
    hoverBorder: "rgba(59, 130, 246, 0.5)",
    hoverBg: "rgba(59, 130, 246, 0.12)",
  },

  frontend: {
    label: "Frontend",
    accentColor: "#a855f7",
    hoverBorder: "rgba(168, 85, 247, 0.5)",
    hoverBg: "rgba(168, 85, 247, 0.12)",
  },

  banco_dados_orm: {
    label: "Banco de Dados & ORM",
    accentColor: "#22c55e",
    hoverBorder: "rgba(34, 197, 94, 0.5)",
    hoverBg: "rgba(34, 197, 94, 0.12)",
  },

  cloud_devops: {
    label: "Nuvem & DevOps",
    accentColor: "#f59e0b",
    hoverBorder: "rgba(245, 158, 11, 0.5)",
    hoverBg: "rgba(245, 158, 11, 0.12)",
  },

  ferramentas_outros: {
    label: "Ferramentas & Outros",
    accentColor: "#ef4444",
    hoverBorder: "rgba(239, 68, 68, 0.5)",
    hoverBg: "rgba(239, 68, 68, 0.12)",
  },
};