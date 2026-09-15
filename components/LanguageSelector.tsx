"use client";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import "@/node_modules/flag-icons/css/flag-icons.min.css";
import { haptic } from "@/lib/haptic";
import { useSiteContent } from "@/components/SiteContentProvider";
import { normalizeLocale, serializeLocaleCookie } from "@/lib/locale";

const languageOptions = [
  { value: "en", label: "fi fi-us" },
  { value: "pt", label: "fi fi-br" },
];

const LanguageSelector = () => {
  const { locale: selectedLanguage } = useSiteContent();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const menuPlacement = "top";

  const handleChange = (value: string) => {
    haptic();
    const nextLocale = normalizeLocale(value);
    if (!nextLocale || nextLocale === selectedLanguage) return;

    document.cookie = serializeLocaleCookie(nextLocale);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="relative w-fit ~text-base/md text-nowrap">
      <Listbox value={selectedLanguage} onChange={handleChange}>
        <ListboxButton
          aria-busy={isPending || undefined}
          className="w-fit flex justify-between items-center dark:bg-black/25 bg-white/80 backdrop-blur-sm border dark:border-white/10 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-white/50 ~text-xs/base"
        >
          <span
            className={
              languageOptions.find((o) => o.value === selectedLanguage)?.label
            }
          />
          <ChevronDown className="pl-1 h-4 w-4 text-gray-400" />
        </ListboxButton>

        <ListboxOptions
          transition
          className="origin-top-center transition duration-200 ease-out absolute top-full mt-2 dark:bg-black/65 bg-white/65 backdrop-blur-md w-fit dark:text-white border dark:border-white/10 border-black/10 rounded shadow-lg z-10 data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {languageOptions.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="cursor-pointer select-none px-4 py-2 data-[focus]:bg-blue-600 data-[focus]:text-white dark:data-[focus]:bg-blue-700/60 dark:data-[focus]:text-white"
            >
              {({ selected }) => (
                <div className="flex items-center justify-between ~text-xs/base">
                  <span className={option.label} />
                  {selected && <Check className="pl-1 ~h-3/4 ~w-3/4" />}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default LanguageSelector;
