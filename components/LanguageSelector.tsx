"use client";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import "@/node_modules/flag-icons/css/flag-icons.min.css";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const languageOptions = [
    { value: "en", label: "fi fi-us" },
    { value: "pt", label: "fi fi-br" },
    { value: "es", label: "fi fi-es" },
  ];

  const menuPlacement = "top";

  useEffect(() => {
    const detectedLang = i18n.language.toLowerCase();

    const matchedLang =
      languageOptions.find((opt) => detectedLang.startsWith(opt.value))
        ?.value || "en";
    setSelectedLanguage(matchedLang);
  }, [i18n.language]);

  const handleChange = (value: string) => {
    setSelectedLanguage(value);
    i18n.changeLanguage(value);
  };
  const { t } = useTranslation();

  return (
    <div className="relative w-fit ~text-base/md text-nowrap">
      <Listbox value={selectedLanguage} onChange={handleChange}>
        <ListboxButton className="w-fit flex justify-between items-center dark:bg-black/25 bg-white/80 backdrop-blur-sm border dark:border-white/10 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-white/50 ~text-xs/base">
          <span
            className={
              languageOptions.find((o) => o.value === selectedLanguage)?.label
            }
          />
          <ChevronDown className="pl-1 h-4 w-4 text-gray-400" />
        </ListboxButton>

        <ListboxOptions
          anchor={menuPlacement === "top" ? "top" : "bottom"}
          transition
          className={`[--anchor-gap:2px] sm:[--anchor-gap:4px] ${
            menuPlacement === "top"
              ? "origin-bottom-center"
              : "origin-top-center"
          } transition duration-200 ease-out [--anchor-] absolute dark:bg-black/65 bg-white/65 backdrop-blur-md w-fit dark:text-white border dark:border-white/10 border-black/10 rounded shadow-lg z-10 data-[closed]:scale-95 data-[closed]:opacity-0`}
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
