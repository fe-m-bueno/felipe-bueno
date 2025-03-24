import { Icon } from "@iconify/react";

export default function Badge({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 dark:bg-black/50 bg-white/85 backdrop-blur hover:bg-rose-600/80 dark:hover:bg-rose-600/80 hover:text-white transition-colors duration-200 border dark:border-white/20 border-black/20 px-2.5 py-0.5 rounded-full cursor-default">
      {icon && <Icon icon={icon} width="14" height="14" />}
      <span className="inline-flex text-xs lg:text-sm whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}
