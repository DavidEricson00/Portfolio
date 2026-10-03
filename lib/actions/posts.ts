"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePosts() {
  // Páginas públicas
  revalidatePath("/blog", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");

  // Área administrativa
  revalidatePath("/admin", "page");
  revalidatePath("/admin/posts", "page");
  revalidatePath("/admin/posts/[id]/editar", "page");
}
