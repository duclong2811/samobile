"use client";

import { useSyncExternalStore } from "react";
import type { Messages } from "@/lib/i18n/messages";

function subscribe() { return () => undefined; }
function getSnapshot() { return window.location.search; }
function getServerSnapshot() { return ""; }

export function ConsultationSelection({ m }: { m: Messages }) {
  const params = new URLSearchParams(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot));
  const phone = params.get("phone");
  const storage = params.get("storage");
  const color = params.get("color");
  const term = params.get("term");
  const price = params.get("priceKrw");
  const monthly = params.get("monthlyEstimateKrw");
  if (!phone || !storage || !color) return null;
  const colorName = m.phones.colorNames[color as keyof typeof m.phones.colorNames] ?? color;
  return <aside className="consultation-selection" aria-labelledby="consultation-selection-title">
    <h3 id="consultation-selection-title">{m.phones.selectionSummary}</h3>
    <dl>
      <div><dt>{m.phones.phone}</dt><dd>{phone}</dd></div>
      <div><dt>{m.phones.storage}</dt><dd>{storage}</dd></div>
      <div><dt>{m.phones.color}</dt><dd>{colorName}</dd></div>
      {term && <div><dt>{m.phones.installmentTerm}</dt><dd>{m.phones.months.replace("{months}", term)}</dd></div>}
      <div><dt>{m.phones.devicePrice}</dt><dd>{price ? `₩${Number(price).toLocaleString()}` : m.phones.contactForPrice}</dd></div>
      {monthly && <div><dt>{m.phones.estimatedMonthly}</dt><dd>₩{Number(monthly).toLocaleString()}</dd></div>}
    </dl>
    <p>{m.phones.noOrder}</p>
  </aside>;
}
