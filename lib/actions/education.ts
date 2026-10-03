"use server";

import { revalidatePath } from "next/cache";

export async function revalidateEducation() {
  // Páginas públicas
  revalidatePath("/", "page");

  // Área administrativa
  revalidatePath("/admin", "page");
  revalidatePath("/admin/formacao", "page");
}
