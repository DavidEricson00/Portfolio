import type { LucideProps } from "lucide-react";
import type { EducationCategory } from "@/types/education";
import { educationCategoryConfig } from "@/types/education";

export type EducationIconProps = LucideProps & {
  category: EducationCategory;
};

export function EducationIcon({ category, ...props }: EducationIconProps) {
  const Icon = educationCategoryConfig[category]?.icon;
  if (!Icon) return null;
  return <Icon {...props} />;
}
