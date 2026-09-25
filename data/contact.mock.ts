import type { ContactChannel } from "@/types/contact";

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    name: "E-mail",
    value: "davidestudofcg@gmail.com",
    href: "mailto:davidestudofcg@gmail.com",
    icon: "email",
    isExternal: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    value: "+55 (88) 99700-8264",
    href: "https://wa.me/5588997008264",
    icon: "whatsapp",
    isExternal: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    value: "davidericson00",
    href: "https://www.linkedin.com/in/davidericson00/",
    icon: "linkedin",
    isExternal: true,
  },
  {
    id: "github",
    name: "GitHub",
    value: "DavidEricson00",
    href: "https://github.com/DavidEricson00",
    icon: "github",
    isExternal: true,
  },
];
