"use client";

import { useRouter } from "next/navigation";

import AdminGuard from "@/components/admin/AdminGuard";
import { logout } from "@/lib/firebase/auth";

export default function AdminPage() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <AdminGuard>
      <main>
        <h1>Dashboard administrativo</h1>
        <p>Login realizado com sucesso.</p>

        <button onClick={handleLogout}>
          Sair
        </button>
      </main>
    </AdminGuard>
  );
}