"use server";

import { revalidatePath } from "next/cache";

export async function revalidateTechnologies() {
  // Páginas públicas que exibem tecnologias ou projetos com tags
  revalidatePath("/", "page");
  revalidatePath("/projetos", "page");
  revalidatePath("/projetos/[slug]", "page");

  // Área administrativa
  revalidatePath("/admin", "page");
  revalidatePath("/admin/tecnologias", "page");
  revalidatePath("/admin/projetos", "page");
  revalidatePath("/admin/projetos/novo", "page");
  revalidatePath("/admin/projetos/[id]/editar", "page");
  revalidatePath("/admin/experiencias/novo", "page");
  revalidatePath("/admin/experiencias/[id]/editar", "page");
}
