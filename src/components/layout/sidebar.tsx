"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/lib/navigation";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { Menu, PanelRightClose } from "lucide-react";

const sidebarVariants = {
  open: { width: 264 },
  closed: { width: 96 },
};

export function Sidebar(): React.ReactElement {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside className="relative">
      <motion.div
        className={cn(
          "glass-panel flex h-full flex-col border border-white/10 pb-6 pt-4 transition-[width] duration-300 dark:border-white/5"
        )}
        animate={sidebarCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
      >
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-content-center rounded-2xl bg-gradient-blue text-white font-semibold">
              AI
            </span>
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="leading-tight"
                >
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    AthleteAI Pro
                  </p>
                  <p className="text-base font-semibold">Coach Dashboard</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <Menu size={18} /> : <PanelRightClose size={18} />}
          </Button>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2 px-3">
          {navigationLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link key={link.href} href={link.href} className="group">
                <motion.div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-500 transition-colors",
                    "hover:text-neutral-900 dark:hover:text-white",
                    isActive &&
                      "bg-gradient-blue/10 text-neutral-950 shadow-sm dark:text-white"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <link.icon
                    size={20}
                    className={cn(
                      isActive
                        ? "text-primary"
                        : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200"
                    )}
                  />
                  <AnimatePresence initial={false}>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        transition={{ duration: 0.18 }}
                        className="flex-1"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!sidebarCollapsed && link.tag && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {link.tag}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              className="mx-4 mt-6 rounded-2xl bg-gradient-orange p-4 text-sm text-accent-foreground shadow-soft"
            >
              <p className="font-semibold">Estrategias adaptativas</p>
              <p className="mt-1 text-sm text-orange-50/80">
                AthleteAI ajusta tu carga y plan nutricional según tus métricas
                en tiempo real.
              </p>
              <Button
                variant="ghost"
                className="mt-3 h-9 w-full justify-center border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Ver roadmap
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
}

