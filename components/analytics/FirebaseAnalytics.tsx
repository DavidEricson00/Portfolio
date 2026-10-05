"use client";

import { useEffect } from "react";
import { firebaseAnalytics } from "@/lib/firebase/analytics";

export function FirebaseAnalytics() {
  useEffect(() => {
    void firebaseAnalytics;
  }, []);

  return null;
}