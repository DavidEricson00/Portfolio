import { getTechnologies } from "@/lib/data/technologies";
import TechnologiesAdmin from "@/components/admin/TechnologiesAdmin";

export default async function AdminTecnologiasPage() {
  const technologies = await getTechnologies();

  return <TechnologiesAdmin initialTechnologies={technologies} />;
}