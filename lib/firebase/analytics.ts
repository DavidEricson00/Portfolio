import { getAnalytics, isSupported } from "firebase/analytics";

import { firebaseApp } from "./app";

export const firebaseAnalytics = isSupported().then((supported) => {
  if (!supported) {
    return null;
  }

  return getAnalytics(firebaseApp);
});