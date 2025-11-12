import { type LucideIcon } from "lucide-react";
import {
  Activity,
  Apple,
  BrainCircuit,
  ChartSpline,
  Home,
  Settings,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  tag?: string;
};

export const navigationLinks: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    label: "AI Coach",
    href: "/ai",
    icon: BrainCircuit,
    tag: "Beta",
  },
  {
    label: "Entrenamientos",
    href: "/training",
    icon: Activity,
  },
  {
    label: "Nutrición",
    href: "/nutrition",
    icon: Apple,
  },
  {
    label: "Métricas",
    href: "/metrics",
    icon: ChartSpline,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

