"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAnalytics, isSupported } from "firebase/analytics";

import { firebaseApp } from "@/lib/firebase/app";

export function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      return;
    }

    async function initializeAnalytics() {
      if (!(await isSupported())) {
        return;
      }

      getAnalytics(firebaseApp);
    }

    void initializeAnalytics();
  }, [pathname]);

  return null;
}