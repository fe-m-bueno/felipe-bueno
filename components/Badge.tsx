"use client";
import { Icon } from "@iconify/react";
import LiquidGlass from "./LiquidGlass";

export default function Badge({ name, icon }: { name: string; icon: string }) {
  return (
    <LiquidGlass
      variant="badge"
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 cursor-default"
    >
      {icon && <Icon icon={icon} width="14" height="14" />}
      <span className="inline-flex text-xs lg:text-sm whitespace-nowrap font-space-grotesk">
        {name}
      </span>
    </LiquidGlass>
  );
}
