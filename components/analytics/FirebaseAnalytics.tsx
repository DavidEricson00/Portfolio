"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";

import { firebaseApp } from "@/lib/firebase/app";

export function FirebaseAnalytics() {
  useEffect(() => {
    async function initializeAnalytics() {
      if (!(await isSupported())) {
        return;
      }

      getAnalytics(firebaseApp);
    }

    void initializeAnalytics();
  }, []);

  return null;
}