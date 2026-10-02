"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";

import { onAuthChange } from "@/lib/firebase/auth";

type AdminGuardProps = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setChecking(false);

      if (!currentUser) {
        router.replace("/admin/login");
      }
    });

    return unsubscribe;
  }, [router]);

  if (checking) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}