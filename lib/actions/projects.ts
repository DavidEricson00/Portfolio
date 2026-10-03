"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProjects() {
  // Páginas públicas
  revalidatePath("/", "page");
  revalidatePath("/projetos", "page");
  revalidatePath("/projetos/[slug]", "page");
  revalidatePath("/sitemap.xml");

  // Área administrativa
  revalidatePath("/admin", "page");
  revalidatePath("/admin/projetos", "page");
  revalidatePath("/admin/projetos/[id]/editar", "page");
}