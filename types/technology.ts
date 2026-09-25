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
    accentColor: "#6c8cff",
    hoverBorder: "rgba(108, 140, 255, 0.4)",
    hoverBg: "rgba(108, 140, 255, 0.08)",
  },
  banco_dados_orm: {
    label: "Banco de Dados & ORM",
    accentColor: "#38bdf8",
    hoverBorder: "rgba(56, 189, 248, 0.4)",
    hoverBg: "rgba(56, 189, 248, 0.08)",
  },
  frontend: {
    label: "Frontend",
    accentColor: "#7c5cff",
    hoverBorder: "rgba(124, 92, 255, 0.4)",
    hoverBg: "rgba(124, 92, 255, 0.08)",
  },
  cloud_devops: {
    label: "Nuvem & DevOps",
    accentColor: "#60a5fa",
    hoverBorder: "rgba(96, 165, 250, 0.4)",
    hoverBg: "rgba(96, 165, 250, 0.08)",
  },
  ferramentas_outros: {
    label: "Ferramentas & Outros",
    accentColor: "#a78bfa",
    hoverBorder: "rgba(167, 139, 250, 0.4)",
    hoverBg: "rgba(167, 139, 250, 0.08)",
  },
};
