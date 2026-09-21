"use client";

import { useRef } from "react";
import type { Messages } from "@/lib/i18n/messages";

export function MobileNavigation({ m, targets }: { m: Messages; targets: string[] }) {
  const menu = useRef<HTMLDetailsElement>(null);
  function close() { menu.current?.removeAttribute("open"); }
  return <details ref={menu} className="mobile-navigation" onKeyDown={event => {
    if (event.key === "Escape") {
      close();
      menu.current?.querySelector("summary")?.focus();
    }
  }}>
    <summary><span aria-hidden="true">☰</span>{m.menu}</summary>
    <nav aria-label={m.navigation}>
      {m.nav.map((label, index) => <a key={targets[index]} href={targets[index]} onClick={close}>{label}</a>)}
      <a href="#consultation" onClick={close}>{m.consult}</a>
    </nav>
  </details>;
}
