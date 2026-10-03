import { getEducations } from "@/lib/data/education";
import EducationAdmin from "@/components/admin/EducationAdmin";

export default async function AdminFormacaoPage() {
  const educations = await getEducations();

  return <EducationAdmin initialEducations={educations} />;
}
