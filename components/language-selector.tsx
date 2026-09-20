"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLocale, languageOptions, localeNames, type Locale } from "@/lib/i18n/config";
import { readPreference, savePreference } from "@/lib/i18n/preference";
import type { Messages } from "@/lib/i18n/messages";
import { Globe } from "./ui-icons";

export function LanguageSelector({ locale, copy }: { locale: Locale; copy: Messages["languageDialog"] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const previousOverflow = useRef("");
  const closeButton = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  function showDialog() {
    if (!dialog.current || dialog.current.open) return;
    if (closeButton.current) closeButton.current.hidden = !readPreference();
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    title.current?.focus();
  }

  useEffect(() => {
    const saved = readPreference();
    if (!saved) {
      if (dialog.current && !dialog.current.open) {
        if (closeButton.current) closeButton.current.hidden = !readPreference();
    previousOverflow.current = document.body.style.overflow;
        dialog.current.showModal();
        document.body.style.overflow = "hidden";
        title.current?.focus();
      }
    } else if (saved !== locale) {
      const segments = pathname.split("/");
      segments[1] = saved;
      router.replace(segments.join("/") + window.location.search + window.location.hash);
    }
    return () => { document.body.style.setProperty("overflow", previousOverflow.current); };
  }, [locale, pathname, router]);

  function selectLanguage(value: string) {
    if (!isLocale(value)) return;
    savePreference(value);
    document.body.style.setProperty("overflow", previousOverflow.current);
    dialog.current?.close();
    if (value !== locale) {
      const segments = pathname.split("/");
      segments[1] = value;
      router.push(segments.join("/") + window.location.search + window.location.hash);
    }
  }

  return <>
    <button ref={trigger} className="language-trigger" type="button" onClick={showDialog} aria-haspopup="dialog" aria-controls="language-dialog">
      <Globe /><span lang={locale}>{localeNames[locale]}</span><span aria-hidden="true" className="chevron">⌄</span>
    </button>
    <dialog ref={dialog} id="language-dialog" className="language-dialog" aria-labelledby="language-title" aria-describedby="language-description"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled):not([hidden])"));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === title.current)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => { if (!readPreference()) { event.preventDefault(); title.current?.focus(); } else { document.body.style.setProperty("overflow", previousOverflow.current); trigger.current?.focus(); } }}
      onClose={() => { document.body.style.setProperty("overflow", previousOverflow.current); trigger.current?.focus(); }}>
      <div className="dialog-brand">SA<span>mobile</span><i /></div>
      <button ref={closeButton} className="dialog-close" type="button" aria-label={copy.close} onClick={() => { if (readPreference()) dialog.current?.close(); }}>×</button>
      <div className="dialog-globe"><Globe /></div>
      <p className="dialog-welcome">{copy.welcome}</p>
      <h2 id="language-title" tabIndex={-1} ref={title}>{copy.title}</h2>
      <p id="language-description">{copy.description}</p>
      <div className="language-options">
        {languageOptions.map((option) => <button key={option.code} type="button" lang={option.code} disabled={!option.available}
          aria-label={`${option.name}${!option.available ? ` — ${copy.soon}` : ""}`}
          className={option.code === locale ? "language-option is-current" : "language-option"}
          onClick={() => selectLanguage(option.code)}>
          <span><strong>{option.name}</strong><small lang="en">{option.description}</small></span>
          {option.available ? <span aria-hidden="true" className="language-option-arrow">↗</span> : <small lang={locale}>{copy.soon}</small>}
        </button>)}
      </div>
      <p className="dialog-note">{copy.required} {copy.note}</p>
    </dialog>
  </>;
}
