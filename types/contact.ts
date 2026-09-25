export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date | string;
};

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactChannel = {
  id: string;
  name: string;
  value: string;
  href: string;
  icon: "github" | "linkedin" | "email" | "whatsapp";
  isExternal?: boolean;
};
