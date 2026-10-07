import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';

  script-src
    'self'
    'unsafe-inline'
    ${isDevelopment ? "'unsafe-eval'" : ""}
    https://va.vercel-scripts.com
    https://www.googletagmanager.com
    https://tagmanager.google.com
    https://www.clarity.ms
    https://*.clarity.ms;

  style-src
    'self'
    'unsafe-inline'
    ${isDevelopment
      ? "https://www.googletagmanager.com https://tagmanager.google.com https://fonts.googleapis.com"
      : ""};

  img-src
    'self'
    blob:
    data:
    https://i.imgur.com
    https://imgur.com
    https://img.itch.zone
    https://github.com
    https://user-images.githubusercontent.com
    https://skillicons.dev
    https://go-skill-icons.vercel.app
    https://*.clarity.ms
    https://www.googletagmanager.com
    https://ssl.gstatic.com
    https://www.gstatic.com
    ${isDevelopment
      ? "https://fonts.gstatic.com"
      : ""};

  font-src
    'self'
    data:
    ${isDevelopment ? "https://fonts.gstatic.com" : ""};

  connect-src
    'self'
    https://vitals.vercel-insights.com
    https://va.vercel-scripts.com
    https://skillicons.dev
    https://go-skill-icons.vercel.app
    https://firebase.googleapis.com
    https://firestore.googleapis.com
    https://identitytoolkit.googleapis.com
    https://securetoken.googleapis.com
    https://firebaseinstallations.googleapis.com
    https://www.googletagmanager.com
    https://*.google-analytics.com
    https://*.google.com
    https://*.clarity.ms;

  frame-src
    'self'
    https://www.googletagmanager.com;

  frame-ancestors 'none';

  object-src 'none';

  base-uri 'self';

  form-action 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "imgur.com" },
      { protocol: "https", hostname: "img.itch.zone" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "user-images.githubusercontent.com" },
      { protocol: "https", hostname: "skillicons.dev" },
      { protocol: "https", hostname: "go-skill-icons.vercel.app" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;