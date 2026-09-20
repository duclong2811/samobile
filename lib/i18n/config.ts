export const locales = ["en", "ko", "vi"] as const;
export type Locale = (typeof locales)[number];
export const plannedLocales = ["zh", "th", "ne", "uz"] as const;
export const localeNames: Record<Locale, string> = { en: "English", ko: "한국어", vi: "Tiếng Việt" };
export const languageOptions = [
  { code: "ko", name: "한국어", description: "Korean", available: true },
  { code: "en", name: "English", description: "English", available: true },
  { code: "vi", name: "Tiếng Việt", description: "Vietnamese", available: true },
  { code: "zh", name: "中文", description: "Chinese", available: false },
  { code: "th", name: "ไทย", description: "Thai", available: false },
  { code: "ne", name: "नेपाली", description: "Nepali", available: false },
  { code: "uz", name: "O'zbek", description: "Uzbek", available: false },
] as const;
export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
