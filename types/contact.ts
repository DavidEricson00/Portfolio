export type ContactMessage = {
  id: string;
  name: string;
  contact: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type ContactFormData = {
  name: string;
  contact: string;
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
