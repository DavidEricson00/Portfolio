"use client";

import { logEvent } from "firebase/analytics";

import { firebaseAnalytics } from "./analytics";
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from "./events";

export async function trackEvent<T extends AnalyticsEventName>(
  eventName: T,
  params?: AnalyticsEventMap[T]
): Promise<void> {
  try {
    const analytics = await firebaseAnalytics;

    if (!analytics) {
      return;
    }

    logEvent(analytics, eventName, params ?? {});
  } catch {
    // Analytics nunca deve quebrar a experiência do usuário.
  }
}