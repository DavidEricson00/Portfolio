"use client";

import { useEffect } from "react";

const UTM_PARAMETERS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export function UtmCleaner() {
  useEffect(() => {
    const url = new URL(window.location.href);

    const hasUtm = UTM_PARAMETERS.some((parameter) =>
      url.searchParams.has(parameter),
    );

    if (!hasUtm) {
      return;
    }

    UTM_PARAMETERS.forEach((parameter) => {
      url.searchParams.delete(parameter);
    });

    const cleanUrl = `${url.pathname}${url.search}${url.hash}`;

    window.history.replaceState({}, "", cleanUrl);
  }, []);

  return null;
}