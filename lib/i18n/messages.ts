import en from "@/messages/en.json";
import ko from "@/messages/ko.json";
import vi from "@/messages/vi.json";
import type { Locale } from "./config";
export type Messages = typeof en;
const dictionaries: Record<Locale, Messages> = { en, ko, vi };
export function getMessages(locale: Locale): Messages { return dictionaries[locale]; }
