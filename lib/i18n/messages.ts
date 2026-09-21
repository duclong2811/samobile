import en from "@/messages/en.json";
import ko from "@/messages/ko.json";
import vi from "@/messages/vi.json";
import zh from "@/messages/zh.json";
import th from "@/messages/th.json";
import ne from "@/messages/ne.json";
import uz from "@/messages/uz.json";
import type { Locale } from "./config";
export type Messages = typeof en;
const dictionaries: Record<Locale, Messages> = { en, ko, vi, zh, th, ne, uz };
export function getMessages(locale: Locale): Messages { return dictionaries[locale]; }
