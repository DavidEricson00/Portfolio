import type { NavRoute, PageSection } from "@/types/navigation";

export const MAIN_NAV_ROUTES: NavRoute[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "projetos", label: "Projetos", href: "/projetos" },
  { id: "blog", label: "Blog", href: "/blog" },
];

export const HOME_SECTIONS: PageSection[] = [
  { id: "inicio", label: "Home" },
  { id: "experiencia", label: "Experiência" },
  { id: "projetos", label: "Projetos" },
  { id: "habilidades", label: "Habilidades" },
  { id: "formacao", label: "Formação" },
  { id: "contato", label: "Contato" },
];
