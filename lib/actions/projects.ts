"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProjects() {
  // Páginas públicas
  revalidatePath("/", "page");
  revalidatePath("/projetos", "page");
  revalidatePath("/projetos/[slug]", "page");

  // Área administrativa
  revalidatePath("/admin", "page");
  revalidatePath("/admin/projetos", "page");
  revalidatePath("/admin/projetos/[id]/editar", "page");

  // Sitemap
  revalidatePath("/sitemap.xml");
}