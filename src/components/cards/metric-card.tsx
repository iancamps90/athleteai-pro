"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MetricCardProps = React.PropsWithChildren<{
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "steady";
  };
  variant?: "default" | "gradient" | "glass";
  className?: string;
}>;

const gradientClasses =
  "bg-gradient-blue text-white shadow-soft [&>*]:text-white [&_*]:text-white";

export function MetricCard({
  children,
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "glass",
  className,
}: MetricCardProps): React.ReactElement {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-white/10 p-6 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/5",
        variant === "glass" && "bg-white/70 backdrop-blur-xl dark:bg-neutral-950/60",
        variant === "gradient" && gradientClasses,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
            {title}
          </p>
          {value && (
            <p className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {value}
            </p>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="grid h-12 w-12 place-content-center rounded-2xl bg-white/15 text-white dark:bg-neutral-900/50">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            trend.direction === "up" && "text-green-500",
            trend.direction === "down" && "text-orange-400",
            trend.direction === "steady" && "text-neutral-500"
          )}
        >
          <span>{trend.value}</span>
          <span>vs ayer</span>
        </div>
      )}
      <div className="mt-auto">{children}</div>
    </motion.article>
  );
}

