"use server";

import { revalidatePath } from "next/cache";

export async function revalidateExperiences() {
  // Páginas públicas
  revalidatePath("/", "page");

  // Área administrativa
  revalidatePath("/admin", "page");
  revalidatePath("/admin/experiencias", "page");
  revalidatePath("/admin/experiencias/[id]/editar", "page");
}
