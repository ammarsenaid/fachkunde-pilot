import type { NavigationItem } from "@/types/learning";

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Module", href: "/module", icon: "BookOpen" },
  { label: "Flashcards", href: "/flashcards", icon: "Layers" },
  { label: "Prüfung", href: "/pruefung", icon: "GraduationCap" },
  { label: "Lernplan", href: "/lernplan", icon: "Calendar" },
  { label: "Glossar", href: "/glossar", icon: "BookMarked" },
  { label: "Notizen", href: "/notizen", icon: "Bookmark" },
  { label: "Admin", href: "/admin", icon: "Settings" },
];
