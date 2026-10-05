export type AnalyticsEventMap = {
  cta_hero_click: {
    label: "ver_projetos" | "entre_em_contato";
  };

  project_card_click: {
    project_slug: string;
    project_name: string;
    source: "home_swiper" | "projects_grid";
  };

  project_github_click: {
    project_slug: string;
    project_name: string;
    source: "home_swiper" | "projects_grid" | "project_detail";
  };

  project_demo_click: {
    project_slug: string;
    project_name: string;
    source: "home_swiper" | "projects_grid" | "project_detail";
  };

  project_tech_filter: {
    tech_id: string;
    tech_name: string;
    action: "select" | "deselect";
    active_count: number;
  };

  project_search: {
    query_length: number;
    results_count: number;
  };

  project_filter_clear: {
    prev_filter_count: number;
    had_search: boolean;
  };

  blog_post_click: {
    post_slug: string;
    post_title: string;
  };

  contact_form_submit: Record<string, never>;

  contact_form_error: {
    error_type: "network" | "server";
  };

  social_click: {
    channel: "email" | "whatsapp" | "linkedin" | "github";
    source: "contact_section" | "footer";
  };

  projects_view_all_click: Record<string, never>;
};

export type AnalyticsEventName = keyof AnalyticsEventMap;