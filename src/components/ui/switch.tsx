"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked: controlledChecked, onCheckedChange, ...props }, ref) => {
    const [uncontrolled, setUncontrolled] = React.useState(false);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolled;

    const toggle = () => {
      const next = !checked;
      if (!isControlled) {
        setUncontrolled(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={toggle}
        className={cn(
          "relative h-7 w-12 rounded-full border border-transparent bg-neutral-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-neutral-800",
          checked && "bg-primary",
          className
        )}
        {...props}
      >
        <motion.span
          layout
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm dark:bg-neutral-100"
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

