"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

type AppShellProps = React.PropsWithChildren<{
  className?: string;
}>;

export function AppShell({
  children,
  className,
}: AppShellProps): React.ReactElement {
  return (
    <div className="relative flex min-h-screen gap-6 bg-transparent px-6 py-6 sm:px-8">
      <Sidebar />
      <motion.main
        className={cn(
          "glass-panel flex min-h-[calc(100vh-3rem)] flex-1 flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 p-6 dark:border-white/5",
          className
        )}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Topbar />
        <div className="grid flex-1 gap-6 overflow-auto rounded-2xl border border-white/10 bg-white/70 p-6 dark:border-white/5 dark:bg-neutral-950/60">
          {children}
        </div>
      </motion.main>
    </div>
  );
}

