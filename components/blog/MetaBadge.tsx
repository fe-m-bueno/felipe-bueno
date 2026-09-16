import type { ReactNode } from "react";
import LiquidGlass from "@/components/LiquidGlass";

/**
 * O badge do site (mesma variante que components/Badge.tsx usa), dimensionado
 * para a linha de metadados: mesmo tamanho da data e do tempo de leitura ao lado.
 * `Badge` não serve aqui porque fixa o próprio padding e `text-xs`.
 */
export default function MetaBadge({ children }: { children: ReactNode }) {
  return (
    <LiquidGlass
      variant="badge"
      className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase leading-[1.5] tracking-wide"
    >
      {children}
    </LiquidGlass>
  );
}
