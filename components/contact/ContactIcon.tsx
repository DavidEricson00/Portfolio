import type { SVGProps } from "react";

export type ContactIconProps = SVGProps<SVGSVGElement> & {
  name: "github" | "linkedin" | "email" | "whatsapp";
  size?: number;
};

export function ContactIcon({ name, size = 20, className, ...props }: ContactIconProps) {
  switch (name) {
    case "github":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={className}
          {...props}
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );

    case "linkedin":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={className}
          {...props}
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );

    case "email":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={className}
          {...props}
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={className}
          {...props}
        >
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
        </svg>
      );

    default:
      return null;
  }
}
