"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MoonStar, SunMedium, BellRing, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";

export function Topbar(): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between rounded-2xl border border-white/10 bg-white/60 px-6 py-4 shadow-lg backdrop-blur-md transition dark:border-white/5 dark:bg-neutral-950/60">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles size={14} />
          Ready for VO2 block
        </span>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            HRV +6% vs ayer
          </p>
          <p className="text-base font-semibold leading-tight">
            Semana 6 · Base Build Primavera
          </p>
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-neutral-600 hover:bg-neutral-100/60 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
        >
          {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-neutral-600 hover:bg-neutral-100/60 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
          onClick={() => router.push("/settings")}
        >
          <BellRing size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-md">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-50/70 px-3 py-1.5 dark:border-white/5 dark:bg-neutral-900/60">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-gradient-blue flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{user?.email?.split("@")[0] || "Usuario"}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Pro · Endurance
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-neutral-600 hover:bg-neutral-100/60 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}

