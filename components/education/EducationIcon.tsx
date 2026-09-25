import {
  GraduationCap,
  BookOpen,
  Monitor,
  Code2,
  Award,
  type LucideProps,
} from "lucide-react";
import type { EducationType } from "@/types/education";

export type EducationIconProps = LucideProps & {
  type: EducationType;
};

export function EducationIcon({ type, ...props }: EducationIconProps) {
  switch (type) {
    case "graduacao":
      return <GraduationCap {...props} />;
    case "curso":
      return <BookOpen {...props} />;
    case "tecnico":
      return <Monitor {...props} />;
    case "bootcamp":
      return <Code2 {...props} />;
    case "certificacao":
      return <Award {...props} />;
    default:
      return <GraduationCap {...props} />;
  }
}
